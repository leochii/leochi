import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServerConfig } from "../../lib/server-env";
import StatusDropdown from "./StatusDropdown";
import { type CustomPrintingStatus } from "../../lib/custom-printing";

type CustomPrintingRequest = {
  id: string;
  quote_sequence: number | null;
  status: CustomPrintingStatus;
  name: string;
  email: string;
  company: string | null;
  instagram_or_website: string | null;
  quantity: number;
  garment_type: string;
  desired_delivery_date: string | null;
  print_details: string[] | null;
  notes: string | null;
  file_url: string;
  file_urls: string[] | null;
  created_at: string;
};

const statusOptions: CustomPrintingStatus[] = ["Quote Requested", "Quote Sent", "Approved", "In Production", "Completed"];

function formatQuoteNumber(sequence: number | null) {
  if (!sequence) {
    return "Pending";
  }

  return `LCH-${String(sequence).padStart(6, "0")}`;
}

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

  const requestRows = (requests as CustomPrintingRequest[]) ?? [];

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

        <div className="mb-8 grid gap-4 md:grid-cols-5">
          {statusOptions.map((status) => (
            <div key={status} className="rounded-[1.4rem] border border-neutral-800 bg-neutral-950 px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Status</p>
              <p className="mt-3 text-sm text-neutral-100">{status}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-neutral-800 bg-neutral-950">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800 text-left">
              <thead className="bg-neutral-950">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Customer name</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Company</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Quantity</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Uploaded files</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Quote number</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Current status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Date submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {requestRows.map((request) => (
                  <tr key={request.id} className="align-top">
                    <td className="px-6 py-5">
                      <p className="font-medium text-white">{request.name}</p>
                      <p className="mt-2 break-all text-sm text-neutral-400">{request.email}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-neutral-300">{request.company ?? "No company provided"}</td>
                    <td className="px-6 py-5 text-sm text-neutral-300">{request.quantity} pieces</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {(request.file_urls && request.file_urls.length > 0 ? request.file_urls : [request.file_url]).map((fileUrl, index) => (
                          <a
                            key={`${fileUrl}-${index}`}
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full border border-neutral-700 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-neutral-500 hover:bg-neutral-900"
                          >
                            File {index + 1}
                          </a>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-neutral-300">{formatQuoteNumber(request.quote_sequence)}</td>
                    <td className="px-6 py-5">
                      <StatusDropdown requestId={request.id} currentStatus={request.status} />
                    </td>
                    <td className="px-6 py-5 text-sm text-neutral-400">{new Date(request.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}

                {requestRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-neutral-400">
                      No custom printing requests yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}