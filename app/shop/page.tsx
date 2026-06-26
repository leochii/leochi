import Image from "next/image";
import Link from "next/link";

export default function Shop() {
  return (
    <main className="bg-black text-white min-h-screen pt-24">

      {/* Navbar */}


      {/* Title */}

      <section className="text-center py-24">

        <p className="uppercase tracking-[0.4em] text-neutral-500 text-sm">
          COLLECTION 
        </p>

      </section>

      <div className="grid md:grid-cols-3 gap-20 px-16 pb-24">

  {/* Sky Tee */}
  <Link href="/shop/products/SkyTee" className="group">
    <div className="aspect-[4/5] relative overflow-hidden bg-neutral-900">
      <Image
        src="/Sky.PNG"
        alt="Sky Tee"
        fill
        className="object-cover transition duration-700 group-hover:scale-105"
      />
    </div>

    <div className="mt-6 flex justify-between items-start">
      <div>
        <h2 className="font-serif text-[32px] text-white">Sky Tee</h2>
        <p className="text-neutral-400 mt-2">Premium Heavyweight Cotton</p>
      </div>

      <span className="text-white font-medium">
  CAD $60
</span>
    </div>
  </Link>


  {/* Persian Rug Tee */}
  <Link href="/shop/products/PersianRugTee" className="group">
    <div className="aspect-[4/5] relative overflow-hidden bg-neutral-900">
      <Image
        src="/PersianRug.PNG"
        alt="Persian Rug Tee"
        fill
        className="object-cover transition duration-700 group-hover:scale-105"
      />
    </div>

    <div className="mt-6 flex justify-between items-start">
      <div>
        <h2 className="font-serif text-[32px] text-white">Persian Rug Tee</h2>
        <p className="text-neutral-400 mt-2">Premium Heavyweight Cotton</p>
      </div>

      <span className="text-white font-medium">
  CAD $60
</span>
    </div>
  </Link>


  {/* Leochi */}
  <Link href="/shop/products/Leochi" className="group">
    <div className="aspect-[4/5] relative overflow-hidden bg-neutral-900:">
      <Image
        src="/Leochi.PNG"
        alt="Leochi"

        fill
        className="object-cover transition duration-700 group-hover:scale-105"
      />
    </div>

    <div className="mt-6 flex justify-between items-start">
      <div>
        <h2 className="font-serif text-2xl text-white">Leochi</h2>
        <p className="text-neutral-400 mt-2">Premium Heavyweight Cotton</p>
      </div>

      <span className="text-white font-medium">
  CAD $60
</span>
    </div>
  </Link>

</div>
    </main>
  );
}