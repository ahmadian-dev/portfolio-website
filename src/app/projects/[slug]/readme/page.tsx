import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectSubnav } from "@/components/ProjectSubnav";
import { ReadmeMarkdown } from "@/components/ReadmeMarkdown";
import { getProject, PROJECTS } from "@/lib/projects";
import { projectSubpageJsonLd, projectSubpageMetadata } from "@/lib/project-metadata";
import { projectHref } from "@/lib/project-routes";
import { loadProjectReadme } from "@/lib/readme";

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
  if (!project) return { title: "README" };
  const path = projectHref(project.slug, "readme");
  return projectSubpageMetadata(project, {
    title: "README",
    description: `Project README for ${project.name}.`,
    path,
  });
}

export default async function ReadmePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const path = projectHref(project.slug, "readme");
  const markdown = await loadProjectReadme(project.slug);
  const jsonLd = projectSubpageJsonLd(project, {
    title: "README",
    description: `Project README for ${project.name}.`,
    path,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectSubnav project={project} active="readme" />
      <section className="px-5 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase">README</p>
          <h1 className="mb-8 font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
            Source documentation
          </h1>
          <ReadmeMarkdown markdown={markdown} />
        </div>
      </section>
    </>
  );
}
