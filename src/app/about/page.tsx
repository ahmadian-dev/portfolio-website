import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { Pill } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name} — ${SITE.title}. Engineering-first AI/ML portfolio.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 lg:px-16">
      <Pill>About</Pill>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-ink">{SITE.name}</h1>
      <p className="mt-2 text-lg text-accent">{SITE.title}</p>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
        <p>
          I design production-oriented AI and machine learning systems: data pipelines, model training and evaluation,
          inference APIs, and clear engineering documentation.
        </p>
        <p>
          My public flagship portfolio covers five Released systems — predictive maintenance, document intelligence,
          forecasting, AI SQL Copilot, and computer vision inspection — each with measured evaluation, FastAPI serving,
          and a hiring presentation pack.
        </p>
        <p>Engineering-first. Enterprise mindset. No hype. Honest status labels and reproducible setups.</p>
      </div>
      <h2 className="mt-10 font-[family-name:var(--font-display)] text-xl text-ink">Principles</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
        <li>Engineering first</li>
        <li>Honest status labels</li>
        <li>Evaluation before hype</li>
        <li>Enterprise maintainability</li>
      </ul>
      <h2 className="mt-10 font-[family-name:var(--font-display)] text-xl text-ink">Not a fit</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
        <li>Prompt-only packaging without systems work</li>
        <li>Guaranteed accuracy without data constraints</li>
        <li>No-code reseller positioning</li>
      </ul>
      <p className="mt-10 text-sm">
        <Link href="/contact" className="text-accent hover:underline">
          Contact
        </Link>{" "}
        ·{" "}
        <Link href="/resume" className="text-accent hover:underline">
          Resume
        </Link>{" "}
        ·{" "}
        <a href={SITE.github} className="text-accent hover:underline" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </div>
  );
}
