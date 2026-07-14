import type { Metadata } from "next";
import Link from "next/link";
import CustomPrintingForm from "../components/custom-printing-form";

export const metadata: Metadata = {
  title: "Custom T-Shirt Printing | LEOCHI",
  description: "Premium custom apparel printing services in Canada.",
};

const services = [
  {
    title: "T-Shirts",
    description: "Premium tees for launches, merchandise, uniforms, and everyday brand wear.",
  },
  {
    title: "Hoodies",
    description: "Elevated fleece programs with clean finishes and durable production quality.",
  },
  {
    title: "Corporate Apparel",
    description: "Refined branded apparel for internal teams, client-facing kits, and events.",
  },
  {
    title: "Restaurants & Staff Uniforms",
    description: "Polished uniform programs for hospitality teams and front-of-house wear.",
  },
];

const pricingTiers = [
  {
    range: "5-9 Pieces",
    label: "Custom Quote",
  },
  {
    range: "10-24 Pieces",
    label: "Volume Pricing Available",
  },
  {
    range: "25+ Pieces",
    label: "Preferred Production Rates",
  },
];

export default function CustomPrintingPage() {
  return (
    <main className="relative overflow-hidden bg-[#050505] text-[#f7f0e6] pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,244,224,0.12),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(214,186,140,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%)]" />
        <div className="absolute left-[-10%] top-24 h-80 w-80 rounded-full bg-[#f5e7d0]/[0.08] blur-3xl" />
        <div className="absolute right-[-8%] top-[28rem] h-96 w-96 rounded-full bg-[#c7a978]/[0.08] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f7f0e6]/20 to-transparent" />
      </div>

      <section className="relative px-6 pb-24 pt-12 md:px-10 md:pb-28 md:pt-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-6 text-[11px] uppercase tracking-[0.42em] text-[#d2bea0] opacity-80">LEOCHI STUDIO</p>
            <h1 className="max-w-4xl font-serif text-5xl leading-none sm:text-6xl lg:text-[7rem]">Premium Custom Manufacturing &amp; Apparel Production</h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#efe3d3]">
              Luxury apparel production for brands and teams that want a cleaner process, better materials, and a refined final result.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#c3b5a2]">
              Premium sourcing, professional print methods, and a streamlined quote flow built for modern apparel programs.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#quote-form"
                className="inline-flex items-center justify-center rounded-full bg-[#f3e5cf] px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-black transition duration-300 hover:bg-[#fff4e4]"
              >
                Request a Quote
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-[#f3e5cf]/20 bg-white/[0.02] px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#f7f0e6] transition duration-300 hover:border-[#f3e5cf]/45 hover:bg-[#f3e5cf]/[0.05]"
              >
                View Services
              </Link>
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Minimum Order: 5 Pieces+</p>
            <h2 className="mt-5 font-serif text-3xl text-[#fff7ed] md:text-4xl">Clean, premium apparel production for modern brands.</h2>
            <div className="mt-8 grid gap-3">
              {[
                "Based in Vancouver, Canada",
                "Premium garment sourcing",
                "DTF & Screen Printing",
                "Worldwide Shipping",
              ].map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] px-4 py-4 text-sm text-[#efe3d3]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative px-6 py-18 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Services</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-[#fff7ed]">Focused services for premium apparel programs.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#c3b5a2]">A tighter service list keeps the experience cleaner, faster, and more considered.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article key={service.title} className="rounded-[1.8rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] p-6 transition duration-300 hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.06)]">
                <h3 className="text-2xl font-medium text-[#fff7ed]">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#d7c9b5]">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Pricing</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-[#fff7ed]">Simple quantity bands with premium production language.</h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-[#c3b5a2]">Each order is quoted around garment choice, decoration, and production complexity.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article key={tier.range} className="rounded-[1.8rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] p-7">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#cdb99a]">{tier.label}</p>
                <h3 className="mt-6 font-serif text-4xl text-[#fff7ed]">{tier.range}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quote-form" className="relative px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Quote Form</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-[#fff7ed]">Request a clean, premium quote.</h2>
          </div>

          <CustomPrintingForm />
        </div>
      </section>

      <section className="relative px-6 pb-28 pt-6 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2.4rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_35px_140px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-12">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Final CTA</p>
          <h2 className="mt-5 max-w-4xl font-serif text-4xl md:text-6xl text-[#fff7ed]">Build your next apparel program with a cleaner, more premium process.</h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#d7c9b5]">Bring the concept. We&apos;ll handle the manufacturing direction, production setup, and quote preparation.</p>

          <div className="mt-10">
            <Link
              href="#quote-form"
              className="inline-flex items-center justify-center rounded-full bg-[#f3e5cf] px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-black transition duration-300 hover:bg-[#fff4e4]"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}