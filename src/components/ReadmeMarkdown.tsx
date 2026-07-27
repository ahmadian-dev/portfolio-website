import ReactMarkdown from "react-markdown";

export function ReadmeMarkdown({ markdown }: { markdown: string }) {
  return (
    <article className="readme-md max-w-none rounded-xl border border-line bg-elev px-5 py-6 text-sm leading-relaxed text-ink md:px-8 md:py-8">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">{children}</h1>
          ),
          h2: ({ children }) => <h2 className="mt-8 mb-3 text-xl font-semibold text-ink">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-6 mb-2 text-lg font-semibold text-ink">{children}</h3>,
          p: ({ children }) => <p className="mb-3 text-muted">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-5 text-muted">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-5 text-muted">{children}</ol>,
          li: ({ children }) => <li className="text-muted">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="text-accent hover:underline" target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-soft px-1.5 py-0.5 font-mono text-[0.85em] text-accent">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg border border-line bg-black/40 p-4 font-mono text-xs text-ink">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-line px-2 py-2 font-semibold text-muted">{children}</th>
          ),
          td: ({ children }) => <td className="border-b border-line px-2 py-2 text-ink/90">{children}</td>,
          hr: () => <hr className="my-6 border-line" />,
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-2 border-accent/50 pl-4 text-muted">{children}</blockquote>
          ),
          strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
