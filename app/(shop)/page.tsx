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
          style={{ objectPosition: "right center", objectFit: "contain" }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,10,0.58)_0%,rgba(8,8,10,0.34)_34%,rgba(8,8,10,0.12)_62%,rgba(8,8,10,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(230,176,120,0.16)_0%,rgba(230,176,120,0)_44%)]" />

        <div className="relative z-10 flex h-full items-center px-7 sm:px-10 md:px-14 lg:px-20">
          <div className="max-w-2xl pt-14 text-left text-white md:pt-20">
            <h1
              className="text-2xl leading-[1.1] sm:text-3xl md:text-4xl lg:text-5xl"
              style={{
                fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif',
                letterSpacing: "0.1em",
              }}
            >
              PREMIUM STREETWEAR
              <br />
              INSPIRED BY PERSIAN CULTURE
            </h1>

            <p
              className="mt-8 text-[10px] uppercase leading-[1.9] text-white/85 sm:text-xs md:text-sm"
              style={{ letterSpacing: "0.28em" }}
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
      </section>
    </main>
  );
}