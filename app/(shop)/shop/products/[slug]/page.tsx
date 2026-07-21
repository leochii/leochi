"use client";

import Image from "next/image";
import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Product, products } from "../../../../data/products";
import { useCart } from "../../../../context/cartcontext";

function ProductDetails({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState<"White" | "Black">("White");
  const selectedVariant = product.variants.find((variant) => variant.color === selectedColor) ?? product.variants[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = selectedVariant.images[selectedImageIndex] ?? selectedVariant.images[0];
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();


  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-[2fr_0.7fr] gap-10">
          <div>
            <Image
              src={selectedImage}
              alt={product.name}
              width={1200}
              height={1500}
              className="w-full rounded-lg scale-[1.04]"
            />

            <div className="grid grid-cols-3 gap-4 mt-6">
              {selectedVariant.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                    onClick={() => setSelectedImageIndex(index)}
                  className={`overflow-hidden rounded-lg transition ${selectedImage === image ? "ring-2 ring-white" : "hover:opacity-70"}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={400}
                    height={500}
                    className="h-auto w-full"
                  />
                </button>
              ))}
            </div>
          </div>

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
              {product.category ? <p>{product.category}</p> : null}
            </div>

            <div className="mt-10">
              <p className="uppercase tracking-[0.3em] text-xs text-neutral-500 mb-5">
                Color
              </p>

              <div className="flex gap-3">
                {["White", "Black"].map((color) => (
                  <button
                    key={color}
                    type="button"
                      onClick={() => {
                        setSelectedColor(color as "White" | "Black");
                        setSelectedImageIndex(0);
                      }}
                    className={`min-w-[92px] h-12 px-4 border text-xs uppercase tracking-[0.2em] transition duration-300 ${
                      selectedColor === color
                        ? "bg-white text-black border-white"
                        : "border-neutral-600 text-white hover:border-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {product.description ? (
              <p className="mt-12 text-neutral-300 leading-8">
                {product.description}
              </p>
            ) : null}

            <div className="mt-14">
              <p className="uppercase tracking-[0.3em] text-xs text-neutral-500 mb-5">
                Size
              </p>

              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 flex items-center justify-center border transition duration-300 ${
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
              type="button"
              onClick={() => {
                addToCart({
                  name: `${product.name} (${selectedColor})`,
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

export default function ProductPage() {
  const params = useParams<{ slug?: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const product = products.find((item) => item.slug === slug);

  if (!product || product.variants.length === 0 || product.variants[0].images.length === 0) {
    notFound();
  }

  return <ProductDetails key={product.slug} product={product} />;
}