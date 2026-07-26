"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProjectConfig } from "@/lib/projects";
import { Section } from "./ui";
import predmaintCurves from "@/data/predmaint-curves.json";

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-elev p-4">
      <p className="mb-4 text-sm text-muted">{title}</p>
      <div className="h-64">{children}</div>
    </div>
  );
}

function PredMaintCharts() {
  const roc = predmaintCurves.roc.map((p) => ({ fpr: p.x, tpr: p.y }));
  const pr = predmaintCurves.pr.map((p) => ({ recall: p.x, precision: p.y }));
  const fi = predmaintCurves.feature_importance.map((p) => ({
    name: p.feature.replace(/_/g, " "),
    importance: p.importance,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartCard title={`ROC Curve · AUC ${predmaintCurves.roc_auc.toFixed(3)} (test split)`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={roc}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" />
            <XAxis
              dataKey="fpr"
              type="number"
              domain={[0, 1]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              label={{ value: "FPR", position: "insideBottom", offset: -2, fill: "#64748b" }}
            />
            <YAxis
              dataKey="tpr"
              type="number"
              domain={[0, 1]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              label={{ value: "TPR", angle: -90, position: "insideLeft", fill: "#64748b" }}
            />
            <Tooltip contentStyle={{ background: "#0c1220", border: "1px solid #334155" }} />
            <Line type="monotone" dataKey="tpr" stroke="#22d3ee" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title={`Precision–Recall · AUC ${predmaintCurves.pr_auc.toFixed(3)} (test split)`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pr}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" />
            <XAxis
              dataKey="recall"
              type="number"
              domain={[0, 1]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              label={{ value: "Recall", position: "insideBottom", offset: -2, fill: "#64748b" }}
            />
            <YAxis
              dataKey="precision"
              type="number"
              domain={[0, 1]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              label={{ value: "Precision", angle: -90, position: "insideLeft", fill: "#64748b" }}
            />
            <Tooltip contentStyle={{ background: "#0c1220", border: "1px solid #334155" }} />
            <Line type="monotone" dataKey="precision" stroke="#34d399" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Feature Importance · LightGBM (production model)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fi} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: "#94a3b8", fontSize: 9 }}
            />
            <Tooltip contentStyle={{ background: "#0c1220", border: "1px solid #334155" }} />
            <Bar dataKey="importance" fill="#0891b2" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

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

      {project.proxyId === "predmaint" ? (
        <>
          <PredMaintCharts />
          <p className="mt-3 text-xs text-muted">
            Curves and importances computed from the production LightGBM artifact on the chronological test split —
            same run as `reports/metrics/test_metrics.json`.
          </p>
        </>
      ) : (
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
      )}

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
