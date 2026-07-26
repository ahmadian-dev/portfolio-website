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
        Start with <span className="text-ink">Run Example</span> — one click fills a realistic payload and calls the
        live FastAPI via this site&apos;s proxy.
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

function PredmaintDemo({ proxyId }: { proxyId: string }) {
  const [features, setFeatures] = useState(PREDMAINT_DEFAULTS);
  const [out, setOut] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [data, setData] = useState<unknown>(null);

  async function predictWith(next: FeatureState) {
    setBusy(true);
    const res = await apiFetch(proxyId, "/v1/predict", {
      method: "POST",
      body: JSON.stringify({ entity_id: "demo-entity", features: next }),
    });
    setOut(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setBusy(false);
  }

  async function predict() {
    await predictWith(features);
  }

  async function runExample() {
    setFeatures(PREDMAINT_DEFAULTS);
    await predictWith(PREDMAINT_DEFAULTS);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-line bg-elev p-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={runExample} disabled={busy} variant="primary">
            {busy ? "Running…" : "Run Example"}
          </Button>
          <Button onClick={predict} disabled={busy} variant="ghost">
            Predict
          </Button>
        </div>
        <p className="text-sm text-muted">
          Hiring-manager path: click <span className="text-ink">Run Example</span> to score the default payload. Or
          adjust features below.
        </p>
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
      </div>
      <ResultPanel out={out} status={status} ok={ok} data={data} empty="// Prediction JSON" />
    </div>
  );
}

type DocCitation = {
  chunk_id: string;
  document_id: string;
  score: number;
  snippet: string;
};

type AskPayload = {
  question: string;
  answer: string;
  citations: DocCitation[];
  mode?: string;
};

const CITE_STYLES = [
  {
    badge: "border-cyan-400/50 bg-cyan-500/20 text-cyan-200",
    card: "border-cyan-400/35 bg-cyan-500/5",
    num: "bg-cyan-500/25 text-cyan-200",
  },
  {
    badge: "border-emerald-400/50 bg-emerald-500/20 text-emerald-200",
    card: "border-emerald-400/35 bg-emerald-500/5",
    num: "bg-emerald-500/25 text-emerald-200",
  },
  {
    badge: "border-amber-400/50 bg-amber-500/20 text-amber-200",
    card: "border-amber-400/35 bg-amber-500/5",
    num: "bg-amber-500/25 text-amber-200",
  },
  {
    badge: "border-sky-400/50 bg-sky-500/20 text-sky-200",
    card: "border-sky-400/35 bg-sky-500/5",
    num: "bg-sky-500/25 text-sky-200",
  },
  {
    badge: "border-rose-400/50 bg-rose-500/20 text-rose-200",
    card: "border-rose-400/35 bg-rose-500/5",
    num: "bg-rose-500/25 text-rose-200",
  },
] as const;

function isAskPayload(data: unknown): data is AskPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return typeof d.answer === "string" && Array.isArray(d.citations);
}

function citeIndexFromMarker(marker: string, citations: DocCitation[]): number {
  const numbered = marker.match(/^\[(\d+):/);
  if (numbered) {
    const n = Number(numbered[1]);
    if (n >= 1 && n <= citations.length) return n - 1;
  }
  const chunk = marker.match(/chunk_id=([^\]]+)\]|chunk:([^\]]+)\]/);
  const id = chunk?.[1] ?? chunk?.[2];
  if (id) {
    const i = citations.findIndex((c) => c.chunk_id === id || c.chunk_id.startsWith(id));
    if (i >= 0) return i;
  }
  return 0;
}

function AnswerWithCitationMarks({ answer, citations }: { answer: string; citations: DocCitation[] }) {
  const parts = answer.split(/(\[\d+:chunk:[^\]]+\]|\[chunk_id=[^\]]+\])/g);
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
      {parts.map((part, i) => {
        if (!/^\[/.test(part) || !/\]$/.test(part)) return <span key={i}>{part}</span>;
        const idx = citeIndexFromMarker(part, citations);
        const style = CITE_STYLES[idx % CITE_STYLES.length];
        return (
          <sup key={i} className="mx-0.5 inline-block align-super">
            <a
              href={`#cite-${idx + 1}`}
              className={`inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[11px] font-semibold no-underline ${style.badge}`}
              title={`Jump to citation ${idx + 1}`}
            >
              {idx + 1}
            </a>
          </sup>
        );
      })}
    </p>
  );
}

