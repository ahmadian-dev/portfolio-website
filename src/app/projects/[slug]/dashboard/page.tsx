import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { ProjectSubnav } from "@/components/ProjectSubnav";
import { getProject, PROJECTS } from "@/lib/projects";
import { projectSubpageJsonLd, projectSubpageMetadata } from "@/lib/project-metadata";
import { projectHref } from "@/lib/project-routes";

const Performance = dynamic(() => import("@/components/Performance").then((m) => m.Performance), {
  loading: () => (
    <section className="px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-muted">Loading Performance Dashboard…</p>
      </div>
    </section>
  ),
});

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
  if (!project) return { title: "Dashboard" };
  const path = projectHref(project.slug, "dashboard");
  return projectSubpageMetadata(project, {
    title: "Performance Dashboard",
    description: `Measured evaluation results for ${project.name}.`,
    path,
  });
}

export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const path = projectHref(project.slug, "dashboard");
  const jsonLd = projectSubpageJsonLd(project, {
    title: "Performance Dashboard",
    description: `Measured evaluation results for ${project.name}.`,
    path,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectSubnav project={project} active="dashboard" />
      <Performance project={project} />
    </>
  );
}
