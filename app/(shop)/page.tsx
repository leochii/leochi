"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-black">
      <section className="hero relative min-h-screen overflow-hidden bg-black">
        <div
          className="hero-image absolute inset-0 hidden md:block"
          style={{
            backgroundImage: "url('/hero-leochi.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "92%",
            backgroundPosition: "center 40%",
            transform: "scale(1.08)",
            transformOrigin: "center center",
            overflow: "hidden",
          }}
        />

        <div
          className="hero-image absolute inset-0 md:hidden"
          style={{
            backgroundImage: "url('/hero-leochi.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            overflow: "hidden",
          }}
        />

        <div className="absolute inset-0 hidden md:block bg-[linear-gradient(90deg,rgba(8,8,10,0.22)_0%,rgba(8,8,10,0.16)_42%,rgba(8,8,10,0.06)_68%,rgba(8,8,10,0.12)_100%)]" />
        <div className="absolute inset-0 hidden md:block bg-[radial-gradient(circle_at_74%_34%,rgba(230,176,120,0.18)_0%,rgba(230,176,120,0)_42%)]" />

        <div className="absolute inset-0 md:hidden bg-[linear-gradient(180deg,rgba(8,8,10,0.12)_0%,rgba(8,8,10,0.06)_28%,rgba(8,8,10,0.14)_100%)]" />
        <div className="absolute inset-0 md:hidden bg-[radial-gradient(circle_at_72%_26%,rgba(230,176,120,0.14)_0%,rgba(230,176,120,0)_36%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/80 md:h-32" />

        <div className="relative z-10 flex h-full items-start md:items-center px-6 sm:px-8 md:px-14 lg:px-20 pt-0">
          <div className="max-w-xl md:max-w-2xl text-left text-white md:-translate-x-2 lg:-translate-x-3">
            <h1
              className="hidden md:block text-[clamp(1.45rem,1.8vw,2.7rem)] leading-[1.08]"
              style={{
                fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif',
                letterSpacing: "0.1em",
              }}
            >
              PREMIUM STREETWEAR
              <br />
              INSPIRED BY PERSIAN CULTURE
            </h1>

            <h1
              className="md:hidden text-[clamp(1.25rem,5.4vw,2rem)] leading-[1.04]"
              style={{
                fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif',
                letterSpacing: "0.08em",
              }}
            >
              PREMIUM STREETWEAR
              <br />
              INSPIRED BY
              <br />
              PERSIAN CULTURE
            </h1>

            <p
              className="mt-5 md:mt-8 max-w-[17rem] md:max-w-none text-[8px] sm:text-[9px] md:text-[10px] uppercase leading-[1.85] text-white/85"
              style={{ letterSpacing: "0.26em" }}
            >
              TIMELESS DESIGNS.
              <br />
              MODERN CRAFTSMANSHIP.
            </p>

            <Link
              href="/shop"
              className="mt-8 md:mt-12 inline-flex items-center justify-center border border-white/90 px-7 py-3 text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase text-white transition hover:bg-white hover:text-black sm:px-9 sm:py-3.5"
              style={{ letterSpacing: "0.22em" }}
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