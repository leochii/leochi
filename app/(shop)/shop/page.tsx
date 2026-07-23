import Image from "next/image";
import Link from "next/link";

export default function Shop() {
  const collections = [
    {
      title: "Summer Collection",
      seasonLabel: "SEASON 01",
      seasonCopy: "Summer 2026",
      available: true,
      href: "/shop/collections/summer",
      itemCount: "3 ITEMS",
    },
    {
      title: "Fall Collection",
      seasonLabel: "SEASON 02",
      seasonCopy: "Autumn 2026",
      available: false,
      itemCount: "0 ITEMS",
    },
    {
      title: "Winter Collection",
      seasonLabel: "SEASON 03",
      seasonCopy: "Winter 2026",
      available: false,
      itemCount: "0 ITEMS",
    },
    {
      title: "Spring Collection",
      seasonLabel: "SEASON 04",
      seasonCopy: "Spring 2027",
      available: false,
      itemCount: "0 ITEMS",
    },
  ] as const;

  const seasonalBackgrounds = {
    "Summer Collection": "/summer.jpg",
    "Fall Collection": "/fall.jpg",
    "Winter Collection": "/winter.jpg",
    "Spring Collection": "/spring.jpg",
  } as const;

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-28 text-white md:px-10 md:pt-32 lg:px-14">
      <section className="mx-auto mt-20 max-w-[1800px] md:mt-24">
        <h2 className="text-center font-serif text-3xl text-white md:text-4xl">SEASONAL COLLECTIONS</h2>

        <div className="mt-10 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <article
              key={collection.title}
              className="group relative h-[750px] overflow-hidden border border-white/[0.08] sm:h-[780px] lg:h-[820px]"
            >
              <Image
                src={seasonalBackgrounds[collection.title]}
                alt={collection.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute inset-0 z-10 flex items-end">
                <div className="w-full p-6 md:p-8">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-white/75">{collection.seasonLabel}</p>
                  <h3 className="mt-3 font-serif text-4xl leading-tight text-white md:text-5xl">{collection.title}</h3>

                  <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-white/85">{collection.itemCount}</p>
                  <p className="mt-2 text-xs text-white/78">Inspired by Persian Seasons.</p>
                  <p className="mt-1 text-xs text-white/75">{collection.seasonCopy}</p>

                  {collection.available && collection.href ? (
                    <Link
                      href={collection.href}
                      className="mt-6 inline-flex h-11 items-center justify-center border border-white/85 px-7 text-[10px] uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
                    >
                      Explore
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-6 inline-flex h-11 items-center justify-center border border-white/45 px-7 text-[10px] uppercase tracking-[0.3em] text-white/60"
                    >
                      Explore
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}