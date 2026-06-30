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
const totalSales =
  orders?.reduce((sum, order) => sum + (order.amount ?? 0), 0) ?? 0;

const totalOrders = orders?.length ?? 0;

const averageOrder =
  totalOrders > 0 ? totalSales / totalOrders : 0;
  if (orders?.length === 0) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-2xl">No orders yet.</h1>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-serif mb-10">
          Orders
        </h1>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

  <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
    <p className="text-neutral-400">Total Sales</p>
    <h2 className="text-3xl font-bold">
      CAD ${(totalSales / 100).toFixed(2)}
    </h2>
  </div>

  <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
    <p className="text-neutral-400">Orders</p>
    <h2 className="text-3xl font-bold">
      {totalOrders}
    </h2>
  </div>

  <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
    <p className="text-neutral-400">Average Order</p>
    <h2 className="text-3xl font-bold">
      CAD ${(averageOrder / 100).toFixed(2)}
    </h2>
  </div>

</div>

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
                  CAD ${((order.amount ?? 0) / 100).toFixed(2)}
                </td>

                <td>
  <span
    className={`px-3 py-1 rounded-full text-sm ${
      order.status === "paid"
        ? "bg-green-600"
        : order.status === "pending"
        ? "bg-yellow-600"
        : "bg-neutral-700"
    }`}
  >
    {order.status}
  </span>
</td>

                <td>
                  {new Date(order.created_at).toLocaleString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </main>
  );
}