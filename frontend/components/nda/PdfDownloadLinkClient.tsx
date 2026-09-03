"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import type { NdaDocument } from "@/lib/nda/types";
import { NdaPdfDocument } from "./NdaPdfDocument";

const buttonClass =
  "inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Renders the actual PDF-generating download link. Loaded via next/dynamic
 * with ssr:false from NdaPdfDownloadButton, since @react-pdf/renderer's
 * PDFDownloadLink relies on browser-only APIs (Blob, URL.createObjectURL).
 */
export default function PdfDownloadLinkClient({ doc, fileName }: { doc: NdaDocument; fileName: string }) {
  return (
    <PDFDownloadLink document={<NdaPdfDocument doc={doc} />} fileName={fileName} className={buttonClass}>
      {({ loading, error }) => {
        if (error) return "Couldn't generate PDF — try again";
        return loading ? "Preparing PDF…" : "Download PDF";
      }}
    </PDFDownloadLink>
  );
}
