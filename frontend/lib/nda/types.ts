/**
 * Data captured by the Mutual NDA creation form. Field names mirror the
 * Cover Page sections in ../../../templates/Mutual-NDA-coverpage.md.
 */

export type TermLength = "fixed" | "unlimited";

export interface PartyDetails {
  printName: string;
  title: string;
  company: string;
  noticeAddress: string;
}

export interface NdaFormData {
  purpose: string;
  effectiveDate: string; // yyyy-mm-dd, as produced by <input type="date">
  mndaTermType: TermLength;
  mndaTermYears: number;
  confidentialityTermType: TermLength;
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: PartyDetails;
  party2: PartyDetails;
}

export const EMPTY_PARTY: PartyDetails = {
  printName: "",
  title: "",
  company: "",
  noticeAddress: "",
};

export const DEFAULT_NDA_FORM_DATA: NdaFormData = {
  purpose: "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: "",
  mndaTermType: "fixed",
  mndaTermYears: 1,
  confidentialityTermType: "fixed",
  confidentialityTermYears: 1,
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: { ...EMPTY_PARTY },
  party2: { ...EMPTY_PARTY },
};

/** A run of text with optional emphasis, used to render simple **bold** markdown. */
export interface TextRun {
  text: string;
  bold?: boolean;
}

export type DocumentBlock =
  | { kind: "paragraph"; label?: string; runs: TextRun[] }
  | { kind: "table"; rows: [string, string, string][] };

export interface DocumentSection {
  heading: string;
  blocks: DocumentBlock[];
}

/** The fully-merged, ready-to-render Mutual NDA. */
export interface NdaDocument {
  title: string;
  sections: DocumentSection[];
  footer: string;
}
