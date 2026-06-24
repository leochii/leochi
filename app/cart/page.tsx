"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/cartcontext";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="min-h-screen bg-[#fbf7f1] p-10">
      <h1 className="text-5xl font-serif mb-10">Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-8">
          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-6"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={120}
                height={120}
                className="rounded-2xl"
              />

              <div className="flex-1">
                <h2 className="text-2xl">{item.name}</h2>
                <p className="text-xl mt-2">${item.price} CAD</p>
              </div>

              <button
                onClick={() => removeFromCart(index)}
                className="bg-black text-white px-6 py-3 rounded-full"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-12 border-t pt-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif">
            Total: ${total} CAD
          </h2>
        </div>

        <Link href="/checkout">
          <button className="bg-black text-white px-8 py-4 rounded-full">
            Checkout
          </button>
        </Link>
      </div>
    </main>
  );
}