import Link from "next/link";
import type { ProjectConfig } from "@/lib/projects";
import { projectHref, type ProjectSubpage } from "@/lib/project-routes";

const TABS: { page: ProjectSubpage | null; label: string }[] = [
  { page: null, label: "Overview" },
  { page: "presentation", label: "Presentation" },
  { page: "dashboard", label: "Dashboard" },
  { page: "architecture", label: "Architecture" },
  { page: "readme", label: "README" },
];

export function ProjectSubnav({
  project,
  active,
}: {
  project: ProjectConfig;
  active: ProjectSubpage | "overview";
}) {
  return (
    <div className="border-b border-line bg-elev/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 md:px-10 lg:px-16">
        <p className="text-xs text-muted">
          <Link href="/projects" className="text-accent hover:underline">
            Projects
          </Link>
          <span aria-hidden> / </span>
          <Link href={projectHref(project.slug)} className="text-accent hover:underline">
            {project.shortName}
          </Link>
          {active !== "overview" && (
            <>
              <span aria-hidden> / </span>
              <span className="text-ink">{active}</span>
            </>
          )}
        </p>
        <nav className="flex flex-wrap gap-2" aria-label="Project sections">
          {TABS.map((tab) => {
            const href = tab.page ? projectHref(project.slug, tab.page) : projectHref(project.slug);
            const isActive = tab.page === null ? active === "overview" : active === tab.page;
            return (
              <Link
                key={tab.label}
                href={href}
                className={
                  isActive
                    ? "rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
                    : "rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:border-accent/40 hover:text-accent"
                }
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
