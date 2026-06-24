"use client";

import Image from "next/image";
import { useCart } from "../../../context/cartcontext";

export default function Leochi() {
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-[#fbf7f1] px-10 py-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">

        <Image
          src="/Leochi.PNG"
          alt="Leochi"
          width={600}
          height={600}
          className="rounded-3xl"
        />

        <div>
          <h1 className="text-5xl font-serif mb-6">
            Leochi
          </h1>

          <p className="text-gray-500 text-xl">
            Premium Streetwear Collection
          </p>

          <p className="text-3xl mt-8">
            $50 CAD
          </p>
          

          <button
            onClick={() =>
              addToCart({
                name: "Leochi",
                price: 50,
                image: "/Leochi.PNG",
              })
            }
            className="mt-10 bg-black text-white px-8 py-4 rounded-full"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </main>
  );
}