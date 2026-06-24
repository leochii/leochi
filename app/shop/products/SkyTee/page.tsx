"use client";

import Image from "next/image";
import { useCart } from "../../../context/cartcontext";

export default function SkyTee() {
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-[#fbf7f1] px-10 py-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">

        <Image
          src="/Sky.PNG"
          alt="Sky Tee"
          width={600}
          height={600}
          className="rounded-3xl"
        />

        <div>
          <h1 className="text-5xl font-serif mb-6">
            Sky Tee
          </h1>

          <p className="text-gray-500 text-xl">
            Premium Streetwear Collection
          </p>

          <p className="text-3xl mt-8">
            $60 CAD
          </p>
        

          <button
            onClick={() =>
              addToCart({
                name: "Sky Tee",
                price: 60,
                image: "/Sky.PNG",
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