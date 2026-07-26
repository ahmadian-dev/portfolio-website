"use client";

import {
  BoltIcon,
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  DocumentMagnifyingGlassIcon,
  EyeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectConfig } from "@/lib/projects";
import { Section } from "./ui";

const ICONS = [BuildingOffice2Icon, ShieldCheckIcon, BoltIcon, ChartBarSquareIcon, DocumentMagnifyingGlassIcon, EyeIcon];

export function ProblemSolution({ project }: { project: ProjectConfig }) {
  const reduceMotion = useReducedMotion();
  return (
    <>
      <Section id="problem" eyebrow="Problem" title={project.problem.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {project.problem.points.map((point, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={point}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduceMotion ? 0 : i * 0.05 }}
                className="glass rounded-xl p-5"
              >
                <Icon className="mb-3 h-6 w-6 text-accent" aria-hidden />
                <p className="text-sm leading-relaxed text-ink/90">{point}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>
      <Section id="solution" eyebrow="Solution" title={project.solution.title}>
        <ul className="grid gap-3 md:grid-cols-3">
          {project.solution.points.map((point) => (
            <li key={point} className="rounded-xl border border-line bg-elev px-5 py-4 text-sm text-muted">
              <span className="mb-2 block h-1 w-8 rounded bg-accent" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
