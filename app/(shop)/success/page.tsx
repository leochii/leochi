"use client";

import { useEffect } from "react";
import { useCart } from "../../context/cartcontext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-serif mb-6">
          Payment Successful 
        </h1>

        <p className="text-neutral-400">
          Thank you for your purchase.
        </p>
      </div>
    </main>
  );
}