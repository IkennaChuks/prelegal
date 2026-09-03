"use client";

import dynamic from "next/dynamic";
import type { NdaDocument } from "@/lib/nda/types";

const PdfDownloadLinkClient = dynamic(() => import("./PdfDownloadLinkClient"), {
  ssr: false,
  loading: () => (
    <button
      type="button"
      disabled
      className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white opacity-60"
    >
      Preparing PDF…
    </button>
  ),
});

/** Button that generates and downloads the merged NDA as a PDF, entirely client-side. */
export function NdaPdfDownloadButton({ doc, fileName }: { doc: NdaDocument; fileName: string }) {
  return <PdfDownloadLinkClient doc={doc} fileName={fileName} />;
}
