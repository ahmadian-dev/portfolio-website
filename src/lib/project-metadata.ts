import type { Metadata } from "next";
import type { ProjectConfig } from "@/lib/projects";
import { SITE } from "@/lib/site";

export function projectSubpageMetadata(
  project: ProjectConfig,
  opts: { title: string; description: string; path: string },
): Metadata {
  const url = `${SITE.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: `${opts.title} · ${project.shortName}`,
      description: opts.description,
      url,
      images: [{ url: "/assets/og/og-default.png", width: 1200, height: 630, alt: project.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${opts.title} · ${project.shortName}`,
      description: opts.description,
      images: ["/assets/og/og-default.png"],
    },
  };
}

export function projectSubpageJsonLd(
  project: ProjectConfig,
  opts: { title: string; description: string; path: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.title,
    description: opts.description,
    url: `${SITE.url}${opts.path}`,
    isPartOf: { "@type": "WebSite", name: `${SITE.name} Portfolio`, url: SITE.url },
    about: {
      "@type": "SoftwareApplication",
      name: project.name,
      url: `${SITE.url}/projects/${project.slug}`,
    },
    author: { "@type": "Person", name: SITE.name, url: SITE.url },
  };
}
