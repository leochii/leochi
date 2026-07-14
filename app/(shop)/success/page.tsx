"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/cartcontext";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    clearCart();

    if (typeof window !== "undefined") {
      const value = new URLSearchParams(window.location.search).get("session_id");
      setSessionId(value);
    }
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-16 px-6 md:px-10">
      <div className="max-w-4xl mx-auto border border-neutral-800 bg-neutral-950/70 rounded-2xl overflow-hidden">
        <div className="px-7 py-8 md:px-10 md:py-10 border-b border-neutral-800 bg-gradient-to-br from-neutral-950 to-black">
          <p className="uppercase tracking-[0.28em] text-[11px] text-neutral-500 mb-4">LEOCHI</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-4">Order Confirmed</h1>
          <p className="text-neutral-300 max-w-2xl">
            Payment was successful and your order is now in our fulfillment queue.
            You will receive shipping updates by email as soon as your package is dispatched.
          </p>
        </div>

        <div id="order" className="px-7 py-8 md:px-10 md:py-10 space-y-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-black border border-neutral-800 rounded-xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Status</p>
              <p className="text-xl font-semibold">Confirmed</p>
            </div>
            <div className="bg-black border border-neutral-800 rounded-xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Order Reference</p>
              <p className="text-sm md:text-base break-all text-neutral-200">{sessionId ?? "Available in confirmation email"}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-full font-semibold uppercase tracking-[0.16em] text-xs"
            >
              Continue Shopping
            </Link>
            <Link
              href={sessionId ? `/success?session_id=${encodeURIComponent(sessionId)}#order` : "/success#order"}
              className="inline-flex items-center justify-center border border-neutral-700 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-[0.16em] text-xs"
            >
              View Order
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}