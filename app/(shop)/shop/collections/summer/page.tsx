import Link from "next/link";

const items = [
  { name: "Chem-Trail", href: "/shop/products/Chem-Trail", price: "CAD $60" },
  { name: "Farsh", href: "/shop/products/Farsh", price: "CAD $60" },
  { name: "Leochi", href: "/shop/products/Leochi", price: "CAD $60" },
];

export default function SummerCollectionPage() {
  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-28 text-white md:px-12 md:pt-32 lg:px-16">
      <section className="mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.34em] text-white/55">SEASON 01</p>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl">Summer Collection</h1>
        <p className="mt-4 text-white/70">3 Items</p>

        <div className="mt-12 space-y-4">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center justify-between border border-white/12 bg-white/[0.02] px-5 py-4 transition hover:border-white/30 hover:bg-white/[0.05]"
            >
              <span className="font-serif text-2xl md:text-3xl">{item.name}</span>
              <span className="text-sm text-white/80">{item.price}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}