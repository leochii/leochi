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
    <main className="relative overflow-hidden bg-[#050505] text-[#f7f0e6] pt-20 md:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,244,224,0.12),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(214,186,140,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%)]" />
        <div className="absolute left-[-10%] top-24 h-80 w-80 rounded-full bg-[#f5e7d0]/[0.08] blur-3xl" />
        <div className="absolute right-[-8%] top-[28rem] h-96 w-96 rounded-full bg-[#c7a978]/[0.08] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f7f0e6]/20 to-transparent" />
      </div>

      <section className="relative px-6 pb-14 pt-12 md:px-10 md:pb-36 md:pt-28">
        <div className="mx-auto grid max-w-7xl gap-8 md:gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.36em] text-[#d2bea0] opacity-80 md:mb-6 md:text-[11px] md:tracking-[0.42em]">LEOCHI STUDIO</p>
            <h1 className="max-w-[90%] font-serif text-[44px] leading-[0.95] tracking-[-0.03em] text-[#fff7ed] md:max-w-3xl md:text-[clamp(4rem,7vw,7rem)] md:leading-[0.92] md:tracking-[-0.04em]">
              Premium Custom Manufacturing &amp;
              <br />
              Apparel Production
            </h1>
            <p className="mt-10 max-w-[94%] text-base leading-7 text-[#efe3d3] md:mt-8 md:max-w-2xl md:text-lg md:leading-8">
              Luxury apparel production for brands and teams that want a cleaner process, better materials, and a refined final result.
            </p>
            <p className="mt-4 max-w-[94%] text-sm leading-7 text-[#c3b5a2] md:mt-5 md:max-w-xl md:text-base md:leading-8">
              Premium sourcing, professional print methods, and a streamlined quote flow built for modern apparel programs.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row md:mt-12 md:gap-4">
              <Link
                href="#quote-form"
                className="inline-flex items-center justify-center rounded-full bg-[#f3e5cf] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-black transition duration-300 hover:bg-[#fff4e4] md:px-8 md:py-4 md:text-xs md:tracking-[0.28em]"
              >
                Request a Quote
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-[#f3e5cf]/20 bg-white/[0.02] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f7f0e6] transition duration-300 hover:border-[#f3e5cf]/45 hover:bg-[#f3e5cf]/[0.05] md:px-8 md:py-4 md:text-xs md:tracking-[0.28em]"
              >
                View Services
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_30px_110px_rgba(0,0,0,0.45)] backdrop-blur-xl md:rounded-[2.2rem] md:p-8 md:shadow-[0_40px_140px_rgba(0,0,0,0.5)]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#cdb99a] md:text-[11px] md:tracking-[0.32em]">Minimum Order: 5 Pieces+</p>
            <h2 className="mt-4 font-serif text-2xl leading-[1.08] text-[#fff7ed] md:mt-5 md:text-4xl">Clean, premium apparel production for modern brands.</h2>
            <div className="mt-6 grid gap-2.5 md:mt-8 md:gap-3">
              {[
                "Based in Vancouver, Canada",
                "Premium garment sourcing",
                "DTF & Screen Printing",
                "Worldwide Shipping",
              ].map((item) => (
                <div key={item} className="rounded-[1.1rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] px-3.5 py-3 text-[13px] text-[#efe3d3] md:rounded-[1.25rem] md:px-4 md:py-4 md:text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-3 md:mb-10 md:gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#cdb99a] md:text-[11px] md:tracking-[0.32em]">Services</p>
              <h2 className="mt-3 font-serif text-3xl leading-[1.05] text-[#fff7ed] md:mt-4 md:text-5xl">Focused services for premium apparel programs.</h2>
            </div>
            <p className="max-w-xl text-[13px] leading-6 text-[#c3b5a2] md:text-sm md:leading-7">A tighter service list keeps the experience cleaner, faster, and more considered.</p>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
            {services.map((service) => (
              <article key={service.title} className="rounded-3xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-4 transition duration-300 hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.06)] md:px-6 md:py-6">
                <h3 className="text-[22px] font-medium leading-[1.15] text-[#fff7ed] md:text-2xl">{service.title}</h3>
                <p className="mt-2.5 text-[13px] leading-6 text-[#d7c9b5] md:mt-4 md:text-sm md:leading-7">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-3 md:mb-10 md:gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#cdb99a] md:text-[11px] md:tracking-[0.32em]">Pricing</p>
              <h2 className="mt-3 font-serif text-3xl leading-[1.05] text-[#fff7ed] md:mt-4 md:text-5xl">Simple quantity bands with premium production language.</h2>
            </div>
            <p className="max-w-lg text-[13px] leading-6 text-[#c3b5a2] md:text-sm md:leading-7">Each order is quoted around garment choice, decoration, and production complexity.</p>
          </div>

          <div className="grid gap-3.5 lg:grid-cols-3 md:gap-5">
            {pricingTiers.map((tier) => (
              <article key={tier.range} className="rounded-3xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-4 md:rounded-[1.8rem] md:p-7">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#cdb99a] md:text-[11px] md:tracking-[0.28em]">{tier.label}</p>
                <h3 className="mt-3 font-serif text-3xl text-[#fff7ed] md:mt-6 md:text-4xl">{tier.range}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quote-form" className="relative px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 md:mb-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#cdb99a] md:text-[11px] md:tracking-[0.32em]">Quote Form</p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.05] text-[#fff7ed] md:mt-4 md:text-5xl">Request a clean, premium quote.</h2>
          </div>

          <CustomPrintingForm />
        </div>
      </section>
    </main>
  );
}