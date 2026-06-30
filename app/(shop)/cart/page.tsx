"use client";

import Navbar from "../components/navbar";
import { useCart } from "../context/cartcontext";

export default function CartPage() {
  const {
  cart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = useCart();
  const total = cart.reduce(
  (sum, item) => sum + item.price * (item.quantity || 1),
  0
);

  return (
    <>
      <Navbar />

      <main className="bg-black text-white min-h-screen pt-28">
        <div className="max-w-7xl mx-auto px-8">

          <h1 className="font-serif text-5xl">
            Cart
          </h1>

          <p className="text-neutral-500 mt-2">
            {cart.length} Item{cart.length !== 1 ? "s" : ""}
          </p>

          <div className="mt-16 grid lg:grid-cols-[1fr_380px] gap-20">

            {/* LEFT */}

            <div>

              {cart.map((item, index) => (

                <div
                  key={index}
                  className="border-b border-neutral-800 py-10 flex justify-between items-center"
                >

                  <div className="flex gap-8 items-center">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-40 h-52 object-cover"
                    />

                    <div>

                      <h2 className="font-serif text-4xl">
                        {item.name}
                      </h2>

                      <p className="text-neutral-500 mt-3">
                        Premium Heavyweight Cotton
                      </p>

                      <p className="text-neutral-500 mt-2">
                        Oversized Fit
                      </p>

                      <p className="text-neutral-500 mt-2">
                        Size: {item.size}
                      </p>

                      <div className="mt-6">
  <div className="flex items-center gap-4">

  <button
    onClick={() => decreaseQuantity(index)}
    className="w-10 h-10 border border-neutral-700 hover:border-white transition"
  >
    −
  </button>

  <span className="w-6 text-center text-lg">
    {item.quantity}
  </span>

  <button
    onClick={() => increaseQuantity(index)}
    className="w-10 h-10 border border-neutral-700 hover:border-white transition"
  >
    +
  </button>

</div>
                      </div>

                      <p className="text-2xl mt-6">
                        CAD ${item.price}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="border border-neutral-700 px-6 py-3 hover:border-white transition"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            {/* RIGHT */}

            <div className="sticky top-28 h-fit border border-neutral-800 p-8">

              <h2 className="font-serif text-3xl mb-10">
                Summary
              </h2>

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span>CAD ${total}</span>

              </div>

              <div className="flex justify-between text-neutral-500 mt-5">

                <span>Shipping</span>

                <span>Calculated at checkout</span>

              </div>

              <div className="border-t border-neutral-800 mt-8 pt-8 flex justify-between text-xl">

                <span>Total</span>

                <span>CAD ${total}</span>

              </div>

              <button
  onClick={() => {
    window.location.href = "/checkout";
  }}
  className="mt-10 w-full bg-white text-black py-5 uppercase tracking-[0.25em] hover:bg-neutral-200 transition"
>
  Checkout
</button>

            </div>

          </div>

        </div>
      </main>
    </>
  );
}