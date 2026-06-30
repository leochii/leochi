"use client";

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: string;
  created_at: string;
};

export default function OrdersTable({
  orders,
}: {
  orders: Order[];
}) {
  return (
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
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-neutral-800">
            <td className="py-5">{order.customer_name}</td>

            <td>{order.customer_email}</td>

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

            <td>{new Date(order.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}