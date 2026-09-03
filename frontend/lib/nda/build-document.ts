import { MNDA_TITLE, SOURCE_FOOTER, STANDARD_TERMS, STANDARD_TERMS_INTRO } from "./content";
import {
  confidentialityTermSentence,
  formatEffectiveDate,
  mndaTermSentence,
  parseInline,
} from "./format";
import type { DocumentBlock, NdaDocument, NdaFormData } from "./types";

/** Replaces the `{{Token}}` placeholders in clause text with resolved Cover Page values. */
function mergePlaceholders(body: string, tokens: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (match, token: string) => tokens[token] ?? match);
}

function paragraph(text: string, label?: string): DocumentBlock {
  return { kind: "paragraph", label, runs: parseInline(text) };
}

/**
 * Merges the user's form input into the Mutual NDA Cover Page + Standard
 * Terms, producing a document model that both the on-screen preview and
 * the PDF export render from a single source of truth.
 */
export function buildNdaDocument(data: NdaFormData): NdaDocument {
  const effectiveDate = formatEffectiveDate(data.effectiveDate);
  const purpose = data.purpose.trim() || "the Purpose described by the parties";
  const governingLaw = data.governingLaw.trim() || "[Governing Law not provided]";
  const jurisdiction = data.jurisdiction.trim() || "[Jurisdiction not provided]";

  const tokens: Record<string, string> = {
    Purpose: purpose,
    EffectiveDate: effectiveDate,
    GoverningLaw: governingLaw,
    Jurisdiction: jurisdiction,
  };

  const coverPageBlocks: DocumentBlock[] = [
    paragraph(purpose, "Purpose"),
    paragraph(effectiveDate, "Effective Date"),
    paragraph(mndaTermSentence(data), "MNDA Term"),
    paragraph(confidentialityTermSentence(data), "Term of Confidentiality"),
    paragraph(`Governing Law: ${governingLaw}. Jurisdiction: ${jurisdiction}.`, "Governing Law & Jurisdiction"),
  ];

  if (data.modifications.trim()) {
    coverPageBlocks.push(paragraph(data.modifications.trim(), "MNDA Modifications"));
  }

  coverPageBlocks.push({
    kind: "table",
    rows: [
      ["", "Party 1", "Party 2"],
      ["Print Name", data.party1.printName, data.party2.printName],
      ["Title", data.party1.title, data.party2.title],
      ["Company", data.party1.company, data.party2.company],
      ["Notice Address", data.party1.noticeAddress, data.party2.noticeAddress],
      ["Signature", "", ""],
      ["Date", "", ""],
    ],
  });

  // Clause 1 is the Introduction (kept separate from STANDARD_TERMS since it has no heading);
  // the rest are numbered 2-11 in source order.
  const standardTermsBlocks: DocumentBlock[] = [
    paragraph(`1. ${mergePlaceholders(STANDARD_TERMS_INTRO.body, tokens)}`),
    ...STANDARD_TERMS.map((clause, index) =>
      paragraph(`${index + 2}. ${mergePlaceholders(clause.body, tokens)}`),
    ),
  ];

  return {
    title: MNDA_TITLE,
    sections: [
      { heading: "Cover Page", blocks: coverPageBlocks },
      { heading: "Standard Terms", blocks: standardTermsBlocks },
    ],
    footer: SOURCE_FOOTER,
  };
}
