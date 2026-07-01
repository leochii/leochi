import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("ID:", id);
  
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
console.log("ORDER:", order);

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1>Order not found.</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-serif mb-10">
          Order Details
        </h1>

        <div className="space-y-4">

          <p>
            <strong>Customer:</strong> {order.customer_name}
          </p>

          <p>
            <strong>Email:</strong> {order.customer_email}
          </p>

          <p>
            <strong>Phone:</strong> {order.phone}
          </p>

          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <p>
            <strong>Total:</strong> CAD $
            {((order.amount ?? 0) / 100).toFixed(2)}
          </p>

        </div>

      </div>
    </main>
  );
}