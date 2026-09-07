"use client";

import { useActionState, useRef, useState } from "react";
import { updateProfileAction } from "./actions";
import { useI18n } from "@/components/I18nProvider";
import { Avatar } from "@/components/Avatar";
import { resizeImageToDataUrl, MAX_IMAGE_CHARS } from "@/lib/resize-image";

const positions = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"] as const;

type Values = {
  phone: string;
  position: string;
  jerseyNumber: string;
  heightCm: string;
  weightKg: string;
  birthDate: string;
  image: string;
  name: string;
};

export function ProfileForm({ initial }: { initial: Values }) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(updateProfileAction, {});
  const [image, setImage] = useState(initial.image);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      if (dataUrl.length > MAX_IMAGE_CHARS) {
        setPhotoError(t.student.photoTooLarge);
        return;
      }
      setImage(dataUrl);
    } catch {
      setPhotoError(t.student.photoInvalid);
    }
  }

  return (
    <form action={formAction} className="card max-w-xl space-y-5">
      <input type="hidden" name="image" value={image} />

      <div>
        <span className="label">{t.student.profilePhoto}</span>
        <div className="flex items-center gap-4">
          <Avatar src={image || null} name={initial.name} size="lg" />
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>
                {image ? t.student.changePhoto : t.student.choosePhoto}
              </button>
              {image && (
                <button type="button" className="btn-ghost" onClick={() => setImage("")}>
                  {t.student.removePhoto}
                </button>
              )}
            </div>
            <p className="text-xs text-foreground/60">{t.student.photoHint}</p>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickFile}
        />
        {photoError && <p className="mt-2 text-sm text-red-600">{photoError}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="jerseyNumber">
            {t.student.jerseyNumber}
          </label>
          <input
            id="jerseyNumber"
            name="jerseyNumber"
            type="number"
            min={0}
            max={99}
            className="input"
            defaultValue={initial.jerseyNumber}
            placeholder="23"
          />
        </div>
        <div>
          <label className="label" htmlFor="position">
            {t.student.position}
          </label>
          <select id="position" name="position" className="input" defaultValue={initial.position}>
            <option value="">{t.student.selectPosition}</option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {t.positions[p]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="heightCm">
            {t.student.heightCm}
          </label>
          <input
            id="heightCm"
            name="heightCm"
            type="number"
            min={50}
            max={260}
            className="input"
            defaultValue={initial.heightCm}
            placeholder="180"
          />
        </div>
        <div>
          <label className="label" htmlFor="weightKg">
            {t.student.weightKg}
          </label>
          <input
            id="weightKg"
            name="weightKg"
            type="number"
            min={20}
            max={250}
            className="input"
            defaultValue={initial.weightKg}
            placeholder="72"
          />
        </div>
        <div>
          <label className="label" htmlFor="birthDate">
            {t.student.birthDate}
          </label>
          <input id="birthDate" name="birthDate" type="date" className="input" defaultValue={initial.birthDate} />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            {t.student.phone}
          </label>
          <input
            id="phone"
            name="phone"
            className="input"
            defaultValue={initial.phone}
            placeholder="+383 4X XXX XXX"
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.saved && <p className="text-sm text-success-600">{t.student.profileSaved}</p>}

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? t.common.saving : t.student.saveProfile}
      </button>
    </form>
  );
}
