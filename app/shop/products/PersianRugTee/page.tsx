"use client";

import Image from "next/image";
import { useCart } from "../../../context/cartcontext";

export default function PersianRug() {
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-[#fbf7f1] px-10 py-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">

        <Image
          src="/PersianRug.PNG"
          alt="PersianRugTee"
          width={500}
          height={500}
          className="rounded-3xl"
        />

        <div>
          <h1 className="text-5xl font-serif mb-6">
            PersianRugTee
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
      name: "Persian Rug Tee",
      price: 60,
      image: "/PersianRug.PNG",
    })
  }
  className="bg-black text-white px-6 py-3 rounded-full mt-8"
>
  Add to Cart
</button>
        </div>

      </div>
    </main>
  );
}