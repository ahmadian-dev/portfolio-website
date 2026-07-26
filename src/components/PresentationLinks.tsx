import type { ProjectConfig } from "@/lib/projects";
import { Section } from "./ui";

export function PresentationLinks({ project }: { project: ProjectConfig }) {
  const presentation = project.repoLinks.find((l) => l.label === "Presentation");
  const dashboard = project.repoLinks.find((l) => l.label === "Dashboard");
  const architecture = project.repoLinks.find((l) => l.label === "Architecture");

  return (
    <Section id="presentation" eyebrow="Presentation" title="Hiring presentation pack">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Presentation pack", href: presentation?.href },
          { label: "Performance dashboard", href: dashboard?.href },
          { label: "Architecture page", href: architecture?.href },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href ?? project.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-line bg-elev px-4 py-4 text-sm font-medium text-ink transition hover:border-accent/40 hover:text-accent"
          >
            {item.label}
          </a>
        ))}
      </div>
    </Section>
  );
}
