import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#fbf7f1]">

      {/* HERO */}

      <section className="h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">

        <div className="absolute opacity-5">
          <Image
            src="/logo.PNG"
            alt="LEOCHI"
            width={600}
            height={600}
          />
        </div>

        <h1 className="text-7xl md:text-8xl font-serif tracking-wide z-10">
          LEOCHI
        </h1>

        <p className="mt-6 text-gray-600 text-lg tracking-[0.2em] uppercase z-10">
          Persian Heritage Reimagined
        </p>

        <p className="mt-3 text-gray-500 z-10">
          EST. 2019
        </p>

      </section>

      {/* BRAND STATEMENT */}

      <section className="max-w-3xl mx-auto px-8 py-32 text-center">

        <h2 className="text-4xl font-serif mb-8">
          Crafted With Meaning
        </h2>

        <p className="text-gray-600 leading-8 text-lg">
          Inspired by Persian heritage and shaped by modern culture,
          LEOCHI creates timeless garments that bridge tradition,
          craftsmanship, and contemporary streetwear.
        </p>

      </section>

      {/* COLLECTION */}

      <section className="max-w-7xl mx-auto px-8 pb-32">

        <h2 className="text-center text-4xl font-serif mb-16">
          Collection
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <Link href="/shop/products/SkyTee">
            <Image
              src="/Sky.PNG"
              alt="Sky"
              width={500}
              height={500}
              className="w-full hover:opacity-90 transition"
            />
          </Link>

          <Link href="/shop/products/PersianRugTee">
            <Image
              src="/PersianRug.PNG"
              alt="Persian Rug"
              width={500}
              height={500}
              className="w-full hover:opacity-90 transition"
            />
          </Link>

          <Link href="/shop/products/Leochi">
            <Image
              src="/Leochi.PNG"
              alt="Leochi"
              width={500}
              height={500}
              className="w-full hover:opacity-90 transition"
            />
          </Link>

        </div>

      </section>

    </main>
  );
}