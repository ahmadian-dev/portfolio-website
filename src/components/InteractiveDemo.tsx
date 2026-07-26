"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProjectConfig } from "@/lib/projects";
import { apiFetch, apiStatusHint, pretty } from "@/lib/api";
import { Button, Section } from "./ui";

type FeatureState = Record<string, number>;

const PREDMAINT_DEFAULTS: FeatureState = {
  type_L: 0,
  type_M: 1,
  type_H: 0,
  air_temperature_k: 298.1,
  process_temperature_k: 308.6,
  rotational_speed_rpm: 1551,
  torque_nm: 42.8,
  tool_wear_min: 108,
  temp_diff_k: 10.5,
  mechanical_power: 6954.8,
  wear_torque_product: 4622.4,
  speed_over_torque: 36.24,
};

export function InteractiveDemo({ project }: { project: ProjectConfig }) {
  return (
    <Section id="demo" eyebrow="Interactive Demo" title="Use the real system">
      <p className="mb-6 max-w-3xl text-sm text-muted">
        Calls go through this site&apos;s API proxy to the project FastAPI service. If the backend is offline, you will
        see a clear configuration or connectivity message.
      </p>
      {project.interactive === "predmaint" && <PredmaintDemo proxyId={project.proxyId} />}
      {project.interactive === "docintel" && <DocintelDemo proxyId={project.proxyId} />}
      {project.interactive === "forecast" && <ForecastDemo proxyId={project.proxyId} />}
      {project.interactive === "sqlcopilot" && <SqlDemo proxyId={project.proxyId} />}
      {project.interactive === "cvinspect" && <CvDemo proxyId={project.proxyId} />}
    </Section>
  );
}

function ResultPanel({
  out,
  status,
  ok,
  data,
  empty,
}: {
  out: string;
  status: number | null;
  ok: boolean | null;
  data: unknown;
  empty: string;
}) {
  return (
    <div className="space-y-2">
      {status !== null && !ok && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-warn" role="alert">
          {apiStatusHint(status, data)}
        </p>
      )}
      <pre className="json-view min-h-80 overflow-auto rounded-xl border border-line bg-black/40 p-4">
        {out || empty}
      </pre>
    </div>
  );
}

function StatusLine({ text }: { text: string }) {
  return <p className="mt-3 text-xs text-muted">{text}</p>;
}

