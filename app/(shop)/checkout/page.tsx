"use client";

import { useState } from "react";
import { useCart } from "../../context/cartcontext"

interface CheckoutResponse {
  url?: string;
  error?: string;
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const cartItems = cart;
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (isSubmitting) {
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    setCheckoutError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
        }),
      });

      const data = (await res.json()) as CheckoutResponse;

      if (!res.ok) {
        throw new Error(data.error || "Unable to start Stripe checkout.");
      }

      if (!data.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.assign(data.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start Stripe checkout.";
      setCheckoutError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-8 pb-20 pt-32 text-white lg:pb-28 lg:pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="max-w-2xl">
            <h1 className="mb-12 text-5xl font-serif leading-[0.95] lg:text-6xl">
            Checkout
            </h1>

            <div className="space-y-6">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 border rounded-2xl"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 border rounded-2xl"
            />

            <input
              type="text"
              placeholder="Street Address"
              className="w-full p-4 border rounded-2xl"
            />

            <input
              type="text"
              placeholder="City"
              className="w-full p-4 border rounded-2xl"
            />

            <input
              type="text"
              placeholder="Postal Code"
              className="w-full p-4 border rounded-2xl"
            />

              {checkoutError ? (
                <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {checkoutError}
                </p>
              ) : null}

              <button
                onClick={handleCheckout}
                disabled={isSubmitting || cartItems.length === 0}
                className="mt-10 w-full rounded-full bg-white py-5 text-black uppercase tracking-[0.2em] transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Redirecting..." : "Continue to Payment"}
              </button>

            </div>
          </div>

          <div className="h-fit self-start rounded-xl border border-neutral-300 p-8 lg:sticky lg:top-40 lg:p-10">

            <h2 className="mb-8 text-3xl font-serif">
              Order Summary
            </h2>

            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-neutral-200 py-3"
              >
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.size} × {item.quantity}
                  </p>
                </div>

                <p>
                  CAD ${item.price * item.quantity}
                </p>
              </div>
            ))}

            <div className="mt-10 flex justify-between text-xl font-semibold">
              <span>Total</span>
              <span>CAD ${total}</span>
            </div>

          </div>
      </div>
      </div>
    </main>
  );
}