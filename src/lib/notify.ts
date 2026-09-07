import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { formatEventRange } from "@/lib/format";
import type { AttendanceStatus } from "@prisma/client";

type Recipient = { userId: string; email: string; name: string | null };

async function resolveRecipients(studentUserIds: string[]): Promise<Recipient[]> {
  if (studentUserIds.length === 0) return [];

  const students = await prisma.user.findMany({
    where: { id: { in: studentUserIds } },
    select: { id: true, email: true, name: true },
  });

  const parentLinks = await prisma.parentChildLink.findMany({
    where: { studentId: { in: studentUserIds } },
    select: { parent: { select: { id: true, email: true, name: true } } },
  });

  const byId = new Map<string, Recipient>();
  for (const s of students) byId.set(s.id, { userId: s.id, email: s.email, name: s.name });
  for (const { parent } of parentLinks) {
    byId.set(parent.id, { userId: parent.id, email: parent.email, name: parent.name });
  }

  return [...byId.values()];
}

export async function notifyTrainingCreated(trainingId: string) {
  const training = await prisma.training.findUniqueOrThrow({
    where: { id: trainingId },
    include: { groupAge: true },
  });

  const students = await prisma.studentProfile.findMany({
    where: { groupAgeId: training.groupAgeId, status: "APPROVED" },
    select: { userId: true },
  });

  const recipients = await resolveRecipients(students.map((s) => s.userId));
  const when = formatEventRange(training.startsAt, training.endsAt);
  const message = `New training for ${training.groupAge.name}: ${when}${
    training.location ? ` at ${training.location}` : ""
  }.${training.notes ? ` ${training.notes}` : ""}`;

  await dispatch(recipients, "training", training.id, message, `New training – ${training.groupAge.name}`);
}

export async function notifyGameCreated(gameId: string) {
  const game = await prisma.game.findUniqueOrThrow({
    where: { id: gameId },
    include: { groupAge: true, roster: { select: { student: { select: { userId: true } } } } },
  });

  const recipients = await resolveRecipients(game.roster.map((r) => r.student.userId));
  const when = formatEventRange(game.startsAt, game.endsAt);
  const message = `New game for ${game.groupAge.name} vs ${game.opponent}: ${when}${
    game.location ? ` at ${game.location}` : ""
  }.${game.notes ? ` ${game.notes}` : ""}`;

  await dispatch(recipients, "game", game.id, message, `New game – ${game.groupAge.name} vs ${game.opponent}`);
}

export async function notifyAttendanceMarked(
  trainingId: string,
  studentProfileId: string,
  status: AttendanceStatus,
) {
  const [training, profile] = await Promise.all([
    prisma.training.findUniqueOrThrow({ where: { id: trainingId }, include: { groupAge: true } }),
    prisma.studentProfile.findUniqueOrThrow({
      where: { id: studentProfileId },
      include: { user: { select: { name: true, email: true, id: true } } },
    }),
  ]);

  // Parents are linked to the student's User account; email each linked parent.
  const parentLinks = await prisma.parentChildLink.findMany({
    where: { studentId: profile.user.id },
    select: { parent: { select: { id: true, email: true, name: true } } },
  });
  if (parentLinks.length === 0) return;

  const playerName = profile.user.name ?? profile.user.email;
  const statusWord = status === "PRESENT" ? "present" : "absent";
  const when = formatEventRange(training.startsAt, training.endsAt);
  const subject = `${playerName} was marked ${statusWord} — ${training.title}`;
  const message = `${playerName} was marked ${statusWord} for the ${training.groupAge.name} training "${training.title}" (${when}).`;

  await Promise.all(
    parentLinks.map(async ({ parent }) => {
      await prisma.notification.create({
        data: {
          userId: parent.id,
          type: "TRAINING",
          trainingId,
          message,
          emailSentAt: new Date(),
        },
      });
      await sendEmail(parent.email, subject, message);
    }),
  );
}

async function dispatch(
  recipients: Recipient[],
  type: "training" | "game",
  relatedId: string,
  message: string,
  subject: string,
) {
  await Promise.all(
    recipients.map(async (recipient) => {
      await prisma.notification.create({
        data: {
          userId: recipient.userId,
          type: type === "training" ? "TRAINING" : "GAME",
          trainingId: type === "training" ? relatedId : undefined,
          gameId: type === "game" ? relatedId : undefined,
          message,
          emailSentAt: new Date(),
        },
      });
      await sendEmail(recipient.email, subject, message);
    }),
  );
}
