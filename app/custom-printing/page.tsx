import type { Metadata } from "next";
import Link from "next/link";
import CustomPrintingForm from "../components/custom-printing-form";

export const metadata: Metadata = {
  title: "Custom T-Shirt Printing | LEOCHI",
  description: "Premium custom apparel printing services in Canada.",
};

const statistics = [
  {
    title: "Minimum order: 5 pieces",
    description: "Low-entry production for samples, staff kits, and launch capsules.",
  },
  {
    title: "Fast turnaround windows",
    description: "Estimated lead times tailored to quantity and approval timing.",
  },
  {
    title: "DTF / Screen Print / Embroidery",
    description: "Production methods selected around finish, feel, and durability.",
  },
  {
    title: "Bulk Discounts Available",
    description: "Scaled pricing for growing brands, teams, and uniform programs.",
  },
];

const benefits = [
  "Premium garment sourcing",
  "DTF & Screen Printing",
  "Design assistance",
  "Worldwide shipping",
  "Dedicated project management",
];

const services = [
  {
    title: "T-Shirts",
    description: "Heavyweight and retail-ready tees for launches, merch tables, and uniform programs.",
    startingQuantity: "Starts at 5 pieces",
  },
  {
    title: "Hoodies",
    description: "Premium fleece programs with elevated placement and durable print finishes.",
    startingQuantity: "Starts at 5 pieces",
  },
  {
    title: "Crewnecks",
    description: "Clean branded layering pieces for lifestyle brands, teams, and internal drops.",
    startingQuantity: "Starts at 5 pieces",
  },
  {
    title: "Workwear",
    description: "Functional branded garments for trades, field teams, and heavy daily wear.",
    startingQuantity: "Starts at 10 pieces",
  },
  {
    title: "Restaurants & Staff Uniforms",
    description: "Front-of-house and back-of-house apparel programs with consistent finishing.",
    startingQuantity: "Starts at 10 pieces",
  },
  {
    title: "Tote Bags",
    description: "Retail add-ons, event gifting, and brand collateral with premium presentation.",
    startingQuantity: "Starts at 10 pieces",
  },
  {
    title: "Event Merchandise",
    description: "Concert, conference, pop-up, and campaign apparel with scalable fulfillment.",
    startingQuantity: "Starts at 15 pieces",
  },
  {
    title: "Corporate Apparel",
    description: "Refined internal wear, onboarding kits, and client-facing branded uniforms.",
    startingQuantity: "Starts at 15 pieces",
  },
];

const pricingTiers = [
  {
    range: "5-9 Pieces",
    label: "Small runs",
    estimate: "7-10 business days",
  },
  {
    range: "10-24 Pieces",
    label: "Discount pricing",
    estimate: "7-12 business days",
  },
  {
    range: "25+ Pieces",
    label: "Bulk pricing",
    estimate: "10-14 business days",
  },
];

function ServiceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 7.5H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 16.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.75" y="4.75" width="16.5" height="14.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ConsultationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 9.5C7 7.567 8.567 6 10.5 6H13.5C15.433 6 17 7.567 17 9.5V15.5C17 17.433 15.433 19 13.5 19H10.5C8.567 19 7 17.433 7 15.5V9.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 14H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 6.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 11.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 16.5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 4H17.5C18.328 4 19 4.672 19 5.5V18.5C19 19.328 18.328 20 17.5 20H6.5C5.672 20 5 19.328 5 18.5V5.5C5 4.672 5.672 4 6.5 4Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ProductionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8.5H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="6.5" width="16" height="12.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.5 15H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShippingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 6.5H14.5V15.5H3.5V6.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.5 9H18.328L20.5 11.172V15.5H14.5V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 18.5C7.828 18.5 8.5 17.828 8.5 17C8.5 16.172 7.828 15.5 7 15.5C6.172 15.5 5.5 16.172 5.5 17C5.5 17.828 6.172 18.5 7 18.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 18.5C17.828 18.5 18.5 17.828 18.5 17C18.5 16.172 17.828 15.5 17 15.5C16.172 15.5 15.5 16.172 15.5 17C15.5 17.828 16.172 18.5 17 18.5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    title: "Consultation",
    description: "We align on garments, use case, quantity, timeline, and presentation requirements.",
    icon: <ConsultationIcon />,
  },
  {
    number: "02",
    title: "Design Review",
    description: "Artwork, print placement, sizing, and finishing details are reviewed before production.",
    icon: <ReviewIcon />,
  },
  {
    number: "03",
    title: "Production",
    description: "Approved garments move through the most suitable print or embroidery method for the project.",
    icon: <ProductionIcon />,
  },
  {
    number: "04",
    title: "Quality Check & Shipping",
    description: "Every order is inspected, packed, and shipped with an elevated final presentation.",
    icon: <ShippingIcon />,
  },
];

