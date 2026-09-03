"use client";

import type { ChangeEvent } from "react";
import type { NdaFormData, PartyDetails, TermLength } from "@/lib/nda/types";

const inputClass =
  "mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500";
const labelClass = "block text-sm font-medium text-neutral-700";
const hintClass = "mt-1 text-xs text-neutral-500";
const fieldsetClass = "rounded-lg border border-neutral-200 p-5";
const legendClass = "px-1 text-base font-semibold text-neutral-900";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <span className={hintClass}>{hint}</span>}
    </label>
  );
}

function PartyFields({
  title,
  party,
  onChange,
}: {
  title: string;
  party: PartyDetails;
  onChange: (party: PartyDetails) => void;
}) {
  const update = (key: keyof PartyDetails) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...party, [key]: e.target.value });

  return (
    <fieldset className={fieldsetClass}>
      <legend className={legendClass}>{title}</legend>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Print name">
          <input required className={inputClass} value={party.printName} onChange={update("printName")} />
        </Field>
        <Field label="Title">
          <input required className={inputClass} value={party.title} onChange={update("title")} />
        </Field>
        <Field label="Company">
          <input required className={inputClass} value={party.company} onChange={update("company")} />
        </Field>
        <Field label="Notice address" hint="Email or postal address">
          <input required className={inputClass} value={party.noticeAddress} onChange={update("noticeAddress")} />
        </Field>
      </div>
    </fieldset>
  );
}

function TermRadioGroup({
  name,
  type,
  years,
  fixedLabel,
  unlimitedLabel,
  onTypeChange,
  onYearsChange,
}: {
  name: string;
  type: TermLength;
  years: number;
  fixedLabel: string;
  unlimitedLabel: string;
  onTypeChange: (type: TermLength) => void;
  onYearsChange: (years: number) => void;
}) {
  return (
    <div className="mt-2 space-y-2">
      <label className="flex items-center gap-2 text-sm text-neutral-800">
        <input
          type="radio"
          name={name}
          checked={type === "fixed"}
          onChange={() => onTypeChange("fixed")}
        />
        {fixedLabel}
        <input
          type="number"
          min={1}
          max={99}
          disabled={type !== "fixed"}
          value={years}
          onChange={(e) => onYearsChange(Number(e.target.value) || 1)}
          className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-sm disabled:bg-neutral-100"
        />
        year(s) from Effective Date
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-800">
        <input
          type="radio"
          name={name}
          checked={type === "unlimited"}
          onChange={() => onTypeChange("unlimited")}
        />
        {unlimitedLabel}
      </label>
    </div>
  );
}

export function NdaForm({
  value,
  onChange,
  onSubmit,
}: {
  value: NdaFormData;
  onChange: (data: NdaFormData) => void;
  onSubmit: () => void;
}) {
  const set = <K extends keyof NdaFormData>(key: K, val: NdaFormData[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Agreement details</legend>
        <div className="mt-3 space-y-4">
          <Field label="Purpose" hint="How the parties may use each other's Confidential Information">
            <textarea
              required
              rows={2}
              className={inputClass}
              value={value.purpose}
              onChange={(e) => set("purpose", e.target.value)}
            />
          </Field>
          <Field label="Effective date">
            <input
              required
              type="date"
              className={inputClass}
              value={value.effectiveDate}
              onChange={(e) => set("effectiveDate", e.target.value)}
            />
          </Field>
          <div>
            <span className={labelClass}>MNDA term</span>
            <span className={hintClass}>How long this MNDA lasts before it expires</span>
            <TermRadioGroup
              name="mndaTermType"
              type={value.mndaTermType}
              years={value.mndaTermYears}
              fixedLabel="Expires after"
              unlimitedLabel="Continues until terminated by either party"
              onTypeChange={(t) => set("mndaTermType", t)}
              onYearsChange={(y) => set("mndaTermYears", y)}
            />
          </div>
          <div>
            <span className={labelClass}>Term of confidentiality</span>
            <span className={hintClass}>How long Confidential Information stays protected</span>
            <TermRadioGroup
              name="confidentialityTermType"
              type={value.confidentialityTermType}
              years={value.confidentialityTermYears}
              fixedLabel="Expires after"
              unlimitedLabel="In perpetuity"
              onTypeChange={(t) => set("confidentialityTermType", t)}
              onYearsChange={(y) => set("confidentialityTermYears", y)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Governing law" hint="e.g. Delaware">
              <input
                required
                className={inputClass}
                value={value.governingLaw}
                onChange={(e) => set("governingLaw", e.target.value)}
              />
            </Field>
            <Field label="Jurisdiction" hint="City or county and state where suits will be heard, e.g. New Castle, DE">
              <input
                required
                className={inputClass}
                value={value.jurisdiction}
                onChange={(e) => set("jurisdiction", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Modifications" hint="Optional — any changes to the Standard Terms">
            <textarea
              rows={2}
              className={inputClass}
              value={value.modifications}
              onChange={(e) => set("modifications", e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      <PartyFields title="Party 1" party={value.party1} onChange={(p) => set("party1", p)} />
      <PartyFields title="Party 2" party={value.party2} onChange={(p) => set("party2", p)} />

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
      >
        Generate NDA
      </button>
    </form>
  );
}
