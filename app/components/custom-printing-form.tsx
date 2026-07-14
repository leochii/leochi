"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GARMENT_OPTIONS } from "../lib/custom-printing";

type FormState = {
  name: string;
  email: string;
  company: string;
  brandWebsite: string;
  quantity: string;
  garmentType: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  brandWebsite: "",
  quantity: "",
  garmentType: GARMENT_OPTIONS[0],
  notes: "",
};

const fieldClassName =
  "w-full rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[#fff7ed] placeholder:text-[#fff7ed]/70 outline-none transition duration-200 focus:border-[#E8D7C5] focus:shadow-[0_0_0_1px_rgba(232,215,197,0.4)]";

const textareaClassName =
  "w-full rounded-[1.6rem] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm leading-7 text-[#fff7ed] placeholder:text-[#fff7ed]/70 outline-none transition duration-200 focus:border-[#E8D7C5] focus:shadow-[0_0_0_1px_rgba(232,215,197,0.4)]";

const selectClassName =
  "w-full rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[#fff7ed] outline-none transition duration-200 focus:border-[#E8D7C5] focus:shadow-[0_0_0_1px_rgba(232,215,197,0.4)]";

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  function setFiles(files: File[]) {
    setSelectedFiles(files);
    setErrorMessage(null);
  }

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []));
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

    const droppedFiles = Array.from(event.dataTransfer.files ?? []);
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formState.name.trim().length < 2 || formState.email.trim().length === 0 || formState.quantity.trim().length === 0 || !formState.garmentType || selectedFiles.length === 0) {
      setErrorMessage("Please complete the required fields and upload at least one design file.");
      return;
    }

    const parsedQuantity = Number.parseInt(formState.quantity, 10);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 5) {
      setErrorMessage("Minimum Order: 5 Pieces+");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("name", formState.name);
    payload.append("email", formState.email);
    payload.append("company", formState.company);
    payload.append("instagramOrWebsite", formState.brandWebsite);
    payload.append("quantity", formState.quantity);
    payload.append("garmentType", formState.garmentType);
    payload.append("notes", formState.notes);
    selectedFiles.forEach((file) => payload.append("designs", file));

    try {
      const response = await fetch("/api/custom-printing", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as {
        error?: string;
        requestId?: string;
        quoteNumber?: string;
        status?: string;
      };

      if (!response.ok) {
        setErrorMessage(result.error ?? "Something went wrong while sending your request.");
        setIsSubmitting(false);
        return;
      }

      const destination = result.requestId
        ? `/custom-printing/success?request=${encodeURIComponent(result.requestId)}${result.quoteNumber ? `&quote=${encodeURIComponent(result.quoteNumber)}` : ""}${result.status ? `&status=${encodeURIComponent(result.status)}` : ""}`
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
    <form onSubmit={onSubmit} className="rounded-[2rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Full Name</span>
          <input required name="name" value={formState.name} onChange={updateField} className={fieldClassName} placeholder="Your full name" />
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Email</span>
          <input required type="email" name="email" value={formState.email} onChange={updateField} className={fieldClassName} placeholder="name@company.com" />
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Company Name <span className="text-[#c3b5a2]">(Optional)</span></span>
          <input name="company" value={formState.company} onChange={updateField} className={fieldClassName} placeholder="Optional" />
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Brand Website <span className="text-[#c3b5a2]">(Optional)</span></span>
          <input name="brandWebsite" value={formState.brandWebsite} onChange={updateField} className={fieldClassName} placeholder="Optional" />
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Quantity</span>
          <input required min="5" type="number" name="quantity" value={formState.quantity} onChange={updateField} className={fieldClassName} placeholder="24" />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Garment Type</span>
          <select name="garmentType" value={formState.garmentType} onChange={updateField} className={selectClassName}>
            {GARMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Additional Notes</span>
          <textarea name="notes" value={formState.notes} onChange={updateField} rows={6} className={textareaClassName} placeholder="Tell us about garment colors, sizing, placement, deadlines, special packaging requirements, or any additional information." />
        </label>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Upload Design Files</p>
        <label
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-[1.9rem] border px-6 py-8 text-center transition duration-300 ${
            isDragging
              ? "border-[#E8D7C5] bg-[rgba(255,255,255,0.06)] shadow-[0_0_0_1px_rgba(232,215,197,0.4)]"
              : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] hover:border-[#E8D7C5] hover:bg-[rgba(255,255,255,0.05)]"
          }`}
        >
          <input ref={inputRef} required type="file" name="designs" multiple accept=".png,.pdf,.ai,.psd,.svg,.eps,.jpg,.jpeg" onChange={onFileInputChange} className="sr-only" />

          <p className="text-sm font-medium text-[#fff7ed]">Drop your production files here</p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#cdb99a]">or tap to browse files</p>

          {selectedFiles.length > 0 ? (
            <div className="mt-5 w-full space-y-2 text-left">
              {selectedFiles.map((file) => (
                <div key={`${file.name}-${file.size}`} className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#efe3d3]">
                  {file.name} · {formatFileSize(file.size)}
                </div>
              ))}
            </div>
          ) : null}
        </label>

        {selectedFiles.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setFiles([]);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
            className="mt-4 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#efe3d3] transition hover:border-[#E8D7C5] hover:bg-[rgba(255,255,255,0.06)]"
          >
            Remove Files
          </button>
        ) : null}
      </div>

      {errorMessage ? <p className="mt-6 text-sm text-red-300">{errorMessage}</p> : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#d2bea0]">
          Minimum Order: 5 Pieces+
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isNavigating}
          className="inline-flex items-center justify-center rounded-full bg-[#f3e5cf] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[#fff4e4] disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isSubmitting || isNavigating ? "Sending Request..." : "Submit Project"}
        </button>
      </div>
    </form>
  );
}