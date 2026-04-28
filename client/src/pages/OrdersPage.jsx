import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/order", { withCredentials: true })
      .then((res) => setOrders(res.data))
      .catch((err) => setMsg(err.response?.data?.message ?? "Error"));
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      {msg && <p className="text-red-600">{msg}</p>}
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o._id} className="bg-white p-3 rounded shadow">
            <pre>{JSON.stringify(o, null, 2)}</pre>
          </li>
        ))}
        {orders.length === 0 && !msg && <p>No orders yet.</p>}
      </ul>
    </section>
  );
}
