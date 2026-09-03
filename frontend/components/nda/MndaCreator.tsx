"use client";

import { useMemo, useState } from "react";
import { buildNdaDocument } from "@/lib/nda/build-document";
import { DEFAULT_NDA_FORM_DATA } from "@/lib/nda/types";
import type { NdaFormData } from "@/lib/nda/types";
import { NdaDocumentView } from "./NdaDocumentView";
import { NdaForm } from "./NdaForm";
import { NdaPdfDownloadButton } from "./NdaPdfDownloadButton";

type Step = "form" | "review";

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function MndaCreator() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<NdaFormData>(DEFAULT_NDA_FORM_DATA);

  const doc = useMemo(() => buildNdaDocument(formData), [formData]);

  const fileName = useMemo(() => {
    const parties = [formData.party1.company, formData.party2.company]
      .map(slugify)
      .filter(Boolean)
      .join("-and-");
    return `mutual-nda${parties ? `-${parties}` : ""}.pdf`;
  }, [formData.party1.company, formData.party2.company]);

  if (step === "review") {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep("form")}
            className="inline-flex items-center justify-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            ← Edit details
          </button>
          <NdaPdfDownloadButton doc={doc} fileName={fileName} />
        </div>
        <NdaDocumentView doc={doc} />
      </div>
    );
  }

  return <NdaForm value={formData} onChange={setFormData} onSubmit={() => setStep("review")} />;
}
