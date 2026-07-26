"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={clsx("scroll-mt-24 px-5 py-16 md:px-10 lg:px-16", className)} aria-labelledby={`${id}-title`}>
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase">{eyebrow}</p>
        <h2 id={`${id}-title`} className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "ok" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        tone === "ok" ? "border-emerald-500/40 text-ok" : "border-line text-muted",
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "soft";
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">) {
  const cls = clsx(
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition",
    focusRing,
    variant === "primary" && "bg-accent-dim text-white hover:bg-cyan-600",
    variant === "ghost" && "border border-line text-ink hover:border-accent/40 hover:text-accent",
    variant === "soft" && "bg-soft text-ink hover:bg-slate-800",
    disabled && "pointer-events-none opacity-50",
  );
  if (href) {
    return (
      <a
        className={cls}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        aria-label={ariaLabel}
        download={href.endsWith(".png") ? true : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
