"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { authClient } from "@/lib/auth-client";

interface Animal {
  _id: string;
  name: string;
  type: "cow" | "buffalo";
  breed: string;
  age: number;
  weight: number;
  price: number;
  color: string;
  imageUrl: string;
  description: string;
  status: "available" | "sold";
  createdAt: string;
}

export default function ManageItemsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAdmin = (user as Record<string, unknown>)?.role === "admin";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await api.get("/api/animals", { params: { limit: 100, sort: "newest" } });
        if (!cancelled) setAnimals(res.data.animals);
      } catch {
        if (!cancelled) setAnimals([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Access denied. Admin only.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(`/api/animals/${id}`);
      setAnimals((prev) => prev.filter((a) => a._id !== id));
      toast.success("Animal deleted successfully!");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete animal.");
    } finally {
      setDeleting(null);
    }
  };

  const statusColor = (s: string) =>
    s === "available"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-emerald-deep">Manage Animals</h1>
        <Link
          href="/dashboard/admin/add-item"
          className="px-4 py-2 bg-emerald-deep hover:bg-emerald-bright text-white text-sm font-semibold rounded-lg transition"
        >
          + Add New
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : animals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg">No animals found.</p>
          <Link
            href="/dashboard/admin/add-item"
            className="mt-4 inline-block px-6 py-2 bg-emerald-deep text-white rounded-lg hover:bg-emerald-bright transition text-sm"
          >
            Add Your First Animal
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Animal</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Breed</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal) => (
                  <tr key={animal._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={animal.imageUrl || "/placeholder-cow.png"}
                          alt={animal.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        />
                        <span className="font-medium text-emerald-deep text-sm">{animal.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">{animal.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{animal.breed}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gold">
                      ৳{animal.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusColor(animal.status)}`}>
                        {animal.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/animals/${animal._id}`}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-deep text-emerald-deep hover:bg-emerald-deep hover:text-white transition"
                        >
                          View
                        </Link>
                        {confirmDelete === animal._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(animal._id)}
                              disabled={deleting === animal._id}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 cursor-pointer"
                            >
                              {deleting === animal._id ? "..." : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(animal._id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-400 text-red-500 hover:bg-red-50 transition cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Total: {animals.length} animal{animals.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
