import Image from "next/image";
import Link from "next/link"
export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbf7f1] px-10 py-20">

      <h1 className="text-5xl font-serif text-center mb-4">
        Premium Streetwear
      </h1>

      <p className="text-center text-gray-500 mb-16">
        Timeless designs inspired by culture and craftsmanship.
      </p>

      {/* Products */}

      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">

        {/* SkyTee */}
        <Link href="/shop/products/SkyTee">
          <div className="bg-white rounded-3xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition">
            <Image
  src="/Sky.PNG"
  alt="SkyTee"
  width={400}
  height={400}
  className="rounded-2xl object-cover w-full h-[400px]"
/>

            <h2 className="text-2xl mt-6">SkyTee</h2>

            <p className="text-gray-500 mt-2">
              Premium Streetwear Collection
            </p>

            <p className="mt-4 text-xl">$60 CAD</p>
          </div>
        </Link>


        {/* PersianRugTee */}
        <Link href="/shop/products/PersianRugTee">
          <div className="bg-white rounded-3xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition">
            <Image
  src="/PersianRug.PNG"
  alt="PersianRugTee"
  width={400}
  height={400}
  className="rounded-2xl object-cover w-full h-[400px]"
/>

            <h2 className="text-2xl mt-6">PersianRugTee</h2>

            <p className="text-gray-500 mt-2">
              Inspired by Persian Heritage
            </p>

            <p className="mt-4 text-xl">$60 CAD</p>
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
  className="rounded-2xl object-cover w-full h-[400px]"
/>

            <h2 className="text-2xl mt-6">Leochi</h2>

            <p className="text-gray-500 mt-2">
              Minimal Essential Collection
            </p>

            <p className="mt-4 text-xl">$50 CAD</p>
          </div>
        </Link>

      </div>

</main>
  );
}