"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <p className="text-5xl">🚨</p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Something went wrong.</h1>
        <p className="mt-2 max-w-md text-foreground/70">{error.message || "An unexpected error occurred."}</p>
        <button type="button" className="btn-primary mt-6" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
