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
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-20">
        <div>
          <h1 className="text-5xl font-serif mb-10">
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
              className="mt-8 w-full rounded-full bg-white py-5 text-black uppercase tracking-[0.2em] transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Redirecting..." : "Continue to Payment"}
            </button>

          </div>
        </div>
        <div className="border border-neutral-300 p-8 h-fit rounded-xl">

  <h2 className="text-3xl font-serif mb-8">
    Order Summary
  </h2>

  {cartItems.map((item, index) => (
    <div
      key={index}
      className="flex justify-between py-3 border-b border-neutral-200"
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

  <div className="flex justify-between mt-8 text-xl font-semibold">
    <span>Total</span>
    <span>CAD ${total}</span>
  </div>

</div>
      </div>
    </main>
  );
}