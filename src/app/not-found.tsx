import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <p className="text-5xl">🏀</p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Air ball.</h1>
        <p className="mt-2 text-foreground/70">We couldn&apos;t find that page.</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back to home
        </Link>
      </div>
    </main>
  );
}
