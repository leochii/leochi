"use client";

import { useCart } from "../../context/cartcontext"
export default function CheckoutPage() {
  const { cart } = useCart();

const cartItems = cart;
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const handleCheckout = async () => {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartItems,
    }),
  });

  const data = await res.json();

window.location.href = data.url
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

            <button
  onClick={handleCheckout}
  className="w-full mt-8 bg-white text-black py-5 rounded-full uppercase tracking-[0.2em] hover:bg-neutral-200 transition"
>
  Continue to Payment
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