function PredmaintDemo({ proxyId }: { proxyId: string }) {
  const [features, setFeatures] = useState(PREDMAINT_DEFAULTS);
  const [out, setOut] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [data, setData] = useState<unknown>(null);

  async function predict() {
    setBusy(true);
    const res = await apiFetch(proxyId, "/v1/predict", {
      method: "POST",
      body: JSON.stringify({ entity_id: "demo-entity", features }),
    });
    setOut(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setBusy(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-line bg-elev p-4">
        <p className="text-sm text-muted">Adjust sensor / engineered features, then predict failure risk.</p>
        <div className="grid max-h-80 grid-cols-1 gap-2 overflow-auto sm:grid-cols-2">
          {Object.entries(features).map(([key, value]) => (
            <label key={key} className="text-xs text-muted">
              <span className="mb-1 block font-mono">{key}</span>
              <input
                type="number"
                step="any"
                className="w-full rounded-md border border-line bg-soft px-2 py-1.5 font-mono text-ink outline-none focus-visible:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                value={value}
                onChange={(e) => setFeatures((f) => ({ ...f, [key]: Number(e.target.value) }))}
              />
            </label>
          ))}
        </div>
        <Button onClick={predict} disabled={busy}>
          {busy ? "Predicting…" : "Predict"}
        </Button>
      </div>
      <ResultPanel out={out} status={status} ok={ok} data={data} empty="// Prediction JSON" />
    </div>
  );
}

function DocintelDemo({ proxyId }: { proxyId: string }) {
  const [question, setQuestion] = useState("What is the retention policy?");
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [data, setData] = useState<unknown>(null);

  async function ingest() {
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await apiFetch(proxyId, "/v1/ingest", { method: "POST", body: fd });
    setOut(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setBusy(false);
  }

  async function ask() {
    setBusy(true);
    const res = await apiFetch(proxyId, "/v1/ask", {
      method: "POST",
      body: JSON.stringify({ question, top_k: 5 }),
    });
    setOut(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setBusy(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-line bg-elev p-4">
        <div>
          <p className="mb-2 text-sm text-muted">Upload PDF/TXT (optional)</p>
          <input
            type="file"
            accept=".pdf,.txt,.md"
            aria-label="Document file for ingest"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent-dim file:px-3 file:py-1.5 file:text-white"
          />
          <div className="mt-2">
            <Button onClick={ingest} disabled={!file || busy} variant="soft">
              Ingest
            </Button>
          </div>
        </div>
        <label className="block text-sm text-muted">
          Question
          <textarea
            className="mt-1 h-28 w-full rounded-lg border border-line bg-soft p-3 text-sm text-ink outline-none focus-visible:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        <Button onClick={ask} disabled={busy}>
          {busy ? "Asking…" : "Ask with citations"}
        </Button>
        <StatusLine text="Answers include citation snippets when the index is loaded." />
      </div>
      <ResultPanel out={out} status={status} ok={ok} data={data} empty="// Answer + citations" />
    </div>
  );
}

function ForecastDemo({ proxyId }: { proxyId: string }) {
  const [horizon, setHorizon] = useState(14);
  const [storeId, setStoreId] = useState("S01");
  const [skuId, setSkuId] = useState("SKU01");
  const [points, setPoints] = useState<{ date: string; yhat: number }[]>([]);
  const [meta, setMeta] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [data, setData] = useState<unknown>(null);

  async function run() {
    setBusy(true);
    const res = await apiFetch(proxyId, "/v1/forecast", {
      method: "POST",
      body: JSON.stringify({ store_id: storeId, sku_id: skuId, horizon_days: horizon, model: "primary" }),
    });
    const payload = res.data as { points?: { date: string; yhat: number }[] };
    setPoints(res.ok ? payload.points ?? [] : []);
    setMeta(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setBusy(false);
  }

  const chartData = useMemo(() => points.map((p) => ({ date: p.date.slice(5), yhat: p.yhat })), [points]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-elev p-4">
        <label className="text-xs text-muted">
          Store
          <input
            className="mt-1 block rounded-md border border-line bg-soft px-2 py-1.5 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
          />
        </label>
        <label className="text-xs text-muted">
          SKU
          <input
            className="mt-1 block rounded-md border border-line bg-soft px-2 py-1.5 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            value={skuId}
            onChange={(e) => setSkuId(e.target.value)}
          />
        </label>
        <label className="text-xs text-muted">
          Horizon (days)
          <input
            type="range"
            min={1}
            max={28}
            value={horizon}
            aria-valuemin={1}
            aria-valuemax={28}
            aria-valuenow={horizon}
            aria-label="Forecast horizon in days"
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="mt-2 block w-40"
          />
          <span className="font-mono text-accent">{horizon}</span>
        </label>
        <Button onClick={run} disabled={busy}>
          {busy ? "Forecasting…" : "Generate forecast"}
        </Button>
      </div>
      {status !== null && !ok && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-warn" role="alert">
          {apiStatusHint(status, data)}
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 rounded-xl border border-line bg-elev p-3">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0c1220", border: "1px solid #334155" }} />
                <Line type="monotone" dataKey="yhat" stroke="#22d3ee" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="p-4 text-sm text-muted">Forecast chart appears after a successful API call.</p>
          )}
        </div>
        <pre className="json-view max-h-72 overflow-auto rounded-xl border border-line bg-black/40 p-4">
          {meta || "// Forecast payload"}
        </pre>
      </div>
    </div>
  );
}

function SqlDemo({ proxyId }: { proxyId: string }) {
  const [question, setQuestion] = useState("Show total revenue by product category");
  const [sql, setSql] = useState("");
  const [explain, setExplain] = useState("");
  const [table, setTable] = useState<{ columns: string[]; rows: unknown[][] } | null>(null);
  const [raw, setRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [data, setData] = useState<unknown>(null);

  async function generate() {
    setBusy(true);
    const res = await apiFetch(proxyId, "/v1/generate", {
      method: "POST",
      body: JSON.stringify({ question, dialect: "postgresql" }),
    });
    const payload = res.data as { sql?: string };
    setSql(res.ok ? payload.sql ?? "" : "");
    setRaw(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setBusy(false);
  }

  async function doExplain() {
    if (!sql) return;
    setBusy(true);
    const res = await apiFetch(proxyId, "/v1/explain", {
      method: "POST",
      body: JSON.stringify({ sql }),
    });
    const payload = res.data as { explanation?: string };
    setExplain(res.ok ? payload.explanation ?? pretty(res.data) : "");
    setRaw(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setBusy(false);
  }

  async function execute() {
    if (!sql) return;
    setBusy(true);
    const res = await apiFetch(proxyId, "/v1/execute", {
      method: "POST",
      body: JSON.stringify({ sql, max_rows: 50 }),
    });
    const payload = res.data as { columns?: string[]; rows?: unknown[][] };
    if (res.ok && payload.columns && payload.rows) setTable({ columns: payload.columns, rows: payload.rows });
    else setTable(null);
    setRaw(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-elev p-4">
        <label className="block text-sm text-muted">
          Natural language
          <textarea
            className="mt-1 h-24 w-full rounded-lg border border-line bg-soft p-3 text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={generate} disabled={busy}>
            Generate SQL
          </Button>
          <Button onClick={doExplain} disabled={busy || !sql} variant="ghost">
            Explain
          </Button>
          <Button onClick={execute} disabled={busy || !sql} variant="soft">
            Execute safely
          </Button>
        </div>
      </div>
      {status !== null && !ok && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-warn" role="alert">
          {apiStatusHint(status, data)}
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-xs text-muted">
            SQL
            <textarea
              className="mt-1 h-40 w-full rounded-xl border border-line bg-black/40 p-3 font-mono text-xs text-accent outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="Generated SQL"
            />
          </label>
          {explain && <p className="rounded-xl border border-line bg-elev p-3 text-sm text-muted">{explain}</p>}
        </div>
        <div>
          {table ? (
            <div className="max-h-72 overflow-auto rounded-xl border border-line">
              <table className="w-full text-left text-xs">
                <thead className="bg-soft text-muted">
                  <tr>
                    {table.columns.map((c) => (
                      <th key={c} className="px-2 py-2 font-mono">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className="border-t border-line">
                      {row.map((cell, j) => (
                        <td key={j} className="px-2 py-1.5 font-mono text-ink/90">
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre className="json-view min-h-40 overflow-auto rounded-xl border border-line bg-black/40 p-4">
              {raw || "// Results"}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function CvDemo({ proxyId }: { proxyId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [out, setOut] = useState("");
  const [mask, setMask] = useState<string | null>(null);
  const [cam, setCam] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [data, setData] = useState<unknown>(null);

  function onFile(f: File | null) {
    setFile(f);
    setMask(null);
    setCam(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return f ? URL.createObjectURL(f) : null;
    });
  }

  async function call(path: string, explain = false) {
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const qs = explain ? "?explain=true" : "";
    const res = await apiFetch(proxyId, `${path}${qs}`, { method: "POST", body: fd });
    setOut(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    const payload = res.data as {
      mask_png_b64?: string;
      explanation?: { heatmap_png_b64?: string };
    };
    if (res.ok && payload.mask_png_b64) setMask(`data:image/png;base64,${payload.mask_png_b64}`);
    if (res.ok && payload.explanation?.heatmap_png_b64) {
      setCam(`data:image/png;base64,${payload.explanation.heatmap_png_b64}`);
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-line bg-elev p-4">
        <input
          type="file"
          accept="image/png,image/jpeg"
          aria-label="Inspection image upload"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent-dim file:px-3 file:py-1.5 file:text-white"
        />
        <p className="text-xs text-muted">
          Tip: try sample{" "}
          <a className="text-accent hover:underline" href="/assets/samples/cv/img_0012.png" target="_blank" rel="noreferrer">
            img_0012.png
          </a>
        </p>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Upload preview" className="max-h-48 rounded-lg border border-line object-contain" />
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => call("/v1/classify", true)} disabled={!file || busy}>
            Classify + Grad-CAM
          </Button>
          <Button onClick={() => call("/v1/detect")} disabled={!file || busy} variant="ghost">
            Detect
          </Button>
          <Button onClick={() => call("/v1/segment")} disabled={!file || busy} variant="soft">
            Segment
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          {cam && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cam} alt="Grad-CAM explanation heatmap" className="h-28 rounded border border-line" />
          )}
          {mask && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mask} alt="Segmentation mask" className="h-28 rounded border border-line" />
          )}
        </div>
      </div>
      <ResultPanel out={out} status={status} ok={ok} data={data} empty="// CV response JSON" />
    </div>
  );
}
