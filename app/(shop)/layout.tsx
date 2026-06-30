import Navbar from "../components/navbar";
import { CartProvider } from "../context/cartcontext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />

      {children}

      <footer className="bg-black text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-8 py-20">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            <div>
              <h2 className="text-2xl font-serif mb-4">LEOCHI</h2>

              <p className="text-gray-300">
                DESIGN IN CANADA
              </p>

              <p className="mt-6 text-gray-400">
                support@leochi.co
              </p>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.2em] text-sm mb-5">
                Shop
              </h3>

              <ul className="space-y-3 text-gray-300">
                <li>Chem-Trail</li>
                <li>Farsh</li>
                <li>Leochi</li>
              </ul>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.2em] text-sm mb-5">
                Info
              </h3>

              <ul className="space-y-3 text-gray-300">
                <li>About</li>
                <li>Contact</li>
                <li>Shipping</li>
              </ul>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.2em] text-sm mb-5">
                Follow
              </h3>

              <ul className="space-y-3 text-gray-300">
                <li>Instagram</li>
                <li>Facebook</li>
              </ul>
            </div>

          </div>

          <div className="border-t border-neutral-800 mt-16 pt-8 text-center text-gray-400 text-sm">
            © 2026 LEOCHI. All Rights Reserved.
          </div>

        </div>
      </footer>
    </CartProvider>
  );
}