"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CUSTOM_PRINTING_STATUS_FLOW, type CustomPrintingStatus } from "../../lib/custom-printing";

type StatusDropdownProps = {
  requestId: string;
  currentStatus: CustomPrintingStatus;
};

export default function StatusDropdown({ requestId, currentStatus }: StatusDropdownProps) {
  const router = useRouter();
  const [status, setStatus] = useState<CustomPrintingStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onStatusChange(nextStatus: CustomPrintingStatus) {
    const previousStatus = status;
    setStatus(nextStatus);
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/custom-printing/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          status: nextStatus,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus(previousStatus);
        setErrorMessage(result.error ?? "Failed to update status.");
        return;
      }

      router.refresh();
    } catch {
      setStatus(previousStatus);
      setErrorMessage("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div>
      <label className="sr-only" htmlFor={`status-${requestId}`}>
        Update status
      </label>
      <select
        id={`status-${requestId}`}
        value={status}
        disabled={isUpdating}
        onChange={(event) => onStatusChange(event.target.value as CustomPrintingStatus)}
        className="rounded-full border border-neutral-700 bg-black px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-100 transition hover:border-neutral-500 focus:border-neutral-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
      >
        {CUSTOM_PRINTING_STATUS_FLOW.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {isUpdating ? <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">Updating...</p> : null}
      {errorMessage ? <p className="mt-2 text-xs text-red-300">{errorMessage}</p> : null}
    </div>
  );
}
