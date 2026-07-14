import type { Metadata } from "next";
import Link from "next/link";
import CustomPrintingForm from "../components/custom-printing-form";

export const metadata: Metadata = {
  title: "Custom T-Shirt Printing | LEOCHI",
  description: "Premium custom apparel printing services in Canada.",
};

const services = [
  "T-Shirts",
  "Hoodies",
  "Crewnecks",
  "Tote Bags",
  "Workwear",
  "Event Merchandise",
  "Small Business Merchandise",
];

const pricingTiers = [
  {
    range: "1-9 pieces",
    label: "Small orders",
  },
  {
    range: "10-24 pieces",
    label: "Discount pricing",
  },
  {
    range: "25+ pieces",
    label: "Bulk pricing",
  },
];

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.5 9.5L12 5l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 18.5C5 17.672 5.672 17 6.5 17H17.5C18.328 17 19 17.672 19 18.5C19 19.328 18.328 20 17.5 20H6.5C5.672 20 5 19.328 5 18.5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GarmentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5.5L12 8L15 5.5L18.5 8L16.5 12V19.5H7.5V12L5.5 8L9 5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 9.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 6.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 11.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 16.5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 4H17.5C18.328 4 19 4.672 19 5.5V18.5C19 19.328 18.328 20 17.5 20H6.5C5.672 20 5 19.328 5 18.5V5.5C5 4.672 5.672 4 6.5 4Z" stroke="currentColor" strokeWidth="1.5" />
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
    title: "Upload your design",
    description: "Send your artwork, mockup, or production files with drag-and-drop upload.",
    icon: <UploadIcon />,
  },
  {
    number: "02",
    title: "Choose garment and quantity",
    description: "Select the garment category, tell us the volume, and outline your project details.",
    icon: <GarmentIcon />,
  },
  {
    number: "03",
    title: "Receive a quote",
    description: "We review print method, placement, lead time, and send a tailored quote.",
    icon: <QuoteIcon />,
  },
  {
    number: "04",
    title: "Production & shipping",
    description: "Once approved, your order moves into production and ships with care.",
    icon: <ShippingIcon />,
  },
];

export default function CustomPrintingPage() {
  return (
    <main className="relative overflow-hidden bg-black text-white pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-24 h-80 w-80 rounded-full bg-white/[0.05] blur-3xl" />
        <div className="absolute right-[-8%] top-[28rem] h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <section className="relative px-6 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.38em] text-neutral-500">LEOCHI Studio Services</p>
            <h1 className="max-w-4xl font-serif text-5xl leading-none sm:text-6xl lg:text-8xl">CUSTOM PRINTING</h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-300">
              Premium custom apparel printing for brands, businesses, teams, events and creators.
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-neutral-400">
              From one piece to bulk orders — printed with precision.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#quote-form"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.26em] text-black transition hover:bg-neutral-200"
              >
                Get a Quote
              </Link>
              <Link
                href="#quote-form"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.26em] text-white transition hover:border-white/50 hover:bg-white/5"
              >
                Start Your Order
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">Order Range</p>
                <p className="mt-3 text-2xl font-medium text-white">1 piece to volume runs</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">Ideal For</p>
                <p className="mt-3 text-2xl font-medium text-white">Brands, teams, launches</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-5 sm:col-span-2">
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">Production Approach</p>
                <p className="mt-3 text-base leading-7 text-neutral-300">
                  Luxury presentation, detail-focused garment selection, and clean production for elevated merchandise programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Services</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">Built for premium blanks and elevated merch.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-neutral-400">
              Flexible runs for capsule drops, staff uniforms, pop-ups, and branded apparel programs.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 transition duration-500 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="relative flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-8 text-2xl font-medium text-white">{service}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-neutral-400 transition group-hover:border-white/30 group-hover:text-white">
                    Premium
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/10 bg-white/[0.02] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">How It Works</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">A direct four-step production flow.</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="rounded-[1.75rem] border border-white/10 bg-black/55 p-6 transition duration-300 hover:border-white/25 hover:bg-black/70">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
                    {step.icon}
                  </span>
                  <span className="text-xs uppercase tracking-[0.28em] text-neutral-500">{step.number}</span>
                </div>
                <h3 className="mt-8 text-2xl font-medium text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-neutral-400">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Pricing</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">Tiered for samples, short runs, and bulk production.</h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-neutral-400">Every quote is tailored to garment, ink coverage, print placement, and finishing requirements.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article key={tier.range} className="rounded-[1.8rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-7">
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">{tier.label}</p>
                <h3 className="mt-6 font-serif text-4xl text-white">{tier.range}</h3>
                <p className="mt-6 text-base leading-7 text-neutral-300">Contact us for a custom quote.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quote-form" className="relative px-6 pb-24 pt-8 md:px-10 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Order Form</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">Request a premium quote.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-neutral-400">
              Share your garment choice, quantities, and design file. We will follow up with pricing, lead times, and production guidance.
            </p>
          </div>

          <CustomPrintingForm />
        </div>
      </section>
    </main>
  );
}