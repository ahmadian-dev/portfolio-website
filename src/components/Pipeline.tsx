"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BeakerIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  CubeIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { ProjectConfig } from "@/lib/projects";
import { Section } from "./ui";

const STAGE_ICONS = [CircleStackIcon, DocumentTextIcon, SparklesIcon, BeakerIcon, CubeIcon, Cog6ToothIcon];

export function Pipeline({ project }: { project: ProjectConfig }) {
  const [active, setActive] = useState(project.pipeline[0]?.id);
  const stage = project.pipeline.find((s) => s.id === active) ?? project.pipeline[0];
  const reduceMotion = useReducedMotion();

  return (
    <Section id="pipeline" eyebrow="Pipeline" title="Interactive system flow">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
        {project.pipeline.map((s, idx) => {
          const Icon = STAGE_ICONS[idx % STAGE_ICONS.length];
          const isActive = active === s.id;
          return (
            <div key={s.id} className="flex flex-1 items-stretch gap-2">
              <button
                type="button"
                onClick={() => setActive(s.id)}
                aria-pressed={isActive}
                className={`w-full rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isActive
                    ? "border-accent/50 bg-accent/10"
                    : "border-line bg-elev text-muted hover:border-accent/30"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted">{String(idx + 1).padStart(2, "0")}</span>
                  <Icon className={`h-5 w-5 ${isActive ? "text-accent" : "text-muted"}`} aria-hidden />
                </div>
                <p className={`text-sm font-semibold ${isActive ? "text-accent" : "text-ink"}`}>{s.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{s.detail}</p>
              </button>
              {idx < project.pipeline.length - 1 && (
                <div className="hidden items-center text-accent/50 lg:flex" aria-hidden>
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-elev p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <p className="text-xs font-semibold tracking-wide text-accent uppercase">Selected stage</p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-ink">{stage.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{stage.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