const trustBadges = [
  "Based in Vancouver, Canada",
  "Premium garment sourcing",
  "DTF & Screen Printing",
  "Worldwide Shipping",
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

      <section className="relative px-6 pb-28 pt-12 md:px-10 md:pb-36 md:pt-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-6 text-[11px] uppercase tracking-[0.42em] text-[#d2bea0] opacity-80 animate-[fade_0.7s_ease]">LEOCHI STUDIO</p>
            <h1 className="max-w-4xl font-serif text-5xl leading-none sm:text-6xl lg:text-[7.5rem] animate-[fade_0.9s_ease]">LEOCHI STUDIO</h1>
            <p className="mt-10 max-w-3xl text-lg leading-8 text-[#efe3d3] animate-[fade_1.1s_ease]">
              Premium Custom Manufacturing & Apparel Production
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#c3b5a2] animate-[fade_1.3s_ease]">
              Precision-made programs for brands, teams, creators, and hospitality clients who expect a premium finish.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row animate-[fade_1.5s_ease]">
              <Link
                href="#quote-form"
                className="inline-flex items-center justify-center rounded-full bg-[#f3e5cf] px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-black transition duration-300 hover:bg-[#fff4e4] hover:shadow-[0_0_40px_rgba(243,229,207,0.12)]"
              >
                Request a Quote
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-[#f3e5cf]/25 bg-white/[0.02] px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#f7f0e6] transition duration-300 hover:border-[#f3e5cf]/55 hover:bg-[#f3e5cf]/[0.06]"
              >
                View Services
              </Link>
            </div>

            <div className="mt-12 rounded-[1.8rem] border border-[#f3e5cf]/10 bg-white/[0.03] p-5 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#d2bea0]">Trusted by brands, events, teams and creators.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {trustBadges.map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-2 rounded-full border border-[#f3e5cf]/15 bg-[#f3e5cf]/[0.05] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#f7f0e6]">
                    <span className="text-[#e8d0aa]">✓</span>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-[#f3e5cf]/10 bg-gradient-to-br from-[#f6ead7]/[0.09] via-white/[0.04] to-transparent p-6 shadow-[0_40px_140px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-8 animate-[fade_1.1s_ease]">
            <div className="rounded-[1.8rem] border border-[#f3e5cf]/10 bg-black/35 p-6 md:p-7">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Studio Standard</p>
                <h2 className="mt-5 font-serif text-3xl text-[#fff7ed] md:text-4xl">Minimum Order: 5 Pieces+</h2>
              <p className="mt-5 text-sm leading-8 text-[#d7c9b5]">
                Built for boutique launches, uniforms, branded merchandise, and full-scale apparel programs with premium sourcing and production support.
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  "Luxury black and cream presentation",
                  "Guided garment and print method recommendations",
                  "Tailored quotes for small runs and scaled production",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.25rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] px-4 py-4 transition duration-300 hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.08)]">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#e8d0aa]" />
                    <p className="text-sm leading-7 text-[#efe3d3]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {statistics.map((stat, index) => (
              <article
                key={stat.title}
                className="group rounded-[1.8rem] border border-[#f3e5cf]/10 bg-gradient-to-br from-[#f6ead7]/[0.08] to-white/[0.02] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.38)] transition duration-500 hover:-translate-y-1 hover:border-[#f3e5cf]/25 hover:bg-[#f6ead7]/[0.08]"
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#cdb99a]">0{index + 1}</p>
                <h2 className="mt-8 text-2xl font-medium leading-tight text-[#fff7ed]">{stat.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#d7c9b5]">{stat.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Premium Benefits</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-[#fff7ed]">A luxury manufacturing portal built around service, finish, and reliability.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#c3b5a2]">
              Every order is handled like a production program, with clarity from intake through shipping.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {benefits.map((benefit, index) => (
              <article
                key={benefit}
                className="group relative overflow-hidden rounded-[1.85rem] border border-[#f3e5cf]/10 bg-white/[0.03] p-6 transition duration-500 hover:-translate-y-1 hover:border-[#f3e5cf]/30 hover:bg-[#f3e5cf]/[0.05]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f6ead7]/[0.08] via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#cdb99a]">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-8 text-2xl font-medium text-[#fff7ed]">{benefit}</h3>
                  </div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#f3e5cf]/10 bg-[#f3e5cf]/[0.05] text-[#f3e5cf] transition group-hover:border-[#f3e5cf]/30 group-hover:bg-[#f3e5cf]/[0.08]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 12.5L10 16.5L18 8.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="relative border-y border-[#f3e5cf]/10 bg-white/[0.02] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Services</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-[#fff7ed]">Built for premium production across uniforms, merch, and collections.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#c3b5a2]">
              We source and produce garment programs that feel considered, polished, and ready for public-facing wear.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <article key={service.title} className="group rounded-[1.8rem] border border-[#f3e5cf]/10 bg-gradient-to-br from-[#f6ead7]/[0.06] to-transparent p-6 transition duration-500 hover:-translate-y-1 hover:border-[#f3e5cf]/25 hover:bg-[#f6ead7]/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#f3e5cf]/10 bg-[#f3e5cf]/[0.04] text-[#f3e5cf]">
                    <ServiceIcon />
                  </span>
                  <span className="text-xs uppercase tracking-[0.28em] text-[#cdb99a]">{String(index + 1).padStart(2, "0")}</span>
                </div>

                <h3 className="mt-8 text-2xl font-medium text-[#fff7ed]">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#d7c9b5]">{service.description}</p>
                <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-[#cdb99a]">{service.startingQuantity}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Process</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-[#fff7ed]">A guided production timeline from briefing to delivery.</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 ? (
                  <div className="pointer-events-none absolute left-[calc(50%+1.5rem)] right-[-1.5rem] top-6 hidden h-px bg-gradient-to-r from-[#f3e5cf]/30 to-transparent lg:block" />
                ) : null}

                <article className="group relative rounded-[1.8rem] border border-[#f3e5cf]/10 bg-black/45 p-6 transition duration-500 hover:-translate-y-1 hover:border-[#f3e5cf]/25 hover:bg-[#f3e5cf]/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#f3e5cf]/10 bg-[#f3e5cf]/[0.04] text-[#f3e5cf]">
                      {step.icon}
                    </span>
                    <span className="text-xs uppercase tracking-[0.28em] text-[#cdb99a]">{step.number}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-medium text-[#fff7ed]">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#d7c9b5]">{step.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Pricing</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-[#fff7ed]">Tiered for premium short runs and scaled production.</h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-[#c3b5a2]">
              Pricing depends on garment type, print size, colors, and finishing requirements. Contact us for a custom quote.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article key={tier.range} className="rounded-[1.8rem] border border-[#f3e5cf]/10 bg-gradient-to-b from-[#f6ead7]/[0.07] to-transparent p-7">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#cdb99a]">{tier.label}</p>
                <h3 className="mt-6 font-serif text-4xl text-[#fff7ed]">{tier.range}</h3>
                <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-[#d2bea0]">Estimated turnaround</p>
                <p className="mt-3 text-base leading-7 text-[#fff7ed]">{tier.estimate}</p>
                <p className="mt-6 text-base leading-7 text-[#d7c9b5]">Contact us for a custom quote.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quote-form" className="relative px-6 pb-24 pt-8 md:px-10 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Order Form</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-[#fff7ed]">Request a premium quote.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#c3b5a2]">
              Share your garment choice, quantities, and design file. Minimum Order: 5 Pieces+. We will follow up with pricing, lead times, and production guidance.
            </p>
          </div>

          <CustomPrintingForm />
        </div>
      </section>

      <section className="relative px-6 pb-32 pt-4 md:px-10">
        <div className="mx-auto max-w-7xl rounded-[2.4rem] border border-[#f3e5cf]/10 bg-gradient-to-br from-[#f6ead7]/[0.08] via-white/[0.04] to-transparent p-8 shadow-[0_35px_140px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-12">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb99a]">Ready to build your next collection?</p>
            <h2 className="mt-5 font-serif text-4xl md:text-6xl text-[#fff7ed]">Whether you need samples, uniforms, merchandise, or a full apparel program, Leochi Studio is ready to produce it.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d7c9b5]">
              Bring the concept, the team, or the brief. We will shape the garment program around finish, presentation, and production scale.
            </p>

            <div className="mt-10">
              <Link
                href="#quote-form"
                className="inline-flex items-center justify-center rounded-full bg-[#f3e5cf] px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-black transition duration-300 hover:bg-[#fff4e4] hover:shadow-[0_0_40px_rgba(243,229,207,0.12)]"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}