"use client";

import {
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  ChartBarIcon,
  CodeBracketSquareIcon,
  CubeTransparentIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectConfig } from "@/lib/projects";
import { Button, Pill } from "./ui";

export function Hero({ project }: { project: ProjectConfig }) {
  const reduceMotion = useReducedMotion();
  return (
    <header className="grid-bg relative overflow-hidden border-b border-line">
      <div className="mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-5 py-16 md:px-10 lg:px-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
        >
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Pill tone="ok">{project.status}</Pill>
            <Pill>v{project.version}</Pill>
            <Pill>{project.domain}</Pill>
          </div>
          <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-3xl leading-tight text-ink md:text-5xl">
            {project.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{project.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={project.github} variant="primary">
              <CodeBracketSquareIcon className="h-4 w-4" />
              GitHub
              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
            </Button>
            <Button href="#demo" variant="ghost">
              Interactive Demo
            </Button>
            <Button href="#api" variant="ghost">
              API Docs
            </Button>
            <Button href="#architecture" variant="ghost">
              <CubeTransparentIcon className="h-4 w-4" />
              Architecture
            </Button>
            <Button href="#performance" variant="soft">
              <ChartBarIcon className="h-4 w-4" />
              Performance
            </Button>
            <Button href="#presentation" variant="soft">
              <PresentationChartBarIcon className="h-4 w-4" />
              Presentation
            </Button>
            <Button href={`${project.github}#readme`} variant="ghost">
              <BookOpenIcon className="h-4 w-4" />
              README
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted">
            Interactive calls proxy through this site → FastAPI. Configure{" "}
            <span className="font-mono text-accent/90">{project.apiEnvKey}</span>.
          </p>
        </motion.div>
      </div>
    </header>
  );
}
