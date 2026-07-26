"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectConfig } from "@/lib/projects";
import { Section } from "./ui";

export function Pipeline({ project }: { project: ProjectConfig }) {
  const [active, setActive] = useState(project.pipeline[0]?.id);
  const stage = project.pipeline.find((s) => s.id === active) ?? project.pipeline[0];

  return (
    <Section id="pipeline" eyebrow="Pipeline" title="Interactive system flow">
      <div className="flex flex-wrap gap-2">
        {project.pipeline.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              active === s.id
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-line bg-elev text-muted hover:border-accent/30"
            }`}
            aria-pressed={active === s.id}
          >
            <span className="mr-2 font-mono text-[10px] text-muted">{String(idx + 1).padStart(2, "0")}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-elev p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-[family-name:var(--font-display)] text-xl text-ink">{stage.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{stage.detail}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-1">
          {project.pipeline.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1">
              <div
                className={`h-2 w-10 rounded-full ${active === s.id ? "bg-accent" : "bg-slate-700"}`}
              />
              {i < project.pipeline.length - 1 && <div className="h-px w-3 bg-line" />}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
