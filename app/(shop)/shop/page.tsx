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

  {/* Chem-Trail */}
  <Link href="/shop/products/Chem-Trail" className="group">
    <div className="aspect-[3/4] relative overflow-hidden bg-neutral-900">
      <Image
        src="/Chem-Trail.PNG"
        alt="Chem-Trail"
        fill
        sizes="33vw"
        className="object-cover object-top transition duration-700 group-hover:scale-110"
      />
    </div>

    <div className="mt-6 flex justify-between items-start">
      <div>
        <h2 className="font-serif text-[32px] text-white">Chem-Trail</h2>
        <p className="text-neutral-400 mt-2">Premium Heavyweight Cotton</p>
      </div>

      <span className="text-white font-medium">
  CAD $60
</span>
    </div>
  </Link>


  {/* Farsh */}
  <Link href="/shop/products/Farsh" className="group">
    <div className="aspect-[3/4] relative overflow-hidden bg-neutral-900">
      <Image
        src="/Farsh.PNG"
        alt="Farsh"
        fill
        sizes="33vw"
        className="object-cover object-top transition duration-700 group-hover:scale-110"
      />
    </div>

    <div className="mt-6 flex justify-between items-start">
      <div>
        <h2 className="font-serif text-[32px] text-white">Farsh</h2>
        <p className="text-neutral-400 mt-2">Premium Heavyweight Cotton</p>
      </div>

      <span className="text-white font-medium">
  CAD $60
</span>
    </div>
  </Link>


  {/* Leochi */}
  <Link href="/shop/products/Leochi" className="group">
    <div className="aspect-[3/4] relative overflow-hidden bg-neutral-900">
      <Image
        src="/Leochi.PNG"
        alt="Leochi"
        fill
        sizes="33vw"
        className="object-cover object-top transition duration-700 group-hover:scale-110"
      />
    </div>

    <div className="mt-6 flex justify-between items-start">
      <div>
        <h2 className="font-serif text-[32px] text-white">Leochi</h2>
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