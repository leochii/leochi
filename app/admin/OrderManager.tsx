"use client";

import { useState } from "react";

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
    setLoading(true);

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

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      alert("Order updated successfully!");
    } else {
      alert(data.error || "Something went wrong.");
    }
  }

  return (
    <div className="mt-10 border border-neutral-800 rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-semibold">
        Manage Order
      </h2>

      <div>
        <label>Order Status</label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mt-2 bg-neutral-900 border border-neutral-700 rounded-lg p-3"
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
        <label>Tracking Number</label>

        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="w-full mt-2 bg-neutral-900 border border-neutral-700 rounded-lg p-3"
        />
      </div>

      <div>
        <label>Carrier</label>

        <select
          value={shippingCarrier}
          onChange={(e) => setShippingCarrier(e.target.value)}
          className="w-full mt-2 bg-neutral-900 border border-neutral-700 rounded-lg p-3"
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
        className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}