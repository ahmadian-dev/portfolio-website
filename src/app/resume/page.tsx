import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
import { Pill } from "@/components/ui";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume — ${SITE.name}, ${SITE.title}.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 lg:px-16">
      <Pill>Resume</Pill>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-ink">{SITE.name}</h1>
      <p className="mt-2 text-accent">{SITE.title}</p>
      <p className="mt-2 text-sm text-muted">
        {SITE.email} · {SITE.phone} · {SITE.location}
      </p>
      <p className="mt-1 text-sm text-muted">
        <a href={SITE.github} className="text-accent hover:underline" target="_blank" rel="noreferrer">
          GitHub
        </a>
        {" · "}
        <a href={SITE.url} className="text-accent hover:underline">
          {SITE.url.replace("https://", "")}
        </a>
      </p>

      <section className="mt-10">
        <h2 className="border-b border-line pb-2 text-xs font-semibold tracking-wide text-muted uppercase">Summary</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          AI / Machine Learning Engineer focused on production-oriented ML and applied AI systems. Flagship public
          portfolio of five Released systems with evaluation metrics, FastAPI serving, Docker packaging, and hiring
          presentation packs.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="border-b border-line pb-2 text-xs font-semibold tracking-wide text-muted uppercase">
          Core skills
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            <span className="text-ink">Machine Learning:</span> Scikit-learn, LightGBM, evaluation discipline, leakage
            control
          </li>
          <li>
            <span className="text-ink">Deep Learning / CV:</span> PyTorch, classification, detection, segmentation,
            Grad-CAM
          </li>
          <li>
            <span className="text-ink">NLP / LLMs:</span> Embeddings, RAG patterns, NL→SQL, citation-oriented systems
          </li>
          <li>
            <span className="text-ink">MLOps / Backend:</span> FastAPI, Docker, MLflow, pytest, GitHub Actions
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="border-b border-line pb-2 text-xs font-semibold tracking-wide text-muted uppercase">
          Flagship projects
        </h2>
        <ul className="mt-3 space-y-4">
          {PROJECTS.map((p) => (
            <li key={p.slug} className="text-sm">
              <Link href={`/projects/${p.slug}`} className="font-medium text-ink hover:text-accent">
                {p.name}
              </Link>
              <span className="text-muted"> — {p.status}</span>
              <p className="mt-1 text-muted">{p.subtitle}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-xs text-muted">
        Prefer a PDF? Email {SITE.email} and request the ATS resume export.
      </p>
    </div>
  );
}
