"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import AnimalCard from "@/components/AnimalCard";

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
  sellerId: string;
}

interface Review {
  _id: string;
  userId: string;
  animalId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const user = session?.user;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [related, setRelated] = useState<Animal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/api/animals/${id}`);
        if (!cancelled) setAnimal(res.data);

        const relRes = await api.get("/api/animals", {
          params: { type: res.data.type, limit: 4 },
        });
        if (!cancelled) {
          setRelated(
            relRes.data.animals.filter((a: Animal) => a._id !== id).slice(0, 4)
          );
        }

        const revRes = await api.get(`/api/reviews/animal/${id}`);
        if (!cancelled) {
          setReviews(revRes.data.reviews);
          setAverageRating(revRes.data.averageRating);
          setReviewCount(revRes.data.total);
        }
      } catch {
        if (!cancelled) setAnimal(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      toast.error("Please login to buy");
      return;
    }
    setBuying(true);
    try {
      await api.post("/api/orders", { animalId: id, buyerId: user.id });
      toast.success("Order placed!");
      setAnimal((prev) => (prev ? { ...prev, status: "sold" } : prev));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-96 bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-gray-500 text-lg">Animal not found.</p>
        <Link href="/all-cows" className="text-emerald-bright hover:underline mt-4 inline-block">
          Browse all cows
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={animal.imageUrl}
            alt={animal.name}
            className="w-full h-96 object-cover rounded-xl"
          />
          {animal.status === "sold" && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
              SOLD
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-emerald-deep">{animal.name}</h1>
          <p className="text-gray-500 mt-1">
            {animal.breed} &middot; {animal.type === "cow" ? "Cow" : "Buffalo"}
          </p>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-gold text-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= Math.round(averageRating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Age</span>
              <p className="font-medium">{animal.age} months</p>
            </div>
            <div>
              <span className="text-gray-500">Weight</span>
              <p className="font-medium">{animal.weight} kg</p>
            </div>
            <div>
              <span className="text-gray-500">Color</span>
              <p className="font-medium">{animal.color || "N/A"}</p>
            </div>
            <div>
              <span className="text-gray-500">Status</span>
              <p className="font-medium capitalize">{animal.status}</p>
            </div>
          </div>

          <p className="text-2xl font-bold text-gold mt-6">
            ৳{animal.price.toLocaleString()}
          </p>

          <p className="text-gray-600 mt-4 leading-relaxed">{animal.description}</p>

          {animal.status === "available" && (
            <button
              onClick={handleBuy}
              disabled={buying}
              className="mt-6 w-full sm:w-auto px-8 py-3 bg-emerald-deep hover:bg-emerald-bright text-white font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              {buying ? "Placing order..." : "Buy Now"}
            </button>
          )}

          {animal.status === "sold" && (
            <p className="mt-6 text-red-500 font-medium">This animal has been sold.</p>
          )}

          <div className="mt-6 text-sm text-gray-500">
            <p>Seller ID: {animal.sellerId}</p>
          </div>
        </div>
      </div>

      {/* Related Animals */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-emerald-deep mb-6">Related Animals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((a) => (
              <AnimalCard key={a._id} animal={a} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-emerald-deep mb-6">Customer Reviews</h2>

        {reviewCount > 0 && (
          <div className="bg-sand rounded-xl p-6 mb-6 flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-deep">{averageRating.toFixed(1)}</p>
              <div className="flex text-gold text-lg mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= Math.round(averageRating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review this animal!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-gold text-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("en-BD")}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
