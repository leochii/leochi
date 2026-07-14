"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GARMENT_OPTIONS, PRINT_DETAIL_OPTIONS } from "../lib/custom-printing";

type FormState = {
  name: string;
  email: string;
  company: string;
  instagramOrWebsite: string;
  quantity: string;
  garmentType: string;
  desiredDeliveryDate: string;
  printDetails: string[];
  notes: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  instagramOrWebsite: "",
  quantity: "",
  garmentType: GARMENT_OPTIONS[0],
  desiredDeliveryDate: "",
  printDetails: [],
  notes: "",
};

const steps = [
  "Contact Information",
  "Project Details",
  "Print Details",
  "Upload Files",
  "Review & Submit",
] as const;

const turnaroundTiers = [
  {
    range: "5-9 Pieces",
    estimate: "7-10 Business Days",
  },
  {
    range: "10-24 Pieces",
    estimate: "7-12 Business Days",
  },
  {
    range: "25+ Pieces",
    estimate: "10-14 Business Days",
  },
];

const fieldClassName =
  "w-full rounded-2xl border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.045)] px-4 py-3 text-sm text-[#fff7ed] placeholder:text-[#fff7ed]/68 outline-none transition duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus:border-[rgba(255,255,255,0.45)] focus:bg-[rgba(255,255,255,0.065)] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_0_4px_rgba(255,255,255,0.1),0_0_28px_rgba(255,255,255,0.1)]";

const textareaClassName =
  "w-full rounded-[1.6rem] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.045)] px-4 py-4 text-sm leading-7 text-[#fff7ed] placeholder:text-[#fff7ed]/68 outline-none transition duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus:border-[rgba(255,255,255,0.45)] focus:bg-[rgba(255,255,255,0.065)] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_0_4px_rgba(255,255,255,0.1),0_0_28px_rgba(255,255,255,0.1)]";

const selectClassName =
  "w-full rounded-2xl border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.045)] px-4 py-3 text-sm text-[#fff7ed] outline-none transition duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus:border-[rgba(255,255,255,0.45)] focus:bg-[rgba(255,255,255,0.065)] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_0_4px_rgba(255,255,255,0.1),0_0_28px_rgba(255,255,255,0.1)]";

