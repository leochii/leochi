"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-black">
      <section className="relative h-screen min-h-[560px]">
        <Image
          src="/hero-leochi.jpg"
          alt="LEOCHI hero"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "right center", objectFit: "cover" }}
        />

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.5)_35%,rgba(0,0,0,0.2)_65%,rgba(0,0,0,0.45)_100%)]" />

        <div className="relative z-10 flex h-full items-center px-7 sm:px-10 md:px-14 lg:px-20">
          <div className="max-w-2xl pt-14 text-left text-white md:pt-20">
            <h1
              className="text-3xl leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl"
              style={{
                fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif',
                letterSpacing: "0.08em",
              }}
            >
              PREMIUM STREETWEAR
              <br />
              INSPIRED BY PERSIAN CULTURE
            </h1>

            <p
              className="mt-8 text-[10px] uppercase leading-[1.85] text-white/85 sm:text-xs md:text-sm"
              style={{ letterSpacing: "0.26em" }}
            >
              TIMELESS DESIGNS.
              <br />
              MODERN CRAFTSMANSHIP.
            </p>

            <Link
              href="/shop"
              className="mt-12 inline-flex items-center justify-center border border-white/90 px-7 py-3 text-[10px] font-semibold uppercase text-white transition hover:bg-white hover:text-black sm:px-9 sm:py-3.5 sm:text-xs"
              style={{ letterSpacing: "0.24em" }}
            >
              SHOP COLLECTION
            </Link>
          </div>

          <div className="flex-1" />
        </div>

        <div className="pointer-events-none absolute inset-0 border border-white/10" />
      </section>
    </main>
  );
}