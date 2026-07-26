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

type SqlValidation = {
  ok: boolean;
  reasons: string[];
  blocked?: boolean;
};

type SqlGeneratePayload = {
  question?: string;
  sql?: string;
  validation?: SqlValidation;
  mode?: string;
};

function sqlSafetyBadges(sql: string, validation?: SqlValidation | null): { ok: boolean; label: string }[] {
  const badges: { ok: boolean; label: string }[] = [];
  if (!validation) return badges;

  if (validation.blocked || !validation.ok) {
    badges.push({ ok: false, label: "BLOCKED" });
    for (const reason of validation.reasons.slice(0, 3)) {
      badges.push({ ok: false, label: reason.replace(/_/g, " ").toUpperCase() });
    }
    return badges;
  }

  const upper = sql.toUpperCase();
  const selectOnly = /^\s*(WITH|SELECT)\b/.test(upper) && !/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE)\b/.test(upper);
  badges.push({ ok: selectOnly, label: selectOnly ? "SELECT ONLY" : "NOT SELECT-ONLY" });

  const limitEnforced =
    /\bLIMIT\s+\d+\b/i.test(sql) || validation.reasons.some((r) => r.startsWith("limit_"));
  badges.push({ ok: limitEnforced, label: limitEnforced ? "LIMIT ENFORCED" : "NO LIMIT" });

  badges.push({ ok: true, label: "SAFETY PASSED" });
  badges.push({ ok: true, label: "SCHEMA-AWARE" });
  return badges;
}

