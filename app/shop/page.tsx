import Link from "next/link";
import Image from "next/image";

export default function Shop() {
  return (
    <main className="min-h-screen bg-[#fbf7f1] px-10 py-20">
      <h1 className="text-5xl font-serif mb-10">
        Shop Collection
      </h1>

      <div className="grid md:grid-cols-3 gap-10">

        {/* Sky Tee */}
        <Link href="/shop/products/Sky Tee">
          <div className="bg-white rounded-3xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition">
            <Image
              src="/Sky.PNG"
              alt="Sky Tee"
              width={400}
              height={400}
              className="rounded-2xl"
            />

            <h2 className="text-2xl mt-6">Sky Tee</h2>

            <p className="text-gray-500 mt-2">
              Premium Streetwear Collection
            </p>

            <p className="mt-4 text-xl">$50 CAD</p>
          </div>
        </Link>

        {/* Persian Rug Tee */}
        <Link href="/shop/products/PersianRug">
          <div className="bg-white rounded-3xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition">
            <Image
              src="/PersianRug.PNG"
              alt="Persian Rug Tee"
              width={400}
              height={400}
              className="rounded-2xl"
            />

            <h2 className="text-2xl mt-6">PersianRugTee</h2>

            <p className="text-gray-500 mt-2">
              Inspired by Persian Heritage
            </p>

            <p className="mt-4 text-xl">$50 CAD</p>
          </div>
        </Link>

        {/* Leochi */}
        <Link href="/shop/products/Leochi">
          <div className="bg-white rounded-3xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition">
            <Image
              src="/Leochi.PNG"
              alt="Leochi"
              width={400}
              height={400}
              className="rounded-2xl"
            />

            <h2 className="text-2xl mt-6">Leochi</h2>

            <p className="text-gray-500 mt-2">
              Premium Cotton Collection
            </p>

            <p className="mt-4 text-xl">$50 CAD</p>
          </div>
        </Link>

      </div>
    </main>
  );
}