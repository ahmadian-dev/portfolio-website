"use client";

import { useState } from "react";
import type { EndpointSpec, ProjectConfig } from "@/lib/projects";
import { apiFetch, apiStatusHint, pretty } from "@/lib/api";
import { Button, Section } from "./ui";

export function ApiExplorer({ project }: { project: ProjectConfig }) {
  const [selected, setSelected] = useState<EndpointSpec>(project.endpoints[0]);
  const [body, setBody] = useState(JSON.stringify(project.endpoints[0].bodyExample ?? {}, null, 2));
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<number | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  function pick(ep: EndpointSpec) {
    setSelected(ep);
    setBody(JSON.stringify(ep.bodyExample ?? {}, null, 2));
    setResult("");
    setStatus(null);
    setOk(null);
    setData(null);
  }

  async function run() {
    setLoading(true);
    try {
      let path = selected.path;
      if (selected.queryExample) {
        const q = new URLSearchParams();
        Object.entries(selected.queryExample).forEach(([k, v]) => q.set(k, String(v)));
        path += `?${q.toString()}`;
      }
      const init: RequestInit = { method: selected.method };
      if (selected.method === "POST" && !selected.multipart) {
        init.body = body;
      }
      if (selected.multipart) {
        setResult(
          pretty({
            note: "Multipart endpoints are exercised in Interactive Demo (file upload).",
            endpoint: selected.path,
          }),
        );
        setStatus(null);
        setOk(null);
        setData(null);
        return;
      }
      const res = await apiFetch(project.proxyId, path, init);
      setStatus(res.status);
      setOk(res.ok);
      setData(res.data);
      setResult(pretty(res.data));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id="api" eyebrow="API Docs" title="Execute live FastAPI contracts">
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2" role="listbox" aria-label="API endpoints">
          {project.endpoints.map((ep) => {
            const active = selected.path === ep.path && selected.method === ep.method;
            return (
              <button
                key={`${ep.method}${ep.path}`}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => pick(ep)}
                className={`w-full rounded-lg border px-3 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active ? "border-accent/40 bg-accent/10" : "border-line bg-elev hover:border-accent/20"
                }`}
              >
                <div className="font-mono text-[11px] text-accent">
                  {ep.method} {ep.path}
                </div>
                <div className="mt-1 text-xs text-muted">{ep.summary}</div>
              </button>
            );
          })}
        </div>
        <div className="space-y-3">
          {selected.method === "POST" && !selected.multipart && (
            <label className="block text-xs text-muted">
              Request body
              <textarea
                className="mt-1 h-44 w-full rounded-xl border border-line bg-soft p-3 font-mono text-xs text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                spellCheck={false}
              />
            </label>
          )}
          <Button onClick={run} disabled={loading}>
            {loading ? "Calling…" : "Execute request"}
          </Button>
          {status !== null && (
            <p className="text-xs text-muted">
              HTTP <span className="font-mono text-accent">{status}</span>
              {!ok && (
                <span className="mt-2 block rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-warn" role="alert">
                  {apiStatusHint(status, data)}
                </span>
              )}
            </p>
          )}
          <pre className="json-view min-h-40 overflow-auto rounded-xl border border-line bg-black/40 p-4 text-slate-200">
            {result || "// Response JSON appears here"}
          </pre>
        </div>
      </div>
    </Section>
  );
}
