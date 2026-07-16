"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import AnimalCard from "@/components/AnimalCard";

interface Animal {
  _id: string;
  name: string;
  type: "cow" | "buffalo";
  breed: string;
  price: number;
  imageUrl: string;
  status: "available" | "sold";
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await api.get("/api/favorites");
        if (!cancelled) setFavorites(res.data);
      } catch {
        if (!cancelled) setFavorites([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-emerald-deep mb-6">My Favorites</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">You have no favorites yet.</p>
          <Link
            href="/all-cows"
            className="mt-4 inline-block px-6 py-2 bg-emerald-deep text-white rounded-lg hover:bg-emerald-bright transition"
          >
            Browse Animals
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((animal) => (
            <AnimalCard key={animal._id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  );
}
