type TrackOrderPageProps = {
  searchParams: Promise<{
    orderNumber?: string | string[];
    currentStatus?: string | string[];
    estimatedDeliveryDate?: string | string[];
    shippingCarrier?: string | string[];
    trackingNumber?: string | string[];
  }>;
};

function readParam(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] || fallback;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return fallback;
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const params = await searchParams;

  const orderNumber = readParam(params.orderNumber, "Not available");
  const currentStatus = readParam(params.currentStatus, "Order Confirmed");
  const estimatedDeliveryDate = readParam(
    params.estimatedDeliveryDate,
    "Within 5-8 business days"
  );
  const shippingCarrier = readParam(params.shippingCarrier, "Pending shipment");
  const trackingNumber = readParam(params.trackingNumber, "Pending shipment");

  return (
    <main className="min-h-screen bg-[#f5f0e5] text-[#1b1b1b] px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto border border-[#e1d7c7] bg-[#fcf8f1]">
        <div className="px-8 py-10 border-b border-[#e1d7c7] text-center">
          <p className="font-serif text-4xl tracking-[0.18em]">LEOCHI</p>
        </div>

        <section className="px-8 py-8 border-b border-[#e1d7c7]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8b6f47] mb-4">Order Information</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Order Number</p>
              <p className="text-sm md:text-base break-all">{orderNumber}</p>
            </div>
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Current Status</p>
              <p className="text-base font-medium">{currentStatus}</p>
            </div>
          </div>
        </section>

        <section className="px-8 py-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8b6f47] mb-4">Tracking Information</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Estimated Delivery Date</p>
              <p className="text-sm md:text-base">{estimatedDeliveryDate}</p>
            </div>
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Shipping Carrier</p>
              <p className="text-sm md:text-base">{shippingCarrier}</p>
            </div>
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4 md:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Tracking Number</p>
              <p className="text-sm md:text-base break-all">{trackingNumber}</p>
            </div>
          </div>

          <div className="pt-7">
            <a
              href="mailto:support@leochi.co"
              className="inline-flex items-center justify-center bg-[#1b1b1b] text-[#f5f0e5] px-6 py-3 text-xs uppercase tracking-[0.18em]"
            >
              Contact Support
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
