import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServerConfig } from "../../lib/server-env";

type CustomPrintingRequest = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  quantity: number;
  garment_type: string;
  notes: string | null;
  file_url: string;
  created_at: string;
};

function getSupabaseClient() {
  const { url, serviceRoleKey } = getSupabaseServerConfig();

  return createClient(url, serviceRoleKey);
}

export default async function AdminCustomPrintingPage() {
  const cookieStore = await cookies();

  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/admin/login");
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (error) {
    console.error("Failed to initialize Supabase:", error);
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Error: Server not properly configured.</p>
      </main>
    );
  }

  const { data: requests, error } = await supabase
    .from("custom_printing_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading custom printing requests:", error);
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Error loading custom printing requests.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-10 pt-32 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">Admin</p>
            <h1 className="mt-3 font-serif text-5xl">Custom Printing Requests</h1>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-full border border-neutral-700 px-5 py-3 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-neutral-800"
          >
            Back to Orders
          </Link>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-neutral-800 bg-neutral-950">
          <div className="hidden grid-cols-[1.2fr_1fr_0.7fr_0.9fr_1fr_0.9fr] gap-4 border-b border-neutral-800 px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-neutral-500 lg:grid">
            <span>Client</span>
            <span>Company</span>
            <span>Quantity</span>
            <span>Garment</span>
            <span>Design</span>
            <span>Received</span>
          </div>

          <div className="divide-y divide-neutral-800">
            {(requests as CustomPrintingRequest[]).map((request) => (
              <article key={request.id} className="grid gap-5 px-6 py-6 lg:grid-cols-[1.2fr_1fr_0.7fr_0.9fr_1fr_0.9fr] lg:items-start">
                <div>
                  <p className="text-lg font-medium text-white">{request.name}</p>
                  <p className="mt-2 break-all text-sm text-neutral-400">{request.email}</p>
                  {request.notes ? <p className="mt-3 text-sm leading-6 text-neutral-500">{request.notes}</p> : null}
                </div>

                <div className="text-sm text-neutral-300">{request.company ?? "-"}</div>

                <div className="text-sm text-neutral-300">{request.quantity}</div>

                <div className="text-sm text-neutral-300">{request.garment_type}</div>

                <div>
                  <a
                    href={request.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-neutral-700 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white transition hover:border-neutral-500 hover:bg-neutral-900"
                  >
                    Open File
                  </a>
                </div>

                <div className="text-sm text-neutral-400">{new Date(request.created_at).toLocaleDateString()}</div>
              </article>
            ))}

            {requests?.length === 0 ? (
              <div className="px-6 py-16 text-center text-neutral-400">No custom printing requests yet.</div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}