function SqlDemo({ proxyId }: { proxyId: string }) {
  const [question, setQuestion] = useState("Show total revenue by product category");
  const [sql, setSql] = useState("");
  const [explain, setExplain] = useState("");
  const [table, setTable] = useState<{ columns: string[]; rows: unknown[][]; rowCount?: number } | null>(null);
  const [validation, setValidation] = useState<SqlValidation | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [raw, setRaw] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [data, setData] = useState<unknown>(null);
  const [stage, setStage] = useState<"idle" | "sql" | "explained" | "executed">("idle");

  const badges = useMemo(() => sqlSafetyBadges(sql, validation), [sql, validation]);

  async function generateOnly() {
    setBusy(true);
    setExplain("");
    setTable(null);
    const res = await apiFetch(proxyId, "/v1/generate", {
      method: "POST",
      body: JSON.stringify({ question, dialect: "postgresql" }),
    });
    const payload = res.data as SqlGeneratePayload;
    setSql(res.ok ? payload.sql ?? "" : "");
    setValidation(res.ok ? payload.validation ?? null : null);
    setMode(res.ok ? payload.mode ?? null : null);
    setRaw(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setStage(res.ok ? "sql" : "idle");
    setBusy(false);
    return res;
  }

  async function runExample() {
    setBusy(true);
    setExplain("");
    setTable(null);
    setValidation(null);
    setMode(null);

    const gen = await apiFetch(proxyId, "/v1/generate", {
      method: "POST",
      body: JSON.stringify({ question, dialect: "postgresql" }),
    });
    const genPayload = gen.data as SqlGeneratePayload;
    const nextSql = gen.ok ? genPayload.sql ?? "" : "";
    setSql(nextSql);
    setValidation(gen.ok ? genPayload.validation ?? null : null);
    setMode(gen.ok ? genPayload.mode ?? null : null);
    setStatus(gen.status);
    setOk(gen.ok);
    setData(gen.data);
    setRaw(pretty(gen.data));

    if (!gen.ok || !nextSql || genPayload.validation?.blocked) {
      setStage("idle");
      setBusy(false);
      return;
    }
    setStage("sql");

    const ex = await apiFetch(proxyId, "/v1/explain", {
      method: "POST",
      body: JSON.stringify({ sql: nextSql }),
    });
    const exPayload = ex.data as { explanation?: string };
    if (ex.ok) {
      setExplain(exPayload.explanation ?? "");
      setStage("explained");
    }

    const exec = await apiFetch(proxyId, "/v1/execute", {
      method: "POST",
      body: JSON.stringify({ sql: nextSql, max_rows: 50 }),
    });
    const execPayload = exec.data as {
      columns?: string[];
      rows?: unknown[][];
      row_count?: number;
    };
    setStatus(exec.status);
    setOk(exec.ok);
    setData(exec.data);
    setRaw(pretty({ generate: gen.data, explain: ex.data, execute: exec.data }));
    if (exec.ok && execPayload.columns && execPayload.rows) {
      setTable({
        columns: execPayload.columns,
        rows: execPayload.rows,
        rowCount: execPayload.row_count ?? execPayload.rows.length,
      });
      setStage("executed");
    }
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
    if (res.ok) setStage("explained");
    setBusy(false);
  }

  async function execute() {
    if (!sql) return;
    setBusy(true);
    const res = await apiFetch(proxyId, "/v1/execute", {
      method: "POST",
      body: JSON.stringify({ sql, max_rows: 50 }),
    });
    const payload = res.data as { columns?: string[]; rows?: unknown[][]; row_count?: number };
    if (res.ok && payload.columns && payload.rows) {
      setTable({
        columns: payload.columns,
        rows: payload.rows,
        rowCount: payload.row_count ?? payload.rows.length,
      });
      setStage("executed");
    } else setTable(null);
    setRaw(pretty(res.data));
    setStatus(res.status);
    setOk(res.ok);
    setData(res.data);
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-elev p-4">
        <p className="mb-3 text-sm text-muted">
          Capability focus: <span className="text-ink">safe NL→SQL</span> — generate, validate, explain, then
          read-only execute.
        </p>
        <label className="block text-sm text-muted">
          Natural language
          <textarea
            className="mt-1 h-24 w-full rounded-lg border border-line bg-soft p-3 text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={runExample} disabled={busy} variant="primary">
            {busy ? "Running…" : "Run Example"}
          </Button>
          <Button onClick={generateOnly} disabled={busy} variant="ghost">
            Generate only
          </Button>
          <Button onClick={doExplain} disabled={busy || !sql} variant="ghost">
            Explain
          </Button>
          <Button onClick={execute} disabled={busy || !sql} variant="soft">
            Execute safely
          </Button>
        </div>
      </div>

      <ol className="flex flex-wrap items-center gap-2 text-[11px] text-muted" aria-label="NL to SQL pipeline">
        {[
          { id: "nl", label: "Natural Language", on: true },
          { id: "sql", label: "Generated SQL", on: stage !== "idle" || !!sql },
          { id: "val", label: "Validation", on: !!validation },
          { id: "exp", label: "Explanation", on: !!explain || stage === "explained" || stage === "executed" },
          { id: "rows", label: "Rows Returned", on: !!table || stage === "executed" },
        ].map((s, i, arr) => (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={`rounded-md border px-2 py-1 font-medium ${
                s.on ? "border-accent/40 bg-accent/10 text-accent" : "border-line bg-elev text-muted"
              }`}
            >
              {s.label}
            </span>
            {i < arr.length - 1 && <span className="text-muted/50" aria-hidden>↓</span>}
          </li>
        ))}
      </ol>

      {status !== null && !ok && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-warn" role="alert">
          {apiStatusHint(status, data)}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted">Generated SQL</p>
              {mode && <span className="font-mono text-[11px] text-muted">mode · {mode}</span>}
            </div>
            {badges.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5" aria-label="Safety validation badges">
                {badges.map((b) => (
                  <span
                    key={b.label}
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                      b.ok
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                        : "border-rose-400/40 bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    <span aria-hidden>{b.ok ? "✓" : "✕"}</span>
                    {b.label}
                  </span>
                ))}
              </div>
            )}
            <textarea
              className="h-40 w-full rounded-xl border border-line bg-black/40 p-3 font-mono text-xs text-accent outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="Generated SQL"
              aria-label="Generated SQL"
            />
          </div>
          {explain && (
            <div className="rounded-xl border border-line bg-elev p-3">
              <p className="mb-1 text-[11px] font-semibold tracking-wide text-accent uppercase">Explanation</p>
              <p className="text-sm text-muted">{explain}</p>
            </div>
          )}
        </div>
        <div>
          {table ? (
            <div className="space-y-2">
              <p className="text-xs text-muted">
                Rows returned ·{" "}
                <span className="font-mono text-accent">{table.rowCount ?? table.rows.length}</span>
              </p>
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
            </div>
          ) : (
            <pre className="json-view min-h-40 overflow-auto rounded-xl border border-line bg-black/40 p-4">
              {raw || "// Validation → explanation → rows appear after Run Example"}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image_load_failed"));
    img.src = src;
  });
}

async function composeGradcamOverlay(sourceSrc: string, heatmapB64: string): Promise<string> {
  const base = await loadHtmlImage(sourceSrc);
  const heat = await loadHtmlImage(`data:image/png;base64,${heatmapB64}`);
  const w = base.naturalWidth;
  const h = base.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return sourceSrc;
  ctx.drawImage(base, 0, 0, w, h);

  const heatCanvas = document.createElement("canvas");
  heatCanvas.width = w;
  heatCanvas.height = h;
  const hctx = heatCanvas.getContext("2d");
  if (!hctx) return canvas.toDataURL("image/png");
  hctx.drawImage(heat, 0, 0, w, h);
  const pixels = hctx.getImageData(0, 0, w, h);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const v = pixels.data[i] / 255;
    pixels.data[i] = 255;
    pixels.data[i + 1] = Math.round(80 + 140 * (1 - v));
    pixels.data[i + 2] = Math.round(30 * (1 - v));
    pixels.data[i + 3] = Math.round(210 * v);
  }
  hctx.putImageData(pixels, 0, 0);
  ctx.drawImage(heatCanvas, 0, 0);
  return canvas.toDataURL("image/png");
}

async function composeMaskOverlay(sourceSrc: string, maskB64: string): Promise<string> {
  const base = await loadHtmlImage(sourceSrc);
  const mask = await loadHtmlImage(`data:image/png;base64,${maskB64}`);
  const w = base.naturalWidth;
  const h = base.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return sourceSrc;
  ctx.drawImage(base, 0, 0, w, h);

  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = w;
  maskCanvas.height = h;
  const mctx = maskCanvas.getContext("2d");
  if (!mctx) return canvas.toDataURL("image/png");
  mctx.drawImage(mask, 0, 0, w, h);
  const pixels = mctx.getImageData(0, 0, w, h);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const on = pixels.data[i] > 20;
    pixels.data[i] = 34;
    pixels.data[i + 1] = 211;
    pixels.data[i + 2] = 238;
    pixels.data[i + 3] = on ? 160 : 0;
  }
  mctx.putImageData(pixels, 0, 0);
  ctx.drawImage(maskCanvas, 0, 0);
  return canvas.toDataURL("image/png");
}

