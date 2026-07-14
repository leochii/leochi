import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-16 px-6 md:px-10">
      <div className="max-w-3xl mx-auto border border-neutral-800 rounded-2xl bg-neutral-950/70 px-7 py-9 md:px-10 md:py-12">
        <p className="uppercase tracking-[0.28em] text-[11px] text-neutral-500 mb-4">LEOCHI</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Checkout Canceled</h1>
        <p className="text-neutral-300 mb-8">
          No payment was captured. Your cart is still available if you want to review your order and try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-full font-semibold uppercase tracking-[0.16em] text-xs"
          >
            Return to Cart
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-neutral-700 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-[0.16em] text-xs"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </main>
  );
}
