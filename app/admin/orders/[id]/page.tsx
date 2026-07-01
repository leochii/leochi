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
  <strong>Order Status:</strong> {order.order_status ?? "paid"}
</p>

<p>
  <strong>Tracking Number:</strong> {order.tracking_number ?? "-"}
</p>

<p>
  <strong>Carrier:</strong> {order.carrier ?? "-"}
</p>

          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <p>
            <strong>Total:</strong> CAD ${((order.amount ?? 0) / 100).toFixed(2)}
          </p>
          <h2 className="text-2xl font-serif mt-10 mb-4">Products</h2>

          <div className="space-y-4">
            {order.products?.map((product: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 border border-neutral-800 rounded-xl p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p>Size: {product.size}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>CAD ${(product.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}