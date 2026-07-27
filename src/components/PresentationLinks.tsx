import Link from "next/link";
import type { ProjectConfig } from "@/lib/projects";
import { projectHref } from "@/lib/project-routes";
import { Section } from "./ui";

export function PresentationLinks({ project }: { project: ProjectConfig }) {
  const items = [
    { label: "Presentation pack", href: projectHref(project.slug, "presentation") },
    { label: "Performance dashboard", href: projectHref(project.slug, "dashboard") },
    { label: "Architecture page", href: projectHref(project.slug, "architecture") },
  ];

  return (
    <Section id="presentation" eyebrow="Presentation" title="Hiring presentation pack">
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-xl border border-line bg-elev px-4 py-4 text-sm font-medium text-ink transition hover:border-accent/40 hover:text-accent"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </Section>
  );
}