async function composeBboxOverlay(
  sourceSrc: string,
  detections: { label: string; score: number; box: number[] }[],
): Promise<string> {
  const base = await loadHtmlImage(sourceSrc);
  const w = base.naturalWidth;
  const h = base.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return sourceSrc;
  ctx.drawImage(base, 0, 0);
  const stroke = Math.max(2, Math.round(w / 64));
  ctx.lineWidth = stroke;
  ctx.font = `${Math.max(12, Math.round(w / 16))}px ui-monospace, monospace`;
  for (const d of detections) {
    const [x1, y1, x2, y2] = d.box;
    const bw = x2 - x1;
    const bh = y2 - y1;
    ctx.strokeStyle = "#22d3ee";
    ctx.fillStyle = "rgba(8, 145, 178, 0.18)";
    ctx.fillRect(x1, y1, bw, bh);
    ctx.strokeRect(x1, y1, bw, bh);
    const tag = `${d.label} ${d.score.toFixed(3)}`;
    const tw = ctx.measureText(tag).width + 8;
    const th = Math.max(16, Math.round(w / 14));
    ctx.fillStyle = "rgba(8, 145, 178, 0.92)";
    ctx.fillRect(x1, Math.max(0, y1 - th), tw, th);
    ctx.fillStyle = "#ecfeff";
    ctx.fillText(tag, x1 + 4, Math.max(th - 4, y1 - 4));
  }
  return canvas.toDataURL("image/png");
}

type CvVisualKind = "gradcam" | "bbox" | "mask";

