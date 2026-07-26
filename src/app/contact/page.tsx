import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { Button, Pill } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.name} — ${SITE.title}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 lg:px-16">
      <Pill>Contact</Pill>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-ink">Let&apos;s talk</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Open to Machine Learning Engineer, Applied AI Engineer, Computer Vision Engineer, and related Data Science /
        Analytics Engineering roles. Comfortable with async written collaboration.
      </p>
      <div className="mt-8 space-y-3 rounded-2xl border border-line bg-elev p-6 text-sm">
        <p>
          <span className="text-muted">Email</span>
          <br />
          <a className="text-accent hover:underline" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </p>
        <p>
          <span className="text-muted">Phone</span>
          <br />
          <a className="text-ink hover:text-accent" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>
            {SITE.phone}
          </a>
        </p>
        <p>
          <span className="text-muted">GitHub</span>
          <br />
          <a className="text-accent hover:underline" href={SITE.github} target="_blank" rel="noreferrer">
            {SITE.github.replace("https://", "")}
          </a>
        </p>
        <p>
          <span className="text-muted">Portfolio</span>
          <br />
          <a className="text-accent hover:underline" href={SITE.url}>
            {SITE.url.replace("https://", "")}
          </a>
        </p>
        <p>
          <span className="text-muted">Location</span>
          <br />
          <span className="text-ink">{SITE.location}</span>
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={`mailto:${SITE.email}`} variant="primary">
          Send email
        </Button>
        <Button href={SITE.github} variant="ghost">
          GitHub profile
        </Button>
      </div>
    </div>
  );
}
