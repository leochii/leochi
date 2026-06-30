import { createClient } from "@supabase/supabase-js";
import OrdersTable from "./OrdersTable";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
    const cookieStore = await cookies();

const isAdmin = cookieStore.get("admin-auth")?.value === "true";
if (!isAdmin) {
  redirect("/admin/login");
}
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

<OrdersTable orders={orders} />

      </div>
    </main>
  );
}