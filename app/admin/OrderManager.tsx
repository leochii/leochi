"use client";

import { useState } from "react";
import { showToast } from "../components/Toast";

type Props = {
  id: string;
  order_status?: string;
  tracking_number?: string;
  carrier?: string;
};

export default function OrderManager({
  id,
  order_status = "paid",
  tracking_number = "",
  carrier = "Canada Post",
}: Props) {
  const [status, setStatus] = useState(order_status);
  const [tracking, setTracking] = useState(tracking_number);
  const [shippingCarrier, setShippingCarrier] = useState(carrier);
  const [loading, setLoading] = useState(false);

  async function saveChanges() {
    if (!id) {
      showToast("Error: Order ID is missing", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          order_status: status,
          tracking_number: tracking,
          carrier: shippingCarrier,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        showToast("Order updated successfully!", "success");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        showToast(data.error || "Something went wrong.", "error");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      showToast(`Error: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 border border-neutral-800 rounded-xl p-6 space-y-4 bg-neutral-950">
      <h2 className="text-2xl font-semibold">
        Manage Order
      </h2>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Order Status</label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-white focus:outline-none transition"
        >
          <option>pending</option>
          <option>paid</option>
          <option>processing</option>
          <option>shipped</option>
          <option>delivered</option>
          <option>cancelled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Tracking Number</label>

        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          disabled={loading}
          placeholder="Enter tracking number (optional)"
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed focus:border-white focus:outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">Carrier</label>

        <select
          value={shippingCarrier}
          onChange={(e) => setShippingCarrier(e.target.value)}
          disabled={loading}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-white focus:outline-none transition"
        >
          <option>Canada Post</option>
          <option>UPS</option>
          <option>FedEx</option>
          <option>DHL</option>
          <option>Purolator</option>
        </select>
      </div>

      <button
        onClick={saveChanges}
        disabled={loading}
        className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-200 disabled:bg-neutral-600 disabled:cursor-not-allowed disabled:text-neutral-400 transition flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}