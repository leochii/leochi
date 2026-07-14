"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/cartcontext";

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();

  if (pathname.startsWith("/admin")) {
  return null;
}

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] pointer-events-auto bg-black/95 backdrop-blur border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between"
        >
          <Link
            href="/"
            className="text-3xl font-serif text-white"
          >
            LEOCHI
          </Link>

        <nav className="flex gap-10 uppercase tracking-[0.25em] text-sm text-white">

          <Link href="/shop" className="hover:text-neutral-300 transition">Shop</Link>

          <Link href="/about" className="hover:text-neutral-300 transition">About</Link>

          <Link href="/cart" className="hover:text-neutral-300 transition">
            Cart
            <span className="ml-2 bg-white text-black px-2 py-1 text-xs font-bold">
              {cart.length}
            </span>
          </Link>

        </nav>

      </div>
    </header>
  );
}