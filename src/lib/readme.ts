import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ProjectSlug } from "@/lib/projects";

export async function loadProjectReadme(slug: ProjectSlug): Promise<string> {
  const filePath = path.join(process.cwd(), "content", "projects", slug, "README.md");
  return readFile(filePath, "utf8");
}
