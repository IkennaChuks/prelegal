import type { NdaFormData, TextRun } from "./types";

/** Formats a yyyy-mm-dd form value as "September 3, 2026". Falls back to the raw value if unset/invalid. */
export function formatEffectiveDate(isoDate: string): string {
  if (!isoDate) return "[Effective Date]";
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

function pluralYears(years: number): string {
  return `${years} year${years === 1 ? "" : "s"}`;
}

export function mndaTermSentence(data: NdaFormData): string {
  return data.mndaTermType === "fixed"
    ? `Expires ${pluralYears(data.mndaTermYears)} from the Effective Date.`
    : "Continues until terminated in accordance with the terms of the MNDA.";
}

export function confidentialityTermSentence(data: NdaFormData): string {
  return data.confidentialityTermType === "fixed"
    ? `${pluralYears(data.confidentialityTermYears)} from the Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
    : "In perpetuity.";
}

/**
 * Splits `**bold**` markdown spans out of a plain string into text runs, so
 * screen and PDF renderers can share one representation of "rich" text
 * without pulling in a full markdown parser.
 */
export function parseInline(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push({ text: text.slice(lastIndex, match.index) });
    }
    runs.push({ text: match[1], bold: true });
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    runs.push({ text: text.slice(lastIndex) });
  }
  return runs;
}