function GroundedAskPanel({
  status,
  ok,
  data,
  raw,
}: {
  status: number | null;
  ok: boolean | null;
  data: unknown;
  raw: string;
}) {
  const [showJson, setShowJson] = useState(false);

  if (!isAskPayload(data) || !ok) {
    return (
      <ResultPanel
        out={raw}
        status={status}
        ok={ok}
        data={data}
        empty="// Grounded answer + numbered citations appear here"
      />
    );
  }

  const citations = data.citations;

  return (
    <div className="space-y-3">
      {status !== null && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted">
            Grounded answer · mode <span className="font-mono text-accent">{data.mode ?? "ask"}</span>
            {status ? (
              <>
                {" "}
                · HTTP <span className="font-mono text-accent">{status}</span>
              </>
            ) : null}
          </p>
          <button
            type="button"
            className="text-xs text-muted underline-offset-2 hover:text-accent hover:underline"
            onClick={() => setShowJson((v) => !v)}
          >
            {showJson ? "Show grounded view" : "Show raw JSON"}
          </button>
        </div>
      )}
      {showJson ? (
        <pre className="json-view min-h-80 overflow-auto rounded-xl border border-line bg-black/40 p-4">{raw}</pre>
      ) : (
        <div className="min-h-80 space-y-4 overflow-auto rounded-xl border border-line bg-black/40 p-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold tracking-wide text-accent uppercase">Answer</p>
            <AnswerWithCitationMarks answer={data.answer} citations={citations} />
          </div>
          {citations.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-wide text-accent uppercase">
                Citations · source passages
              </p>
              <ul className="space-y-2">
                {citations.map((c, i) => {
                  const style = CITE_STYLES[i % CITE_STYLES.length];
                  return (
                    <li
                      key={`${c.chunk_id}-${i}`}
                      id={`cite-${i + 1}`}
                      className={`scroll-mt-24 rounded-lg border px-3 py-2.5 ${style.card}`}
                    >
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex h-5 min-w-5 items-center justify-center rounded font-mono text-[11px] font-semibold ${style.num}`}
                        >
                          {i + 1}
                        </span>
                        <span className="font-mono text-[11px] text-muted">
                          {c.document_id.slice(0, 12)}… · score {c.score.toFixed(3)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink/90">{c.snippet}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
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
  const [view, setView] = useState<"ask" | "ingest">("ask");

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
    setView("ingest");
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
    setView("ask");
    setBusy(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-line bg-elev p-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={ask} disabled={busy} variant="primary">
            {busy ? "Running…" : "Run Example"}
          </Button>
          <Button onClick={ingest} disabled={!file || busy} variant="soft">
            Ingest upload
          </Button>
        </div>
        <p className="text-sm text-muted">
          Capability focus: <span className="text-ink">grounded RAG</span> — answer markers map to colored source
          passages (citations required).
        </p>
        <div>
          <p className="mb-2 text-sm text-muted">Upload PDF/TXT (optional)</p>
          <input
            type="file"
            accept=".pdf,.txt,.md"
            aria-label="Document file for ingest"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent-dim file:px-3 file:py-1.5 file:text-white"
          />
        </div>
        <label className="block text-sm text-muted">
          Question
          <textarea
            className="mt-1 h-28 w-full rounded-lg border border-line bg-soft p-3 text-sm text-ink outline-none focus-visible:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
      </div>
      {view === "ask" ? (
        <GroundedAskPanel status={status} ok={ok} data={data} raw={out} />
      ) : (
        <ResultPanel out={out} status={status} ok={ok} data={data} empty="// Ingest response JSON" />
      )}
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
        <Button onClick={run} disabled={busy} variant="primary">
          {busy ? "Forecasting…" : "Run Example"}
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
          <Button onClick={generate} disabled={busy} variant="primary">
            {busy ? "Running…" : "Run Example"}
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

  async function call(path: string, explain = false, overrideFile?: File) {
    const upload = overrideFile ?? file;
    if (!upload) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", upload);
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

  async function runExample() {
    setBusy(true);
    try {
      const res = await fetch("/assets/samples/cv/img_0012.png");
      const blob = await res.blob();
      const sample = new File([blob], "img_0012.png", { type: "image/png" });
      onFile(sample);
      await call("/v1/classify", true, sample);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-line bg-elev p-4">
        <Button onClick={runExample} disabled={busy} variant="primary">
          {busy ? "Running…" : "Run Example"}
        </Button>
        <input
          type="file"
          accept="image/png,image/jpeg"
          aria-label="Inspection image upload"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent-dim file:px-3 file:py-1.5 file:text-white"
        />
        <p className="text-xs text-muted">
          Run Example loads sample{" "}
          <a className="text-accent hover:underline" href="/assets/samples/cv/img_0012.png" target="_blank" rel="noreferrer">
            img_0012.png
          </a>{" "}
          and classifies with Grad-CAM.
        </p>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Upload preview" className="max-h-48 rounded-lg border border-line object-contain" />
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => call("/v1/classify", true)} disabled={!file || busy} variant="ghost">
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
