"use client";

import { useEffect, useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hideNavbar = pathname.startsWith("/admin");

  useEffect(() => {
    if (hideNavbar || !isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hideNavbar, isMenuOpen]);

  if (hideNavbar) {
    return null;
  }

  const isActivePath = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const mobileMenuItems = [
    { href: "/shop", label: "SHOP" },
    { href: "/custom-printing", label: "LEOCHI STUDIO" },
    { href: "/about", label: "ABOUT" },
    { href: "/cart", label: "CART" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 pointer-events-auto border-b border-neutral-800 bg-black/95 backdrop-blur"
        style={{ zIndex: 100 }}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
          <Link href="/" className="text-2xl font-serif text-white md:text-3xl">
            LEOCHI
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="text-xs uppercase tracking-[0.28em] text-white transition hover:text-neutral-300 md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            MENU
          </button>

          <nav className="hidden items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white md:flex md:gap-8 md:text-sm md:tracking-[0.25em]">
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

      <div
        className="fixed inset-0 transition-opacity duration-500 md:hidden"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgb(0, 0, 0)",
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
        }}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
          <Link href="/" className="text-2xl font-serif text-white" onClick={() => setIsMenuOpen(false)}>
            LEOCHI
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="text-xs uppercase tracking-[0.28em] text-white transition hover:text-neutral-300"
          >
            CLOSE
          </button>
        </div>

        <nav className="flex h-[calc(100dvh-72px)] items-center justify-center px-8">
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-10">
            {mobileMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-center font-serif text-[clamp(2rem,7.5vw,3.25rem)] leading-[1.05] tracking-[0.08em] text-[#f7f0e6] transition duration-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}