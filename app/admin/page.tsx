import { createClient } from "@supabase/supabase-js";
import OrdersTable from "./OrdersTable";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
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
const now = new Date();

const todayOrders =
  orders?.filter((order) => {
    const date = new Date(order.created_at);

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }) ?? [];

const monthOrders =
  orders?.filter((order) => {
    const date = new Date(order.created_at);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }) ?? [];

const todaySales = todayOrders.reduce(
  (sum, order) => sum + (order.amount ?? 0),
  0
);

const monthSales = monthOrders.reduce(
  (sum, order) => sum + (order.amount ?? 0),
  0
);

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

        <div className="flex justify-between items-center mb-10">

  <h1 className="text-5xl font-serif">
    Orders
  </h1>

  <Link
    href="/api/admin/logout"
    className="px-5 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition"
  >
    Logout
  </Link>

</div>
<div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
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
<div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
  <p className="text-neutral-400">Today</p>
  <h2 className="text-3xl font-bold">
    CAD ${(todaySales / 100).toFixed(2)}
  </h2>
</div>

<div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
  <p className="text-neutral-400">This Month</p>
  <h2 className="text-3xl font-bold">
    CAD ${(monthSales / 100).toFixed(2)}
  </h2>
</div>
</div>

<OrdersTable orders={orders} />

      </div>
    </main>
  );
}