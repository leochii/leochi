"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between"
        >
          <Link
            href="/"
            className="text-3xl font-serif text-white"
          >
            LEOCHI
          </Link>

        <nav className="flex gap-10 uppercase tracking-[0.25em] text-sm text-white">

          <Link href="/shop">Shop</Link>

          <Link href="/about">About</Link>

          <Link href="/cart">Cart</Link>

        </nav>

      </div>
    </header>
  );
}