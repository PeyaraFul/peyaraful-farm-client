"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useSession } from "@/lib/auth-client";

interface Animal {
  _id: string;
  name: string;
  type: "cow" | "buffalo";
  breed: string;
  imageUrl: string;
  price: number;
}

interface Order {
  _id: string;
  buyerId: string;
  animalId: string;
  price: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
  animal?: Animal;
}

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const buyerId = user.id;

    async function load() {
      try {
        const res = await api.get("/api/orders", {
          params: { buyerId },
        });
        if (!cancelled) setOrders(res.data);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-gray-500 text-lg">Please login to view your orders.</p>
        <Link
          href="/auth/login"
          className="mt-4 inline-block text-emerald-bright hover:underline"
        >
          Login
        </Link>
      </div>
    );
  }

  const statusColor = (s: string) => {
    if (s === "paid") return "bg-green-100 text-green-700";
    if (s === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-emerald-deep mb-6">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">You have no orders yet.</p>
          <Link
            href="/all-cows"
            className="mt-4 inline-block px-6 py-2 bg-emerald-deep text-white rounded-lg hover:bg-emerald-bright transition"
          >
            Browse Animals
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Animal</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {order.animal && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={order.animal.imageUrl}
                          alt={order.animal.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <Link
                          href={`/animals/${order.animalId}`}
                          className="font-medium text-emerald-deep hover:underline"
                        >
                          {order.animal?.name || "Unknown"}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {order.animal?.breed}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                    {order.animal?.type || "—"}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-gold">
                    ৳{order.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-BD")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
