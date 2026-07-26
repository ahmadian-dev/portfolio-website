import {
  ArrowTopRightOnSquareIcon,
  BeakerIcon,
  BookOpenIcon,
  CircleStackIcon,
  CloudIcon,
  CommandLineIcon,
  CubeIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import type { ProjectConfig } from "@/lib/projects";
import { Section } from "./ui";
import { AboutEngineer } from "./AboutEngineer";

const ICON_CYCLE = [
  CloudIcon,
  CommandLineIcon,
  BeakerIcon,
  DocumentCheckIcon,
  BookOpenIcon,
  CubeIcon,
  CircleStackIcon,
  ShieldCheckIcon,
];

export function QualityIntegrityRepo({ project }: { project: ProjectConfig }) {
  return (
    <>
      <Section id="quality" eyebrow="Engineering Quality" title="Production packaging signals">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {project.engineering.map((item, i) => {
            const Icon = ICON_CYCLE[i % ICON_CYCLE.length];
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-line bg-elev p-4 transition hover:border-accent/40"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink group-hover:text-accent">{item.label}</p>
                  <p className="mt-1 text-xs text-muted">{item.detail}</p>
                </div>
                <ArrowTopRightOnSquareIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted group-hover:text-accent" aria-hidden />
              </a>
            );
          })}
        </div>
      </Section>

      <Section id="integrity" eyebrow="Integrity" title="Engineering decisions & limitations">
        <ul className="space-y-3">
          {project.integrity.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-ink/90"
            >
              <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-warn" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="repository" eyebrow="Repository" title="Source of truth">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {project.repoLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-line bg-elev px-4 py-4 text-sm font-medium text-ink transition hover:border-accent/40 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}

export { AboutEngineer };
