"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GARMENT_OPTIONS } from "../lib/custom-printing";

type FormState = {
  name: string;
  email: string;
  company: string;
  quantity: string;
  garmentType: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  quantity: "",
  garmentType: GARMENT_OPTIONS[0],
  notes: "",
};

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function CustomPrintingForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isNavigating, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>(initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function setFile(file: File | null) {
    setSelectedFile(file);
    setErrorMessage(null);
  }

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  function onDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Upload your design to continue.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("name", formState.name);
    payload.append("email", formState.email);
    payload.append("company", formState.company);
    payload.append("quantity", formState.quantity);
    payload.append("garmentType", formState.garmentType);
    payload.append("notes", formState.notes);
    payload.append("design", selectedFile);

    try {
      const response = await fetch("/api/custom-printing", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as {
        error?: string;
        requestId?: string;
      };

      if (!response.ok) {
        setErrorMessage(result.error ?? "Something went wrong while sending your request.");
        setIsSubmitting(false);
        return;
      }

      const destination = result.requestId
        ? `/custom-printing/success?request=${encodeURIComponent(result.requestId)}`
        : "/custom-printing/success";

      startTransition(() => {
        router.push(destination);
      });
    } catch {
      setErrorMessage("Something went wrong while sending your request.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-neutral-400">Name</span>
            <input
              required
              name="name"
              value={formState.name}
              onChange={updateField}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40"
              placeholder="Your full name"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-neutral-400">Email</span>
            <input
              required
              type="email"
              name="email"
              value={formState.email}
              onChange={updateField}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40"
              placeholder="name@company.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-neutral-400">Company Name</span>
            <input
              name="company"
              value={formState.company}
              onChange={updateField}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40"
              placeholder="Optional"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-neutral-400">Quantity</span>
            <input
              required
              min="1"
              type="number"
              name="quantity"
              value={formState.quantity}
              onChange={updateField}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40"
              placeholder="12"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-5">
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-neutral-400">Garment Type</span>
            <select
              name="garmentType"
              value={formState.garmentType}
              onChange={updateField}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40"
            >
              {GARMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-neutral-400">Additional Notes</span>
            <textarea
              name="notes"
              value={formState.notes}
              onChange={updateField}
              rows={6}
              className="w-full rounded-[1.5rem] border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/40"
              placeholder="Print placement, garment color, delivery timeline, or finishing notes."
            />
          </label>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">Upload Design</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-neutral-300">
            Drag and drop your artwork, tech pack, or mockup. Preferred formats: PDF, AI, EPS, SVG, PNG, JPG.
          </p>
        </div>

        <label
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border px-6 py-8 text-center transition duration-300 ${
            isDragging
              ? "border-white bg-white/[0.08]"
              : "border-dashed border-white/15 bg-black/45 hover:border-white/40 hover:bg-white/[0.03]"
          }`}
        >
          <input
            ref={inputRef}
            required
            type="file"
            name="design"
            accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg"
            onChange={onFileInputChange}
            className="sr-only"
          />

          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 16V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7.5 9.5L12 5l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 18.5C5 17.672 5.672 17 6.5 17H17.5C18.328 17 19 17.672 19 18.5C19 19.328 18.328 20 17.5 20H6.5C5.672 20 5 19.328 5 18.5Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>

          {selectedFile ? (
            <>
              <p className="text-sm font-medium text-white">{selectedFile.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-neutral-500">{formatFileSize(selectedFile.size)}</p>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
                className="mt-6 rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-neutral-200 transition hover:border-white/40 hover:bg-white/5"
              >
                Remove File
              </button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-white">Drop your design here</p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-neutral-500">or tap to browse files</p>
            </>
          )}
        </label>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/55 p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">Submission</p>
          <p className="mt-3 text-sm leading-7 text-neutral-300">
            We review every request manually and respond with garment recommendations, print methods, and a custom quote.
          </p>
        </div>

        {errorMessage ? <p className="mt-5 text-sm text-red-300">{errorMessage}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting || isNavigating}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isSubmitting || isNavigating ? "Sending Request..." : "Request a Quote"}
        </button>
      </div>
    </form>
  );
}