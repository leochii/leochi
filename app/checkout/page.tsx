"use client";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#fbf7f1] p-10">
      <div className="max-w-2xl mx-auto">

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

          <button className="w-full bg-black text-white py-4 rounded-full">
            Continue to Payment
          </button>

        </div>

      </div>
    </main>
  );
}