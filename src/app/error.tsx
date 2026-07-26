"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col justify-center px-5 py-16 md:px-10">
      <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">Error</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink">Unable to load this page</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-accent-dim px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
