"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden bg-black">

      <section className="relative h-screen">

        {/* Images */}
        <div className="absolute inset-0 grid grid-cols-2">

          <div className="group relative overflow-hidden">
            <Image
              src="/Sky.PNG"
              alt="Sky Tee"
              fill
              priority
              className="object-cover scale-125"
            />

            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition duration-700" />
          </div>

          <div className="group relative overflow-hidden">
            <Image
              src="/PersianRug.PNG"
              alt="Persian Rug Tee"
              fill
              priority
              className="object-cover scale-125"
            />

            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition duration-700" />
          </div>

        </div>

        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">

          <h1 className="font-serif text-8xl tracking-wide">
            LEOCHI
          </h1>

          <p className="mt-6 text-xs tracking-[0.45em] uppercase opacity-80">
            EST. 2026
          </p>

          <Link
            href="/shop"
            className="mt-10 border border-white px-10 py-4 uppercase tracking-[0.25em] text-sm transition hover:bg-white hover:text-black"
          >
            Shop Collection
          </Link>

        </div>

      </section>

    </main>
  );
}