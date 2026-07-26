import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDemoPage } from "@/components/ProjectDemoPage";
import { getProject, PROJECTS } from "@/lib/projects";
import { SITE } from "@/lib/site";

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
  if (!project) return { title: "Project" };
  return {
    title: project.shortName,
    description: project.subtitle,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.name,
      description: project.subtitle,
      url: `${SITE.url}/projects/${project.slug}`,
      images: [{ url: "/assets/og/og-default.png", width: 1200, height: 630, alt: project.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.subtitle,
      images: ["/assets/og/og-default.png"],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectDemoPage project={project} />;
}
