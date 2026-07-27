import type { ProjectSlug } from "@/lib/projects";

export type ProjectSubpage = "presentation" | "dashboard" | "architecture" | "readme";

export function projectHref(slug: ProjectSlug, page?: ProjectSubpage): string {
  return page ? `/projects/${slug}/${page}` : `/projects/${slug}`;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
