"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#070b12] text-[#f1f5f9] antialiased">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-20">
          <p className="text-xs font-semibold tracking-[0.14em] text-cyan-400 uppercase">Error</p>
          <h1 className="mt-3 text-3xl font-serif">Something went wrong</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            The page failed to render. You can retry or return to the portfolio home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-md border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-cyan-500/40"
            >
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
