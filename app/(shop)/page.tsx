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
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_24%,rgba(0,0,0,0.55)_100%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white pt-8">
          <h1
            className="text-6xl leading-none sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif',
              letterSpacing: "0.16em",
            }}
          >
            LEOCHI
          </h1>

          <p
            className="mt-7 max-w-2xl text-sm uppercase leading-relaxed sm:text-base md:text-lg"
            style={{ letterSpacing: "0.2em" }}
          >
            Premium Streetwear Inspired by Persian Culture
          </p>

          <Link
            href="/shop"
            className="mt-12 inline-flex items-center justify-center border border-white px-8 py-3 text-xs font-semibold uppercase transition hover:bg-white hover:text-black sm:px-10 sm:py-4 sm:text-sm"
            style={{ letterSpacing: "0.22em" }}
          >
            Shop Collection
          </Link>
        </div>
      </section>
    </main>
  );
}