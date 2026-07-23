import Image from "next/image";
import Link from "next/link";

const items = [
  {
    name: "Shahnameh Tee",
    href: "/shop/products/shahnameh",
    image: "/Shahnameh-front-white-male.jpg",
    variants: ["White", "Black"] as const,
  },
  {
    name: "Shiraz Tee",
    href: "/shop/products/shiraz",
    image: "/Shiraz-black-male-cafe-front.jpg",
    variants: ["White", "Black"] as const,
  },
  {
    name: "Isfahan Tee",
    href: "/shop/products/isfahan",
    image: "/Isfahan-white-front-male-street.jpg",
    variants: ["White"] as const,
  },
];

export default function SummerCollectionPage() {
  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-28 text-white md:px-12 md:pt-32 lg:px-16">
      <section className="mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.34em] text-white/55">SEASON 01</p>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl">Summer Collection</h1>
        <p className="mt-4 text-white/70">3 ITEMS • Summer 2026</p>

        <div className="mt-10 space-y-6 md:hidden">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]"
            >
              <div className="relative h-[420px] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/28" />
              </div>

              <div className="space-y-4 px-5 py-5">
                <h2 className="font-serif text-[2rem] leading-[1.03] text-white">{item.name}</h2>

                <div className="flex items-center gap-2">
                  {item.variants.map((variant) => (
                    <span
                      key={`${item.name}-${variant}-mobile`}
                      className={`h-3.5 w-3.5 rounded-full ${
                        variant === "White" ? "border border-white/30 bg-black" : "bg-white"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">SIZES: S M L XL</p>

                <span className="inline-flex items-center border-b border-white/70 pb-1 text-[11px] uppercase tracking-[0.24em] text-white transition duration-500 group-hover:text-white/80">
                  View Product -&gt;
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 hidden grid-cols-1 gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group overflow-hidden border border-white/12 bg-white/[0.02] transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.04]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/[0.01]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="px-4 py-4">
                <p className="font-serif text-2xl leading-tight">{item.name}</p>
                <div className="mt-3 flex items-center gap-2">
                  {item.variants.map((variant) => (
                    <span
                      key={`${item.name}-${variant}`}
                      className={`h-3.5 w-3.5 rounded-full transition-transform duration-200 hover:scale-110 ${
                        variant === "White"
                          ? "bg-black border border-white/25"
                          : "bg-white border border-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}