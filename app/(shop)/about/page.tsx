"use client";

import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 pb-24 pt-28 text-[#f3ece2] md:px-10 md:pb-32 md:pt-36">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-[850px] items-center justify-center">
        <div className="w-full text-center">
          <div className="animate-fade-up">
            <p className="text-[10px] uppercase tracking-[0.42em] text-[#d2bea0]/70">
              ABOUT LEOCHI
            </p>

            <h1
              className="mt-6 text-[2.35rem] leading-[1.04] text-[#fff7ed] md:text-[4.35rem]"
              style={{ fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif' }}
            >
              Every Persian Rug Begins With a Story.
            </h1>
          </div>

          <div className="animate-fade-up-delayed mx-auto mt-10 max-w-[820px] space-y-8 text-[1rem] leading-8 text-[#e6ddd1]/88 md:mt-12 md:text-[1.08rem] md:leading-9">
            <p>
              For centuries, Persian artisans have woven more than patterns into their carpets. They have woven memories, love, poetry, nature, and generations of craftsmanship into every detail. Every color carries emotion. Every motif holds meaning. Every thread reflects patience and beauty.
            </p>

            <p>
              LEOCHI was born from that same philosophy.
            </p>

            <p>
              We believe a garment can carry culture just as a Persian rug does. Instead of hanging these timeless works of art on walls or placing them beneath our feet, we bring their beauty into everyday life allowing people to wear a piece of Persian heritage wherever they go.
            </p>

            <p>
              Our collections are inspired by the changing seasons, the richness of Persian craftsmanship, and the stories hidden within traditional carpet designs. From the warmth of Summer to the quiet elegance of Winter, every piece is created to evoke a feeling rather than simply display a pattern.
            </p>

            <p>
              LEOCHI is not about fashion alone.
            </p>

            <p>
              It is about preserving beauty.
              <br />
              Sharing culture.
              <br />
              Creating conversation.
              <br />
              And reminding the world that art is something we can live in not just admire.
            </p>

            <p>
              When you wear LEOCHI, you wear more than a design.
            </p>

            <p>
              You wear history.
              <br />
              You wear craftsmanship.
              <br />
              You wear a story.
            </p>
          </div>

          <div className="animate-fade-up-delayed-2 mx-auto mt-14 h-px w-24 bg-white/18 md:mt-16" />

          <div className="animate-fade-up-delayed-3 mt-10 md:mt-12">
            <p
              className="mx-auto max-w-[560px] text-[1.6rem] italic leading-[1.35] text-[#fff7ed] md:text-[2.2rem]"
              style={{ fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif' }}
            >
              &ldquo;Art is not only something to admire.
              <br />
              It is something to wear.&rdquo;
            </p>

            <Link
              href="/shop"
              className="mt-10 inline-flex items-center justify-center border border-white/16 px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-[#f3ece2] transition-all duration-500 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white hover:text-black md:mt-12"
            >
              EXPLORE COLLECTIONS -&gt;
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .animate-fade-up,
        .animate-fade-up-delayed,
        .animate-fade-up-delayed-2,
        .animate-fade-up-delayed-3 {
          opacity: 0;
          transform: translateY(18px);
          animation: fadeUp 0.9s ease forwards;
        }

        .animate-fade-up-delayed {
          animation-delay: 0.14s;
        }

        .animate-fade-up-delayed-2 {
          animation-delay: 0.26s;
        }

        .animate-fade-up-delayed-3 {
          animation-delay: 0.38s;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}