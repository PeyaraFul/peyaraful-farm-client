"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
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
  const [reviewedMap, setReviewedMap] = useState<Record<string, boolean>>({});
  const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await api.get("/api/orders");
        if (!cancelled) {
          setOrders(res.data);
          const paidOrders = res.data.filter((o: Order) => o.status === "paid");
          const checks = await Promise.all(
            paidOrders.map(async (o: Order) => {
              try {
                const r = await api.get("/api/reviews/check", {
                  params: { orderId: o._id },
                });
                return { orderId: o._id, reviewed: r.data.reviewed };
              } catch {
                return { orderId: o._id, reviewed: false };
              }
            })
          );
          if (!cancelled) {
            const map: Record<string, boolean> = {};
            checks.forEach((c) => { map[c.orderId] = c.reviewed; });
            setReviewedMap(map);
          }
        }
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  const handleSubmitReview = async (orderId: string, animalId: string) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await api.post("/api/reviews", {
        animalId,
        orderId,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review submitted!");
      setReviewedMap((prev) => ({ ...prev, [orderId]: true }));
      setReviewingOrderId(null);
      setReviewRating(5);
      setReviewComment("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

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
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Review</th>
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
                  <td className="py-3 px-4">
                    {order.status === "paid" && (
                      reviewedMap[order._id] ? (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-deep/10 text-emerald-deep">
                          Reviewed
                        </span>
                      ) : reviewingOrderId === order._id ? (
                        <div className="space-y-2 min-w-[200px]">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="text-lg cursor-pointer"
                              >
                                {star <= reviewRating ? "★" : "☆"}
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSubmitReview(order._id, order.animalId)}
                              disabled={submitting}
                              className="text-xs px-3 py-1 bg-emerald-deep text-white rounded-lg hover:bg-emerald-bright transition disabled:opacity-50 cursor-pointer"
                            >
                              {submitting ? "Submitting..." : "Submit"}
                            </button>
                            <button
                              onClick={() => {
                                setReviewingOrderId(null);
                                setReviewRating(5);
                                setReviewComment("");
                              }}
                              className="text-xs px-3 py-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReviewingOrderId(order._id)}
                          className="text-xs font-semibold px-3 py-1 rounded-full border border-gold text-gold hover:bg-gold hover:text-white transition cursor-pointer"
                        >
                          Write Review
                        </button>
                      )
                    )}
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
