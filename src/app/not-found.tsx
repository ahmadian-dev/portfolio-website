import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-5 py-20 md:px-10">
      <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">404</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        That route is not part of this portfolio. Continue from the main sections below.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link className="text-accent hover:underline" href="/">
          Home
        </Link>
        <Link className="text-accent hover:underline" href="/projects">
          Projects
        </Link>
        <Link className="text-accent hover:underline" href="/resume">
          Resume
        </Link>
        <Link className="text-accent hover:underline" href="/contact">
          Contact
        </Link>
        <a className="text-accent hover:underline" href={SITE.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </div>
  );
}
