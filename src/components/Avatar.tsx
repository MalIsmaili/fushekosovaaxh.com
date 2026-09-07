function initialsOf(name: string | null | undefined, fallback: string) {
  const source = (name ?? fallback).trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizes = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-24 w-24 text-xl",
} as const;

export function Avatar({
  src,
  name,
  email,
  size = "sm",
  className = "",
}: {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const base = `${sizes[size]} shrink-0 rounded-full object-cover ${className}`;

  if (src) {
    // Photos are stored as data URLs, so next/image's optimizer doesn't apply.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name ?? email ?? "Player"} className={`${base} border border-border`} />;
  }

  return (
    <span
      className={`${base} flex items-center justify-center border border-border bg-surface-muted font-semibold text-foreground/60`}
      aria-hidden="true"
    >
      {initialsOf(name, email ?? "")}
    </span>
  );
}
