import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    request?: string | string[];
  }>;
};

export default async function CustomPrintingSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const requestId = Array.isArray(params.request) ? params.request[0] : params.request;

  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-32 text-white md:px-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] md:p-10">
        <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Custom Printing</p>
        <h1 className="mt-5 font-serif text-4xl md:text-6xl">Request Received</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-300">
          Your inquiry is with the LEOCHI team. We will review your garment requirements, artwork, and quantities, then reply with a tailored quote.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/55 p-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">Status</p>
            <p className="mt-3 text-xl font-medium text-white">In review</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/55 p-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">Reference</p>
            <p className="mt-3 break-all text-sm text-neutral-200">{requestId ?? "Sent to orders@leochi.co"}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/custom-printing"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-neutral-200"
          >
            Start Another Request
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white/50 hover:bg-white/5"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}