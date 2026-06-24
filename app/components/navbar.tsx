"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/cartcontext";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-[#fbf7f1] border-b">
  <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

    {/* Left */}
    <h1 className="text-4xl font-serif">
      LEOCHI
    </h1>

    {/* Center */}
    <Image
      src="/logo.PNG"
      alt="Leochi Logo"
      width={150}
      height={150}
      className="rounded-full"
    />

    {/* Right */}
    <div className="flex items-center gap-10 text-lg">
      <Link href="/">Home</Link>
      <Link href="/shop">Shop</Link>
      <Link href="/about">About</Link>
      <Link href="/cart">
        Cart ({cart.length})
      </Link>
    </div>

  </div>
</nav>
  );
}