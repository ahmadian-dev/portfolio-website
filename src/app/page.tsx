import Link from "next/link";
import type { Metadata } from "next";
import { PROJECTS } from "@/lib/projects";
import { SITE } from "@/lib/site";
import { Button, Pill } from "@/components/ui";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE.name} — ${SITE.title}`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <header className="grid-bg border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-24 md:px-10 lg:px-16">
          <Pill tone="ok">5 Released systems</Pill>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl text-ink md:text-6xl">{SITE.name}</h1>
          <p className="mt-3 text-lg text-muted md:text-xl">{SITE.title}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            Designing production-oriented AI systems across predictive maintenance, document intelligence, forecasting,
            analytics, and computer vision — with evaluation, APIs, and honest limitations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/projects" variant="primary">
              View Projects
            </Button>
            <Button href="/resume" variant="ghost">
              Resume
            </Button>
            <Button href="/contact" variant="ghost">
              Contact
            </Button>
            <Button href={SITE.github} variant="soft">
              GitHub
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted">{SITE.location}</p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 lg:px-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">Flagship projects</h2>
        <p className="mt-2 text-sm text-muted">One website. Interactive demos included on each project page.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group rounded-2xl border border-line bg-elev p-6 transition hover:border-accent/40"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                <Pill tone="ok">{p.status}</Pill>
                <Pill>v{p.version}</Pill>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl text-ink group-hover:text-accent">
                {p.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.subtitle}</p>
              <p className="mt-4 text-xs font-semibold tracking-wide text-accent uppercase">Open project →</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
