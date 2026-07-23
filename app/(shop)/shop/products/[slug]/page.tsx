"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { type UIEvent, useRef, useState } from "react";
import { Product, products } from "../../../../data/products";
import { useCart } from "../../../../context/cartcontext";

function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const availableVariants = product.variants.filter((variant) => variant.images.length > 0);
  const [selectedColor, setSelectedColor] = useState<"White" | "Black">(availableVariants[0]?.color ?? "White");
  const selectedVariant = availableVariants.find((variant) => variant.color === selectedColor) ?? availableVariants[0];
  const activeImages = selectedVariant?.images ?? [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = activeImages[selectedImageIndex] ?? activeImages[0];
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();
  const relatedProducts = products.filter((item) => item.slug !== product.slug).slice(0, 3);

  const addCurrentToCart = () => {
    addToCart({
      name: `${product.name} (${selectedColor})`,
      price: product.price,
      image: selectedImage,
      size: selectedSize || "S",
      quantity: 1,
    });
  };

  const selectColor = (color: "White" | "Black") => {
    setSelectedColor(color);
    setSelectedImageIndex(0);
    sliderRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const handleGalleryScroll = (event: UIEvent<HTMLDivElement>) => {
    const node = event.currentTarget;
    const nextIndex = Math.round(node.scrollLeft / Math.max(node.clientWidth, 1));
    if (nextIndex !== selectedImageIndex) {
      setSelectedImageIndex(nextIndex);
    }
  };

  const goToImage = (index: number) => {
    setSelectedImageIndex(index);
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    slider.scrollTo({
      left: slider.clientWidth * index,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="md:hidden">
        <div className="px-4 pb-16 pt-24">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
            <div
              ref={sliderRef}
              className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
              onScroll={handleGalleryScroll}
            >
              {activeImages.map((image, index) => (
                <div key={`${image}-${index}`} className="relative h-[62vh] min-w-full snap-center overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 py-4">
              {activeImages.map((image, index) => (
                <button
                  key={`${image}-dot-${index}`}
                  type="button"
                  onClick={() => goToImage(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${selectedImageIndex === index ? "w-6 bg-white" : "w-2 bg-white/35"}`}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 border border-white/10 bg-[#0a0a0a] p-5">
            <h1 className="font-serif text-[2.15rem] leading-[1.03] text-white">{product.name}</h1>
            <p className="mt-4 text-2xl text-white">CAD ${product.price}</p>

            <div className="mt-7">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">Color</p>
              <div className="mt-3 flex items-center gap-3">
                {availableVariants.map((variant) => (
                  <button
                    key={`mobile-${variant.color}`}
                    type="button"
                    onClick={() => selectColor(variant.color)}
                    className={`h-7 w-7 rounded-full transition-all duration-500 ${
                      variant.color === "White"
                        ? "bg-white ring-1 ring-white/45"
                        : "bg-black ring-1 ring-white/80"
                    } ${selectedColor === variant.color ? "scale-110 ring-2 ring-[#d8c2a3]" : "opacity-85"}`}
                    aria-label={`Select ${variant.color} color`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/60">Size</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={`mobile-size-${size}`}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 border text-sm transition-all duration-500 ${
                      selectedSize === size
                        ? "border-white bg-white text-black"
                        : "border-white/25 text-white hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={addCurrentToCart}
                className="flex h-12 w-full items-center justify-center border border-white bg-white text-[11px] uppercase tracking-[0.22em] text-black transition-all duration-500 hover:-translate-y-0.5"
              >
                Add To Cart
              </button>

              <button
                type="button"
                onClick={() => {
                  addCurrentToCart();
                  router.push("/checkout");
                }}
                className="flex h-12 w-full items-center justify-center border border-white/70 text-[11px] uppercase tracking-[0.22em] text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-white hover:text-black"
              >
                Buy It Now
              </button>
            </div>

            <div className="mt-9 divide-y divide-white/10 border-y border-white/10">
              <details className="py-4" open>
                <summary className="cursor-pointer list-none text-[11px] uppercase tracking-[0.24em] text-white">Details</summary>
                <p className="mt-3 text-sm leading-7 text-white/75">{product.description ?? "Crafted from premium cotton with a modern, oversized streetwear silhouette."}</p>
              </details>
              <details className="py-4">
                <summary className="cursor-pointer list-none text-[11px] uppercase tracking-[0.24em] text-white">Size Guide</summary>
                <p className="mt-3 text-sm leading-7 text-white/75">True to size fit. Size up for an oversized look.</p>
              </details>
              <details className="py-4">
                <summary className="cursor-pointer list-none text-[11px] uppercase tracking-[0.24em] text-white">Shipping</summary>
                <p className="mt-3 text-sm leading-7 text-white/75">Ships within 2-4 business days. International delivery available.</p>
              </details>
              <details className="py-4">
                <summary className="cursor-pointer list-none text-[11px] uppercase tracking-[0.24em] text-white">Care Instructions</summary>
                <p className="mt-3 text-sm leading-7 text-white/75">Machine wash cold, inside out. Hang dry to preserve print quality.</p>
              </details>
            </div>

            <div className="mt-9">
              <h2 className="font-serif text-2xl text-white">You May Also Like</h2>
              <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
                {relatedProducts.map((item) => (
                  <Link
                    key={`related-${item.slug}`}
                    href={`/shop/products/${item.slug}`}
                    className="min-w-[68%] snap-start overflow-hidden rounded-xl border border-white/10 bg-black"
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={item.variants[0].images[0]}
                        alt={item.name}
                        fill
                        sizes="70vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="px-4 py-4">
                      <p className="font-serif text-xl text-white">{item.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden md:block">
        <div className="mx-auto max-w-7xl px-8 py-16">
          <div className="grid gap-10 lg:grid-cols-[2fr_0.7fr]">
            <div>
              <Image
                src={selectedImage}
                alt={product.name}
                width={1200}
                height={1500}
                className="w-full rounded-lg scale-[1.04]"
              />

              <div className="mt-6 grid grid-cols-3 gap-4">
                {activeImages.map((image, index) => (
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
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">LEOCHI</p>

              <h1 className="mt-3 font-serif text-6xl">{product.name}</h1>

              <p className="mt-8 text-3xl">CAD ${product.price}</p>

              <div className="mt-10 space-y-2 text-neutral-400">
                {product.category ? <p>{product.category}</p> : null}
              </div>

              <div className="mt-10">
                <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">Color</p>

                <div className="flex gap-3">
                  {availableVariants.map((variant) => (
                    <button
                      key={variant.color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(variant.color);
                        setSelectedImageIndex(0);
                      }}
                      className={`h-12 min-w-[92px] border px-4 text-xs uppercase tracking-[0.2em] transition duration-300 ${
                        selectedColor === variant.color
                          ? "border-white bg-white text-black"
                          : "border-neutral-600 text-white hover:border-white hover:bg-white hover:text-black"
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>

              {product.description ? <p className="mt-12 leading-8 text-neutral-300">{product.description}</p> : null}

              <div className="mt-14">
                <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">Size</p>

                <div className="flex gap-3">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-14 w-14 items-center justify-center border transition duration-300 ${
                        selectedSize === size
                          ? "border-white bg-white text-black"
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
                onClick={addCurrentToCart}
                className="mt-10 w-full border border-white py-5 uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white hover:text-black"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductPage() {
  const params = useParams<{ slug?: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const product = products.find((item) => item.slug === slug);
  const hasImages = !!product && product.variants.some((variant) => variant.images.length > 0);

  if (!product || !hasImages) {
    notFound();
  }

  return <ProductDetails key={product.slug} product={product} />;
}
