"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent-dim focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-10 lg:px-16">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {SITE.name}
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs md:text-sm">
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "rounded-sm transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    active ? "text-accent" : "text-muted",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-5 py-10 text-center text-xs text-muted md:px-10">
      <p>
        © {new Date().getFullYear()} {SITE.name} · {SITE.title}
      </p>
      <p className="mt-2">
        <a
          className="text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          href={SITE.url}
        >
          {SITE.url.replace("https://", "")}
        </a>
        {" · "}
        <a
          className="text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        {" · "}
        <a
          className="text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          href={`mailto:${SITE.email}`}
        >
          Email
        </a>
      </p>
    </footer>
  );
}
