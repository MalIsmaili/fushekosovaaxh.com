"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { MAX_IMAGE_CHARS } from "@/lib/resize-image";

type ActionState = { error?: string; saved?: boolean };

function parseOptionalInt(value: string, min: number, max: number): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < min || n > max) return undefined; // invalid
  return n;
}

export async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole("STUDENT");

  const phone = String(formData.get("phone") ?? "").trim() || null;
  const position = String(formData.get("position") ?? "").trim() || null;
  const birthDateRaw = String(formData.get("birthDate") ?? "").trim();

  const jerseyNumber = parseOptionalInt(String(formData.get("jerseyNumber") ?? ""), 0, 99);
  const heightCm = parseOptionalInt(String(formData.get("heightCm") ?? ""), 50, 260);
  const weightKg = parseOptionalInt(String(formData.get("weightKg") ?? ""), 20, 250);

  if (jerseyNumber === undefined) return { error: "Jersey number must be between 0 and 99." };
  if (heightCm === undefined) return { error: "Height must be between 50 and 260 cm." };
  if (weightKg === undefined) return { error: "Weight must be between 20 and 250 kg." };

  // Avatars arrive already downscaled to a JPEG data URL by the browser.
  const rawImage = String(formData.get("image") ?? "").trim();
  let image: string | null = null;
  if (rawImage) {
    if (!/^data:image\/(jpeg|png|webp);base64,/.test(rawImage)) {
      return { error: "That file isn't a valid image." };
    }
    if (rawImage.length > MAX_IMAGE_CHARS) {
      return { error: "That image is too large. Please pick a smaller one." };
    }
    image = rawImage;
  }

  await prisma.$transaction([
    prisma.studentProfile.update({
      where: { userId: user.id },
      data: {
        phone,
        position,
        jerseyNumber,
        heightCm,
        weightKg,
        birthDate: birthDateRaw ? new Date(birthDateRaw) : null,
      },
    }),
    prisma.user.update({ where: { id: user.id }, data: { image } }),
  ]);

  revalidatePath("/student/profile");
  revalidatePath("/student");
  return { saved: true };
}
