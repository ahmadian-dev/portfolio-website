"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProjectConfig } from "@/lib/projects";
import { Section } from "./ui";

export function Performance({ project }: { project: ProjectConfig }) {
  const data = project.chart.labels.map((label, i) => ({
    name: label,
    value: project.chart.values[i],
  }));

  return (
    <Section id="performance" eyebrow="Performance" title="Measured evaluation results">
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted">
        Numbers below match this project&apos;s evaluation reports. Dataset scope, baselines, and limitations are
        documented under{" "}
        <a href="#integrity" className="text-accent hover:underline">
          Integrity
        </a>
        .
      </p>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {project.metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-line bg-elev p-4">
            <p className="text-[11px] tracking-wide text-muted uppercase">{m.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-accent">{m.primary}</p>
            {m.baseline && <p className="mt-1 text-xs text-muted">Baseline {m.baseline}</p>}
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-line bg-elev p-4">
        <p className="mb-4 text-sm text-muted">Comparison chart · source: project reports/metrics</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{ value: project.chart.yLabel, angle: -90, position: "insideLeft", fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{ background: "#0c1220", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 8 }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="value" fill="#0891b2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Primary</th>
              <th className="px-4 py-3">Baseline</th>
            </tr>
          </thead>
          <tbody>
            {project.metrics.map((m) => (
              <tr key={m.label} className="border-t border-line">
                <td className="px-4 py-3 text-ink">{m.label}</td>
                <td className="px-4 py-3 font-mono text-accent">{m.primary}</td>
                <td className="px-4 py-3 font-mono text-muted">{m.baseline ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