const checkboxClassName =
  "h-4 w-4 rounded border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.045)] text-[#f3e5cf] outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus:border-[rgba(255,255,255,0.45)] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_0_4px_rgba(255,255,255,0.1),0_0_28px_rgba(255,255,255,0.1)]";

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
  const [currentStep, setCurrentStep] = useState(0);
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

  function updatePrintDetail(value: string) {
    setFormState((current) => ({
      ...current,
      printDetails: current.printDetails.includes(value)
        ? current.printDetails.filter((item) => item !== value)
        : [...current.printDetails, value],
    }));
    setErrorMessage(null);
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

  function validateStep(step: number) {
    if (step === 0) {
      if (formState.name.trim().length < 2 || formState.email.trim().length === 0) {
        setErrorMessage("Enter your full name and email to continue.");
        return false;
      }
    }

    if (step === 1) {
      const quantity = Number.parseInt(formState.quantity, 10);

      if (!formState.garmentType || !formState.desiredDeliveryDate) {
        setErrorMessage("Complete garment type, quantity, and delivery date to continue.");
        return false;
      }

      if (!Number.isFinite(quantity) || quantity < 5) {
        setErrorMessage("Minimum Order: 5 Pieces+");
        return false;
      }
    }

    if (step === 2 && formState.printDetails.length === 0) {
      setErrorMessage("Select at least one print detail to continue.");
      return false;
    }

    if (step === 3 && selectedFiles.length === 0) {
      setErrorMessage("Upload at least one design file to continue.");
      return false;
    }

    setErrorMessage(null);
    return true;
  }

  function goToNextStep() {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  function goToPreviousStep() {
    setErrorMessage(null);
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("name", formState.name);
    payload.append("email", formState.email);
    payload.append("company", formState.company);
    payload.append("instagramOrWebsite", formState.instagramOrWebsite);
    payload.append("quantity", formState.quantity);
    payload.append("garmentType", formState.garmentType);
    payload.append("desiredDeliveryDate", formState.desiredDeliveryDate);
    formState.printDetails.forEach((detail) => payload.append("printDetails", detail));
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

  const parsedQuantity = Number.parseInt(formState.quantity, 10);
  const quantityIsBelowMinimum = formState.quantity.length > 0 && (!Number.isFinite(parsedQuantity) || parsedQuantity < 5);

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
      <aside className="rounded-[2rem] border border-[#f3e5cf]/10 bg-gradient-to-b from-[#f6ead7]/[0.08] to-transparent p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8 lg:sticky lg:top-28 lg:h-fit">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Studio Order Flow</p>
        <h3 className="mt-4 font-serif text-3xl text-[#fff7ed]">Build your project brief.</h3>
        <div className="mt-8 space-y-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`rounded-[1.35rem] border px-4 py-4 transition ${
                index === currentStep
                  ? "border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.08)]"
                  : index < currentStep
                    ? "border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.055)]"
                    : "border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.035)]"
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#cdb99a]">0{index + 1}</p>
              <p className="mt-2 text-sm text-[#fff7ed]">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Estimated Turnaround</p>
          <div className="mt-4 space-y-3">
            {turnaroundTiers.map((tier) => (
              <div key={tier.range} className="rounded-[1.15rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.055)] p-4">
                <p className="text-sm font-medium text-[#fff7ed]">{tier.range}</p>
                <p className="mt-2 text-sm leading-6 text-[#d7c9b5]">Estimated Production: {tier.estimate}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="rounded-[2rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Step {currentStep + 1}</p>
            <h3 className="mt-3 font-serif text-3xl text-[#fff7ed]">{steps[currentStep]}</h3>
          </div>
          <div className="rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.055)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#efe3d3]">
            Minimum Order: 5 Pieces+
          </div>
        </div>

        {currentStep === 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Full Name</span>
              <input
                required
                name="name"
                value={formState.name}
                onChange={updateField}
                className={fieldClassName}
                placeholder="Your full name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Email</span>
              <input
                required
                type="email"
                name="email"
                value={formState.email}
                onChange={updateField}
                className={fieldClassName}
                placeholder="name@company.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Company Name</span>
              <input
                name="company"
                value={formState.company}
                onChange={updateField}
                className={fieldClassName}
                placeholder="Optional"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Instagram / Website</span>
              <input
                name="instagramOrWebsite"
                value={formState.instagramOrWebsite}
                onChange={updateField}
                className={fieldClassName}
                placeholder="Optional social handle or website"
              />
            </label>
          </div>
        ) : null}

        {currentStep === 1 ? (
            <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Garment Type</span>
              <select
                name="garmentType"
                value={formState.garmentType}
                onChange={updateField}
                className={selectClassName}
              >
                {GARMENT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Quantity</span>
              <input
                required
                min="5"
                type="number"
                name="quantity"
                value={formState.quantity}
                onChange={updateField}
                className={fieldClassName}
                placeholder="24"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Desired Delivery Date</span>
              <input
                required
                type="date"
                name="desiredDeliveryDate"
                value={formState.desiredDeliveryDate}
                onChange={updateField}
                className={fieldClassName}
              />
            </label>

            {quantityIsBelowMinimum ? (
              <div className="md:col-span-2 rounded-[1.3rem] border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-200">
                Minimum production quantity is 5 pieces.
              </div>
            ) : null}

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Project Notes</span>
              <textarea
                name="notes"
                value={formState.notes}
                onChange={updateField}
                rows={7}
                className={textareaClassName}
                placeholder="Tell us about garment colors, sizing, placement, deadlines, special packaging requirements, or any additional information."
              />
            </label>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PRINT_DETAIL_OPTIONS.map((option) => {
                const checked = formState.printDetails.includes(option);

                return (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-[1.4rem] border px-4 py-4 transition ${
                      checked
                        ? "border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.08)]"
                        : "border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.035)] hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.055)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => updatePrintDetail(option)}
                      className={checkboxClassName}
                    />
                    <span className="text-sm text-[#fff7ed]">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div>
            <div className="mb-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Upload Files</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d7c9b5]">
                Upload your artwork, mockups, brand assets, or brief files. Accepted formats: PNG, PDF, AI, PSD, SVG, EPS, JPG.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#c3b5a2]">
                Don&apos;t have production-ready artwork? Our team can assist with file preparation.
              </p>
            </div>

        <label
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-[1.9rem] border px-6 py-8 text-center transition duration-300 ${
            isDragging
              ? "border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.08)] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_24px_rgba(255,255,255,0.12)]"
              : "border-dashed border-[rgba(255,255,255,0.24)] bg-[rgba(255,255,255,0.045)] hover:border-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.065)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_24px_rgba(255,255,255,0.1)]"
          }`}
        >
          <input
            ref={inputRef}
            required
            type="file"
            name="designs"
            multiple
            accept=".png,.pdf,.ai,.psd,.svg,.eps,.jpg,.jpeg"
            onChange={onFileInputChange}
            className="sr-only"
          />

          <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#f3e5cf]/15 bg-[#f3e5cf]/[0.05] text-[#f3e5cf]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 16V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7.5 9.5L12 5l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 18.5C5 17.672 5.672 17 6.5 17H17.5C18.328 17 19 17.672 19 18.5C19 19.328 18.328 20 17.5 20H6.5C5.672 20 5 19.328 5 18.5Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>

          {selectedFiles.length > 0 ? (
            <>
              <p className="text-sm font-medium text-[#fff7ed]">{selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected</p>
              <div className="mt-4 space-y-2 text-left">
                {selectedFiles.map((file) => (
                  <div key={`${file.name}-${file.size}`} className="rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.055)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#efe3d3]">
                    {file.name} · {formatFileSize(file.size)}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
                className="mt-6 rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#efe3d3] transition hover:border-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.08)]"
              >
                Remove Files
              </button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[#fff7ed]">Drop your production files here</p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#cdb99a]">or tap to browse files</p>
            </>
          )}
        </label>
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Customer Information</p>
                <div className="mt-4 space-y-2 text-sm leading-7 text-[#efe3d3]">
                  <p>{formState.name}</p>
                  <p>{formState.email}</p>
                  <p>{formState.company || "No company provided"}</p>
                  <p>{formState.instagramOrWebsite || "No Instagram / Website provided"}</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Project Details</p>
                <div className="mt-4 space-y-2 text-sm leading-7 text-[#efe3d3]">
                  <p>{formState.garmentType}</p>
                  <p>{formState.quantity} pieces</p>
                  <p>Desired delivery: {formState.desiredDeliveryDate}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Print Details</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {formState.printDetails.map((detail) => (
                  <span key={detail} className="rounded-full border border-[#f3e5cf]/15 bg-[#f3e5cf]/[0.05] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#efe3d3]">
                    {detail}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Uploaded Files</p>
              <div className="mt-4 space-y-2 text-sm leading-7 text-[#efe3d3]">
                {selectedFiles.map((file) => (
                  <p key={`${file.name}-${file.size}`}>{file.name} · {formatFileSize(file.size)}</p>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#f3e5cf]/10 bg-black/35 p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Project Notes</p>
              <p className="mt-4 text-sm leading-7 text-[#efe3d3]">{formState.notes || "No additional notes provided."}</p>
            </div>

            <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.055)] p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Submission</p>
              <p className="mt-3 text-sm leading-7 text-[#d7c9b5]">
                Our production team will review your project and send a tailored quote within 24 hours.
              </p>
            </div>
          </div>
        ) : null}

        {errorMessage ? <p className="mt-6 text-sm text-red-300">{errorMessage}</p> : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 0 || isSubmitting || isNavigating}
            className="inline-flex items-center justify-center rounded-full border border-[#f3e5cf]/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#efe3d3] transition hover:border-[#f3e5cf]/35 hover:bg-[#f3e5cf]/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous Step
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="inline-flex items-center justify-center rounded-full bg-[#f3e5cf] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[#fff4e4]"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || isNavigating}
              className="inline-flex items-center justify-center rounded-full bg-[#f3e5cf] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[#fff4e4] disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isSubmitting || isNavigating ? "Sending Request..." : "Submit Project"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}