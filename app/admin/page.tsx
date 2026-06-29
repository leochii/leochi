import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Error loading orders.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-serif mb-10">
          Orders
        </h1>

        <table className="w-full border-collapse">

          <thead>

            <tr className="border-b border-neutral-700">

              <th className="text-left py-4">Customer</th>

              <th className="text-left py-4">Email</th>

              <th className="text-left py-4">Amount</th>

              <th className="text-left py-4">Status</th>

              <th className="text-left py-4">Date</th>

            </tr>

          </thead>

          <tbody>

            {orders?.map((order) => (
              <tr
                key={order.id}
                className="border-b border-neutral-800"
              >
                <td className="py-5">
                  {order.customer_name}
                </td>

                <td>
                  {order.customer_email}
                </td>

                <td>
                  CAD ${(order.amount ?? 0) / 100}
                </td>

                <td>
                  {order.status}
                </td>

                <td>
                  {new Date(order.created_at).toLocaleDateString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </main>
  );
}