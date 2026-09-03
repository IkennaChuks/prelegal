import { MndaCreator } from "@/components/nda/MndaCreator";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Mutual NDA Creator</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Fill in the details below to generate a Common Paper Mutual Non-Disclosure Agreement, then download
            it as a PDF.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <MndaCreator />
      </main>
      <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500">
        Built on the{" "}
        <a
          href="https://commonpaper.com/standards/mutual-nda/1.0"
          className="underline hover:text-neutral-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          Common Paper Mutual NDA
        </a>
        , free to use under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="underline hover:text-neutral-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY 4.0
        </a>
        . This is a prototype, not legal advice.
      </footer>
    </div>
  );
}
