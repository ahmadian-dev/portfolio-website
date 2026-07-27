import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PresentationFrame } from "@/components/PresentationFrame";
import { ProjectSubnav } from "@/components/ProjectSubnav";
import { getProject, PROJECTS } from "@/lib/projects";
import { projectSubpageJsonLd, projectSubpageMetadata } from "@/lib/project-metadata";
import { projectHref } from "@/lib/project-routes";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Presentation" };
  const path = projectHref(project.slug, "presentation");
  return projectSubpageMetadata(project, {
    title: "Presentation",
    description: `Hiring presentation pack for ${project.name}.`,
    path,
  });
}

export default async function PresentationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const path = projectHref(project.slug, "presentation");
  const jsonLd = projectSubpageJsonLd(project, {
    title: "Presentation",
    description: `Hiring presentation pack for ${project.name}.`,
    path,
  });
  const packSrc = `/assets/projects/${project.proxyId}/pack/index.html`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectSubnav project={project} active="presentation" />
      <section className="px-5 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase">Presentation</p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
            Hiring presentation pack
          </h1>
          <div className="mt-8">
            <PresentationFrame src={packSrc} title={`${project.shortName} presentation`} />
          </div>
        </div>
      </section>
    </>
  );
}
