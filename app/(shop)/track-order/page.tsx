import Link from "next/link";

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
  const shippingCarrier = readParam(params.shippingCarrier, "To be assigned");
  const trackingNumber = readParam(params.trackingNumber, "Not available yet");

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-16 px-6 md:px-10">
      <div className="max-w-4xl mx-auto border border-neutral-800 bg-neutral-950/70 rounded-2xl overflow-hidden">
        <div className="px-7 py-8 md:px-10 md:py-10 border-b border-neutral-800 bg-gradient-to-br from-neutral-950 to-black">
          <p className="uppercase tracking-[0.28em] text-[11px] text-neutral-500 mb-4">LEOCHI</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-4">Track Order</h1>
          <p className="text-neutral-300 max-w-2xl">
            Follow your order progress and shipment details in one place.
          </p>
        </div>

        <div className="px-7 py-8 md:px-10 md:py-10 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-black border border-neutral-800 rounded-xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Order Number</p>
              <p className="text-sm md:text-base break-all text-neutral-100">{orderNumber}</p>
            </div>

            <div className="bg-black border border-neutral-800 rounded-xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Current Status</p>
              <p className="text-lg font-semibold text-neutral-100">{currentStatus}</p>
            </div>

            <div className="bg-black border border-neutral-800 rounded-xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Estimated Delivery Date</p>
              <p className="text-neutral-100">{estimatedDeliveryDate}</p>
            </div>

            <div className="bg-black border border-neutral-800 rounded-xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Shipping Carrier</p>
              <p className="text-neutral-100">{shippingCarrier}</p>
            </div>

            <div className="bg-black border border-neutral-800 rounded-xl p-5 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Tracking Number</p>
              <p className="text-sm md:text-base break-all text-neutral-100">{trackingNumber}</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="https://leochi.co/track-order"
              className="inline-flex items-center justify-center border border-neutral-700 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-[0.16em] text-xs"
            >
              Track Another Order
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
