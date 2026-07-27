import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";
import { projectHref, type ProjectSubpage } from "@/lib/project-routes";
import { SITE } from "@/lib/site";

const SUBPAGES: ProjectSubpage[] = ["presentation", "dashboard", "architecture", "readme"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/projects", "/resume", "/contact"].map((path) => ({
    url: `${SITE.url}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes = PROJECTS.flatMap((p) => {
    const base = {
      url: `${SITE.url}${projectHref(p.slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    };
    const subs = SUBPAGES.map((page) => ({
      url: `${SITE.url}${projectHref(p.slug, page)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
    return [base, ...subs];
  });

  return [...staticRoutes, ...projectRoutes];
}
