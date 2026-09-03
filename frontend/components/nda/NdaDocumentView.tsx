import type { DocumentBlock, NdaDocument, TextRun } from "@/lib/nda/types";

function Runs({ runs }: { runs: TextRun[] }) {
  return (
    <>
      {runs.map((run, i) =>
        run.bold ? <strong key={i}>{run.text}</strong> : <span key={i}>{run.text}</span>,
      )}
    </>
  );
}

function Block({ block }: { block: DocumentBlock }) {
  if (block.kind === "table") {
    const [header, ...rows] = block.rows;
    return (
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th
                key={i}
                className="border border-neutral-300 bg-neutral-50 px-3 py-2 text-left font-semibold text-neutral-700"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-neutral-300 px-3 py-2 align-top text-neutral-800">
                  {cell || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <p className="mt-3 text-sm leading-relaxed text-neutral-800">
      {block.label && <span className="font-semibold">{block.label}: </span>}
      <Runs runs={block.runs} />
    </p>
  );
}

/** Renders a merged Mutual NDA for on-screen review. Mirrored by NdaPdfDocument for download. */
export function NdaDocumentView({ doc }: { doc: NdaDocument }) {
  return (
    <article className="mx-auto max-w-3xl rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-neutral-900">{doc.title}</h1>
      {doc.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="border-b border-neutral-200 pb-2 text-lg font-semibold text-neutral-900">
            {section.heading}
          </h2>
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}
      <p className="mt-8 border-t border-neutral-200 pt-4 text-xs text-neutral-500">{doc.footer}</p>
    </article>
  );
}
