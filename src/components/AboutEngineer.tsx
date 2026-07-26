import Link from "next/link";
import { SITE } from "@/lib/site";

export function AboutEngineer() {
  return (
    <section id="about-engineer" className="scroll-mt-24 px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase">About Engineer</p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">{SITE.name}</h2>
        <div className="glass mt-8 rounded-2xl p-6 md:p-8">
          <p className="text-sm text-accent">{SITE.title}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Designs production-oriented AI systems: data pipelines, model training and evaluation, inference APIs, and
            clear engineering documentation. Based in {SITE.location}.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <a className="text-accent hover:underline" href={SITE.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="text-accent hover:underline" href={`mailto:${SITE.email}`}>
              Email
            </a>
            <Link className="text-accent hover:underline" href="/resume">
              Resume
            </Link>
            <Link className="text-accent hover:underline" href="/contact">
              Contact
            </Link>
            <Link className="text-accent hover:underline" href="/">
              Portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
