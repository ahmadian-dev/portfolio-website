import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { Pill } from "@/components/ui";

export const metadata: Metadata = {
  title: "Projects",
  description: "Five Released flagship AI/ML systems with interactive demos, metrics, and FastAPI packaging.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 lg:px-16">
      <Pill>Projects</Pill>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-ink">Flagship Portfolio</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Each project page includes problem framing, pipeline, architecture, interactive demo, performance, integrity,
        and repository links — one product experience.
      </p>
      <div className="mt-10 grid gap-4">
        {PROJECTS.map((p, idx) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="rounded-2xl border border-line bg-elev p-6 transition hover:border-accent/40"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted">{String(idx + 1).padStart(2, "0")}</span>
              <Pill tone="ok">{p.status}</Pill>
              <Pill>{p.domain}</Pill>
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-ink">{p.name}</h2>
            <p className="mt-2 text-sm text-muted">{p.subtitle}</p>
            <p className="mt-4 text-xs font-semibold tracking-wide text-accent uppercase">Open interactive project →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
