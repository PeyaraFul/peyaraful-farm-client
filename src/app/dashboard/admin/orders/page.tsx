"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface Animal {
  _id: string;
  name: string;
  breed: string;
  type: "cow" | "buffalo";
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await api.get("/api/orders/all");
        if (!cancelled) setOrders(res.data);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const handleConfirm = async (orderId: string) => {
    setActingId(orderId);
    try {
      await api.patch(`/api/orders/${orderId}/confirm`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "paid" } : o))
      );
      toast.success("Order confirmed");
    } catch {
      toast.error("Failed to confirm order");
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    setActingId(orderId);
    try {
      await api.delete(`/api/orders/${orderId}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
      toast.success("Order cancelled");
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-emerald-deep mb-6">Manage Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {order.animal?.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={order.animal.imageUrl}
                  alt={order.animal.name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-emerald-deep truncate">
                  {order.animal?.name || "Unknown Animal"}
                </p>
                <p className="text-sm text-gray-500">
                  {order.animal?.breed} &middot; {order.animal?.type === "cow" ? "Cow" : "Buffalo"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Buyer: {order.buyerId.slice(0, 8)}... &middot;{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-BD")}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-lg font-bold text-gold">
                  ৳{order.price.toLocaleString()}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleConfirm(order._id)}
                      disabled={actingId === order._id}
                      className="px-3 py-1.5 bg-emerald-deep hover:bg-emerald-bright text-white text-sm font-medium rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={actingId === order._id}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
