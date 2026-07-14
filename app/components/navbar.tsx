"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/cartcontext";

const navItems = [
  {
    href: "/shop",
    label: "SHOP",
  },
  {
    href: "/custom-printing",
    label: "LEOCHI STUDIO",
  },
  {
    href: "/about",
    label: "ABOUT",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isActivePath = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] pointer-events-auto bg-black/95 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="text-2xl font-serif text-white md:text-3xl">
          LEOCHI
        </Link>

        <nav className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white md:gap-8 md:text-sm md:tracking-[0.25em]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition ${isActivePath(item.href) ? "text-white" : "text-neutral-400 hover:text-neutral-200"}`}
            >
              {item.label}
            </Link>
          ))}

          <Link href="/cart" className="transition hover:text-neutral-300">
            CART
            <span className="ml-2 bg-white px-2 py-1 text-[10px] font-bold text-black md:text-xs">
              {cart.length}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}