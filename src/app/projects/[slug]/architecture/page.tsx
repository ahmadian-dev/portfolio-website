import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Architecture } from "@/components/Architecture";
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
  if (!project) return { title: "Architecture" };
  const path = projectHref(project.slug, "architecture");
  return projectSubpageMetadata(project, {
    title: "Architecture",
    description: `System architecture for ${project.name}.`,
    path,
  });
}

export default async function ArchitecturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const path = projectHref(project.slug, "architecture");
  const jsonLd = projectSubpageJsonLd(project, {
    title: "Architecture",
    description: `System architecture for ${project.name}.`,
    path,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectSubnav project={project} active="architecture" />
      <Architecture project={project} />
    </>
  );
}