function CvDemo({ proxyId }: { proxyId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [out, setOut] = useState("");
  const [visual, setVisual] = useState<{ kind: CvVisualKind; src: string; title: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [data, setData] = useState<unknown>(null);
  const [labelHint, setLabelHint] = useState<string | null>(null);

  function onFile(f: File | null) {
    setFile(f);
    setVisual(null);
    setLabelHint(null);
    setOut("");
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return f ? URL.createObjectURL(f) : null;
    });
  }

  async function call(path: string, explain = false, overrideFile?: File, overridePreview?: string) {
    const upload = overrideFile ?? file;
    const sourceSrc = overridePreview ?? preview;
    if (!upload || !sourceSrc) return;
    setBusy(true);
    setVisual(null);
    setLabelHint(null);
    try {
      const fd = new FormData();
      fd.append("file", upload);
      const qs = explain ? "?explain=true" : "";
      const res = await apiFetch(proxyId, `${path}${qs}`, { method: "POST", body: fd });
      setOut(pretty(res.data));
      setStatus(res.status);
      setOk(res.ok);
      setData(res.data);
      if (!res.ok) return;

      const payload = res.data as {
        label?: string;
        score?: number;
        mask_png_b64?: string;
        explanation?: { heatmap_png_b64?: string };
        detections?: { label: string; score: number; box: number[] }[];
      };

      if (path.includes("classify") && payload.explanation?.heatmap_png_b64) {
        const src = await composeGradcamOverlay(sourceSrc, payload.explanation.heatmap_png_b64);
        setVisual({ kind: "gradcam", src, title: "Grad-CAM overlay" });
        if (payload.label != null && payload.score != null) {
          setLabelHint(`${payload.label} · ${(payload.score * 100).toFixed(1)}%`);
        }
      } else if (path.includes("detect") && payload.detections) {
        const src = await composeBboxOverlay(sourceSrc, payload.detections);
        setVisual({
          kind: "bbox",
          src,
          title: payload.detections.length ? "Bounding boxes" : "No detections above threshold",
        });
        setLabelHint(
          payload.detections.length
            ? `${payload.detections.length} box${payload.detections.length === 1 ? "" : "es"}`
            : "0 detections",
        );
      } else if (path.includes("segment") && payload.mask_png_b64) {
        const src = await composeMaskOverlay(sourceSrc, payload.mask_png_b64);
        setVisual({ kind: "mask", src, title: "Mask overlay" });
        setLabelHint("Segmentation mask on source");
      }
    } finally {
      setBusy(false);
    }
  }

  async function runExample() {
    const res = await fetch("/assets/samples/cv/img_0012.png");
    const blob = await res.blob();
    const sample = new File([blob], "img_0012.png", { type: "image/png" });
    const objectUrl = URL.createObjectURL(sample);
    setFile(sample);
    setVisual(null);
    setLabelHint(null);
    setOut("");
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
    await call("/v1/classify", true, sample, objectUrl);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-elev p-4">
        <p className="mb-3 text-sm text-muted">
          Capability focus: <span className="text-ink">multi-task inspection</span> — classify with Grad-CAM,
          detect with boxes, segment with mask overlay.
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          <Button onClick={runExample} disabled={busy} variant="primary">
            {busy ? "Running…" : "Run Example"}
          </Button>
          <Button onClick={() => call("/v1/classify", true)} disabled={!file || busy} variant="ghost">
            Classify
          </Button>
          <Button onClick={() => call("/v1/detect")} disabled={!file || busy} variant="ghost">
            Detect
          </Button>
          <Button onClick={() => call("/v1/segment")} disabled={!file || busy} variant="soft">
            Segment
          </Button>
        </div>
        <input
          type="file"
          accept="image/png,image/jpeg"
          aria-label="Inspection image upload"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent-dim file:px-3 file:py-1.5 file:text-white"
        />
        <p className="mt-2 text-xs text-muted">
          Run Example loads sample{" "}
          <a className="text-accent hover:underline" href="/assets/samples/cv/img_0012.png" target="_blank" rel="noreferrer">
            img_0012.png
          </a>{" "}
          and shows Grad-CAM on the source image.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-line bg-black/40 p-3">
          <p className="text-[11px] font-semibold tracking-wide text-accent uppercase">Original</p>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Original inspection image" className="max-h-72 w-full object-contain" />
          ) : (
            <p className="py-16 text-center text-sm text-muted">Upload or Run Example</p>
          )}
        </div>
        <div className="space-y-2 rounded-xl border border-line bg-black/40 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wide text-accent uppercase">
              {visual?.title ?? "Visual result"}
            </p>
            {labelHint && <span className="font-mono text-[11px] text-muted">{labelHint}</span>}
          </div>
          {visual ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={visual.src}
              alt={
                visual.kind === "gradcam"
                  ? "Grad-CAM overlay on original"
                  : visual.kind === "bbox"
                    ? "Detection bounding boxes on original"
                    : "Segmentation mask overlay on original"
              }
              className="max-h-72 w-full object-contain"
            />
          ) : (
            <p className="py-16 text-center text-sm text-muted">
              Classify → Grad-CAM · Detect → boxes · Segment → mask
            </p>
          )}
        </div>
      </div>

      <ResultPanel out={out} status={status} ok={ok} data={data} empty="// CV response JSON" />
    </div>
  );
}
