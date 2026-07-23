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
  const isHomePage = pathname === "/";

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
        className={`fixed top-0 left-0 right-0 pointer-events-auto ${
          isHomePage
              ? "bg-transparent"
            : "border-b border-neutral-800 bg-black/95 backdrop-blur"
        }`}
        style={{ zIndex: 100 }}
      >
        <div className="relative mx-auto h-[72px] max-w-7xl px-5 md:h-20 md:px-8">
          <Link
            href="/"
            className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-white md:left-8 md:text-3xl"
            style={{ fontFamily: '"Iowan Old Style", "Bodoni 72", "Times New Roman", serif' }}
          >
            LEOCHI
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.28em] text-white transition hover:text-neutral-300 md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            MENU
          </button>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-4 text-[9px] uppercase text-white md:flex md:gap-14 md:text-[11px]"
            style={{ letterSpacing: "0.34em" }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition ${isActivePath(item.href) ? "text-white" : "text-white/80 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ))}

            <Link href="/cart" className="transition text-white/80 hover:text-white">
              CART
              <span className="ml-3 border border-white/40 bg-white/95 px-2 py-1 text-[10px] font-bold text-black md:text-xs">
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