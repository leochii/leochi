"use client";

import Navbar from "../components/navbar";
import { useCart } from "../context/cartcontext";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <Navbar />

      <main className="bg-black text-white min-h-screen pt-28">

        <div className="max-w-6xl mx-auto px-8">

          <h1 className="font-serif text-5xl">
            Cart
          </h1>

          <p className="text-neutral-500 mt-2">
            {cart.length} Item{cart.length !== 1 ? "s" : ""}
          </p>

          <div className="mt-16">

            {cart.map((item, index) => (

              <div
                key={index}
                className="border-b border-neutral-800 py-10 flex justify-between items-start"
              >

                <div className="flex gap-8">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-36 h-44 object-cover rounded-lg"
                  />

                  <div>

                    <h2 className="font-serif text-3xl">
                      {item.name}
                    </h2>

                    <p className="text-neutral-500 mt-3">
                      Premium Heavyweight Cotton
                    </p>

                    <p className="text-neutral-500">
                      Oversized Fit
                    </p>

                    <p className="mt-8 text-xl">
                      CAD ${item.price}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  className="text-neutral-500 hover:text-white transition"
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

          <div className="mt-16 max-w-md ml-auto">

            <div className="flex justify-between text-lg">

              <span>Subtotal</span>

              <span>CAD ${total}</span>

            </div>

            <div className="flex justify-between text-neutral-500 mt-4">

              <span>Shipping</span>

              <span>Calculated at checkout</span>

            </div>

            <button className="mt-10 w-full bg-white text-black py-5 uppercase tracking-[0.3em] hover:bg-neutral-200 transition">

              Checkout

            </button>

          </div>

        </div>

      </main>

    </>
  );
}