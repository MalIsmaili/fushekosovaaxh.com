export type AttendanceWindow = "BEFORE" | "OPEN" | "CLOSED";

/**
 * Attendance can only be marked while a training is in progress: from its start
 * time until its end time. Before the start it's too early; after the end it's
 * locked. A training with no end time stays open once it has started.
 */
export function getAttendanceWindow(
  startsAt: Date,
  endsAt: Date | null,
  now: Date = new Date(),
): AttendanceWindow {
  if (now < startsAt) return "BEFORE";
  if (endsAt && now > endsAt) return "CLOSED";
  return "OPEN";
}
