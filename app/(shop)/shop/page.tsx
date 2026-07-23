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
    <main className="min-h-screen bg-black px-6 pb-32 pt-28 text-white md:px-10 md:pt-32 lg:px-14 lg:pb-40">
      <section className="mx-auto max-w-[1800px]">
        <h2 className="text-center font-serif text-3xl text-white md:text-4xl">SEASONAL COLLECTIONS</h2>

        <div className="mt-6 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <article
              key={collection.title}
              className="group relative h-[750px] overflow-hidden border border-white/[0.08] transition-all duration-[250ms] ease-out hover:shadow-[0_0_26px_rgba(201,158,98,0.28)] sm:h-[780px] lg:h-[820px]"
            >
              <div className="absolute inset-x-0 top-0 h-[64%] overflow-hidden">
                <Image
                  src={seasonalBackgrounds[collection.title]}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top contrast-[1.08] saturate-[1.03] transition-transform duration-[250ms] ease-out group-hover:translate-y-[6px]"
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 h-[34%] overflow-hidden lg:bottom-[-120px]">
                <Image
                  src={seasonalBackgrounds[collection.title]}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-bottom contrast-[1.08] saturate-[1.03] transition-transform duration-[250ms] ease-out group-hover:scale-[1.02]"
                />
              </div>

              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_48%,rgba(0,0,0,0.45)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(235,179,124,0.12)_0%,rgba(235,179,124,0)_38%,rgba(15,11,8,0.22)_100%)]" />
              <div className="pointer-events-none absolute bottom-[40%] left-1/2 h-10 w-44 -translate-x-1/2 rounded-full bg-black/45 blur-xl transition-all duration-[250ms] ease-out group-hover:bg-black/55" />
              <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-black/30 via-black/80 to-black" />

              <div className="absolute inset-x-0 bottom-0 z-10">
                <div className="w-full p-6 md:p-8">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-white/75">{collection.seasonLabel}</p>
                  <h3 className="mt-3 font-serif text-4xl leading-tight text-white md:text-5xl">{collection.title}</h3>

                  <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-white/85">{collection.itemCount}</p>
                  <p className="mt-2 text-xs text-white/78">Inspired by Persian Seasons.</p>
                  <p className="mt-1 text-xs text-white/75">{collection.seasonCopy}</p>

                  {collection.available && collection.href ? (
                    <Link
                      href={collection.href}
                      className="mt-6 inline-flex h-11 items-center justify-center border border-white/85 px-7 text-[10px] uppercase tracking-[0.3em] text-white transition-all duration-[250ms] ease-out hover:bg-white hover:text-black group-hover:border-white group-hover:bg-white group-hover:text-black"
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