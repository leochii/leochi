import CollectionCard from "@/components/shop/CollectionCard";

export default function Shop() {
  const collections = [
    {
      title: "Summer Collection",
      seasonLabel: "SEASON 01",
      description: "Summer 2026",
      available: true,
      href: "/shop/collections/summer",
      itemCount: "3 ITEMS",
    },
    {
      title: "Fall Collection",
      seasonLabel: "SEASON 02",
      description: "Autumn 2026",
      available: false,
    },
    {
      title: "Winter Collection",
      seasonLabel: "SEASON 03",
      description: "Winter 2026",
      available: false,
    },
    {
      title: "Spring Collection",
      seasonLabel: "SEASON 04",
      description: "Spring 2027",
      available: false,
    },
  ] as const;

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-28 text-white md:px-10 md:pt-32 lg:px-14">
      <section className="mx-auto mt-20 max-w-7xl md:mt-24">
        <h2 className="text-center font-serif text-3xl text-white md:text-4xl">SEASONAL COLLECTIONS</h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.title}
              title={collection.title}
              seasonLabel={collection.seasonLabel}
              description={collection.description}
              available={collection.available}
              href={collection.available ? collection.href : undefined}
              itemCount={collection.available ? collection.itemCount : undefined}
            />
          ))}
        </div>
      </section>
    </main>
  );
}