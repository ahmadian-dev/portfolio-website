import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { Pipeline } from "@/components/Pipeline";
import { Architecture } from "@/components/Architecture";
import { AboutEngineer, QualityIntegrityRepo } from "@/components/QualityIntegrityRepo";
import { PresentationLinks } from "@/components/PresentationLinks";
import type { ProjectConfig } from "@/lib/projects";
import { Section } from "@/components/ui";

const ApiExplorer = dynamic(() => import("@/components/ApiExplorer").then((m) => m.ApiExplorer), {
  loading: () => <SectionSkeleton title="API Explorer" />,
});
const InteractiveDemo = dynamic(
  () => import("@/components/InteractiveDemo").then((m) => m.InteractiveDemo),
  { loading: () => <SectionSkeleton title="Interactive Demo" /> },
);
const Performance = dynamic(() => import("@/components/Performance").then((m) => m.Performance), {
  loading: () => <SectionSkeleton title="Performance" />,
});

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-muted">Loading {title}…</p>
      </div>
    </section>
  );
}

export function ProjectDemoPage({ project }: { project: ProjectConfig }) {
  return (
    <>
      <Hero project={project} />
      <ProblemSolution project={project} />
      <Pipeline project={project} />
      <Architecture project={project} />
      <InteractiveDemo project={project} />
      <Performance project={project} />
      <QualityIntegrityRepo project={project} />
      <PresentationLinks project={project} />
      <ApiExplorer project={project} />
      <Section id="readme" eyebrow="README" title="Source documentation">
        <a
          href={`${project.github}#readme`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-xl border border-line bg-elev px-5 py-4 text-sm text-accent hover:border-accent/40"
        >
          Open project README on GitHub →
        </a>
      </Section>
      <AboutEngineer />
    </>
  );
}
