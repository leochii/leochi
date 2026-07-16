import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import OrderManager from "../../OrderManager";
import { getSupabaseServerConfig } from "../../../lib/server-env";
import { requireAdminPageAuth } from "../../../lib/admin-session";

const getSupabaseClient = () => {
  const { url, serviceRoleKey } = getSupabaseServerConfig();

  return createClient(url, serviceRoleKey);
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPageAuth();

  const { id } = await params;

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (error) {
    console.error("Failed to initialize Supabase:", error);
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1>Server configuration error.</h1>
      </main>
    );
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

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
            <strong>Total:</strong> CAD ${((order.amount ?? 0) / 100).toFixed(2)}
          </p>

          <OrderManager
            id={order.id}
            status={order.status ?? "paid"}
            tracking_number={order.tracking_number ?? ""}
            carrier={order.carrier ?? "Canada Post"}
          />

          <div className="space-y-4">
            {order.products?.map((product: { image: string; name: string; size: string; quantity: number; price: number }, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 border border-neutral-800 rounded-xl p-4"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={80}
                  height={80}
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