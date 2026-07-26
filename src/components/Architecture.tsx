"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ArrowsPointingOutIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
} from "@heroicons/react/24/outline";
import type { ProjectConfig } from "@/lib/projects";
import { Button, Section } from "./ui";

export function Architecture({ project }: { project: ProjectConfig }) {
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setFull(false), []);

  useEffect(() => {
    if (!full) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [full, close]);

  return (
    <Section id="architecture" eyebrow="Architecture" title="System architecture">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => setZoom((z) => Math.min(2, z + 0.15))} aria-label="Zoom in">
          <MagnifyingGlassPlusIcon className="h-4 w-4" aria-hidden /> Zoom in
        </Button>
        <Button variant="ghost" onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))} aria-label="Zoom out">
          <MagnifyingGlassMinusIcon className="h-4 w-4" aria-hidden /> Zoom out
        </Button>
        <Button variant="ghost" onClick={() => setFull(true)} aria-label="Open architecture fullscreen">
          <ArrowsPointingOutIcon className="h-4 w-4" aria-hidden /> Fullscreen
        </Button>
        <Button href={project.architectureSrc} variant="soft">
          <ArrowDownTrayIcon className="h-4 w-4" aria-hidden /> Download
        </Button>
      </div>
      <div className="overflow-auto rounded-xl border border-line bg-white/95 p-3">
        <div
          className="relative w-full transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
        >
          <Image
            src={project.architectureSrc}
            alt={`${project.name} system architecture diagram`}
            width={1600}
            height={900}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 72rem"
            priority={false}
          />
        </div>
      </div>
      {full && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div
            className="max-h-full max-w-6xl overflow-auto rounded-lg bg-white p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id={titleId} className="sr-only">
              {project.name} architecture fullscreen
            </h3>
            <Image
              src={project.architectureSrc}
              alt={`${project.name} architecture fullscreen`}
              width={1600}
              height={900}
              className="h-auto w-full"
              sizes="100vw"
            />
            <div className="mt-3 text-right">
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent-dim px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
