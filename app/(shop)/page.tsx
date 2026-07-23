"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.getAttribute("data-card-key");
          if (!key) {
            return;
          }

          if (entry.isIntersecting) {
            setVisibleCards((prev) => ({ ...prev, [key]: true }));
          }
        });
      },
      { threshold: 0.22 }
    );

    Object.values(cardRefs.current).forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  const mobileCollections = [
    {
      season: "SEASON 01",
      title: "Summer Collection",
      image: "/summer.jpg",
      href: "/shop/collections/summer",
      key: "summer",
      available: true,
    },
    {
      season: "SEASON 02",
      title: "Fall Collection",
      image: "/fall.jpg",
      key: "fall",
      available: false,
    },
    {
      season: "SEASON 03",
      title: "Winter Collection",
      image: "/winter.jpg",
      key: "winter",
      available: false,
    },
    {
      season: "SEASON 04",
      title: "Spring Collection",
      image: "/spring.jpg",
      key: "spring",
      available: false,
    },
  ] as const;

  return (
    <main className="bg-[#0a0a0a]">
      <section className="md:hidden">
        <div className="relative flex min-h-screen items-end overflow-hidden px-6 pb-14 pt-32">
          <Image
            src="/hero-leochi.jpg"
            alt="LEOCHI hero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.12)_0%,rgba(10,10,10,0.36)_46%,rgba(10,10,10,0.82)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(226,171,118,0.18)_0%,rgba(226,171,118,0)_42%)]" />

          <div className="relative z-10 max-w-[18rem] text-white">
            <h1
              className="font-serif text-[2.2rem] leading-[1.08]"
              style={{ fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif' }}
            >
              <span className="block">Inspired by Persian Seasons.</span>
              <span className="block">Made to Last.</span>
            </h1>

            <Link
              href="/shop"
              className="mt-8 inline-flex h-12 items-center border border-white/70 px-6 text-[11px] uppercase tracking-[0.24em] text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-white hover:text-black"
            >
              Explore Collections -&gt;
            </Link>
          </div>
        </div>

        <div className="px-6 pb-16 pt-8">
          <div className="space-y-6">
            {mobileCollections.map((collection) => {
              const card = (
                <div
                  ref={(node) => {
                    cardRefs.current[collection.key] = node;
                  }}
                  data-card-key={collection.key}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black transition-all duration-700 ease-out ${
                    visibleCards[collection.key] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  <div className="relative h-[440px] overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      loading="lazy"
                      sizes="100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_52%,rgba(0,0,0,0.5)_100%)]" />

                    <div className="absolute left-5 top-5 z-10">
                      <p className="text-[10px] uppercase tracking-[0.32em] text-white/75">{collection.season}</p>
                      <h2 className="mt-2 font-serif text-3xl text-white">{collection.title}</h2>
                    </div>

                    <div className="absolute bottom-5 left-5 z-10">
                      <span className="inline-flex h-10 items-center border border-white/70 px-5 text-[10px] uppercase tracking-[0.28em] text-white transition-all duration-500 group-hover:bg-white group-hover:text-black">
                        Explore -&gt;
                      </span>
                    </div>
                  </div>
                </div>
              );

              if (collection.available && collection.href) {
                return (
                  <Link key={collection.key} href={collection.href} className="block">
                    {card}
                  </Link>
                );
              }

              return <div key={collection.key}>{card}</div>;
            })}
          </div>
        </div>
      </section>

      <section className="hero relative hidden min-h-screen overflow-hidden bg-black md:block">
        <div
          className="hero-image absolute inset-0"
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

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,10,0.22)_0%,rgba(8,8,10,0.16)_42%,rgba(8,8,10,0.06)_68%,rgba(8,8,10,0.12)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_34%,rgba(230,176,120,0.18)_0%,rgba(230,176,120,0)_42%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/80 md:h-32" />

        <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-start px-6 sm:px-8 md:px-14 lg:px-20">
          <div className="max-w-xl md:max-w-2xl text-left text-white md:-translate-x-2 lg:-translate-x-3">
            <h1
              className="text-[clamp(1.45rem,1.8vw,2.7rem)] leading-[1.08]"
              style={{
                fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif',
                letterSpacing: "0.1em",
              }}
            >
              <span className="block">PREMIUM STREETWEAR</span>
              <span className="block md:hidden">INSPIRED BY</span>
              <span className="block md:hidden">PERSIAN CULTURE</span>
              <span className="hidden md:block">INSPIRED BY PERSIAN CULTURE</span>
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