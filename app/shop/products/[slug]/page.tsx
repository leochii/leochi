"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { products } from "../../../data/products";
import { useCart } from "../../../context/cartcontext";

export default function ProductPage() {
  const params = useParams<{ slug?: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const product = products.find((p) => p.slug === slug) as any;
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setSelectedSize("");
    }
  }, [product]);

  if (!product) notFound();

  return (
    <main className="bg-black text-white min-h-screen">

      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="grid lg:grid-cols-[2fr_0.7fr] gap-10">
          {/* LEFT */}

          <div>

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full rounded-lg scale-[1.04]"
            />

            <div className="grid grid-cols-3 gap-4 mt-6">

              {product.images.map((image: string, index: number) => (

                <img
  key={index}
  src={image}
  onClick={() => setSelectedImage(image)}
  className={`rounded-lg cursor-pointer transition
  ${selectedImage === image ? "ring-2 ring-white" : "hover:opacity-70"}`}
/>

              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div className="sticky top-36 self-start">

            <p className="uppercase tracking-[0.35em] text-neutral-500 text-xs">
              LEOCHI
            </p>

            <h1 className="font-serif text-6xl mt-3">
              {product.name}
            </h1>

            <p className="text-3xl mt-8">
              CAD ${product.price}
            </p>

            <div className="mt-10 space-y-2 text-neutral-400">

              <p>{product.category}</p>

            </div>

            {product.description && (
              <p className="mt-12 text-neutral-300 leading-8">
                {product.description}
              </p>
            )}

            <div className="mt-14">
  <p className="uppercase tracking-[0.3em] text-xs text-neutral-500 mb-5">
    Size
  </p>

  <div className="flex gap-3">
    {["S", "M", "L", "XL"].map((size) => (
      <button
        key={size}
        onClick={() => setSelectedSize(size)}
        className={`w-14 h-14 flex items-center justify-center border transition duration-300
          ${
            selectedSize === size
              ? "bg-white text-black border-white"
              : "border-neutral-600 text-white hover:border-white hover:bg-white hover:text-black"
          }`}
      >
        {size}
      </button>
    ))}
  </div>
</div>

<button
  onClick={() => {
  console.log("CLICK");
  console.log(selectedSize);

  addToCart({
    name: product.name,
    price: product.price,
    image: selectedImage,
    size: selectedSize || "S",
    quantity: 1,
  });
}}
  className="mt-10 w-full border border-white py-5 tracking-[0.25em] uppercase transition-all duration-300 hover:bg-white hover:text-black"
>
  Add to Cart
</button>

          </div>

        </div>

      </div>

    </main>
  );
}