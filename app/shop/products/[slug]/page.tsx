import { notFound } from "next/navigation";
import { products } from "../../../data/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  return (
    <main className="bg-black text-white min-h-screen">

      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="grid lg:grid-cols-[1.6fr_0.8fr] gap-20">

          {/* LEFT */}

          <div>

            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full rounded-lg"
            />

            <div className="grid grid-cols-3 gap-4 mt-6">

              {product.images.slice(1).map((image, index) => (

                <img
                  key={index}
                  src={image}
                  className="rounded-lg cursor-pointer hover:opacity-70 transition"
                />

              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div className="sticky top-28 self-start">

            <p className="uppercase tracking-[0.35em] text-neutral-500 text-xs">
              LEOCHI
            </p>

            <h1 className="font-serif text-6xl mt-3">
              {product.name}
            </h1>

            <p className="text-3xl mt-8">
              CAD ${product.price}
            </p>

            <div className="mt-10 space-y-2 text-neutral-400">

              <p>{product.material}</p>

              <p>{product.fit}</p>

            </div>

            <p className="mt-12 text-neutral-300 leading-8">
              {product.description}
            </p>

            <div className="mt-14">

              <p className="uppercase tracking-[0.3em] text-xs text-neutral-500 mb-5">
                Size
              </p>

              <div className="flex gap-3">

                {["S","M","L","XL"].map((size)=>(

                  <button
                    key={size}
                    className="border border-neutral-700 px-6 py-3 hover:bg-white hover:text-black transition"
                  >
                    {size}
                  </button>

                ))}

              </div>

            </div>

            <button
              className="mt-14 w-full border border-white py-5 uppercase tracking-[0.35em] hover:bg-white hover:text-black transition"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}