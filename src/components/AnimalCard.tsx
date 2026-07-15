import Link from "next/link";

interface Animal {
  _id: string;
  name: string;
  type: "cow" | "buffalo";
  breed: string;
  price: number;
  imageUrl: string;
  status: "available" | "sold";
}

export default function AnimalCard({
  animal,
  averageRating,
  reviewCount,
}: {
  animal: Animal;
  averageRating?: number;
  reviewCount?: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={animal.imageUrl}
          alt={animal.name}
          className="w-full h-full object-cover"
        />
        {animal.status === "sold" && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SOLD
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-emerald-deep">{animal.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {animal.breed} &middot; {animal.type === "cow" ? "Cow" : "Buffalo"}
        </p>
        {averageRating !== undefined && averageRating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-gold text-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.round(averageRating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {averageRating.toFixed(1)}{reviewCount !== undefined ? ` (${reviewCount})` : ""}
            </span>
          </div>
        )}
        <p className="text-lg font-semibold text-gold mt-2">
          ৳{animal.price.toLocaleString()}
        </p>

        <Link
          href={`/animals/${animal._id}`}
          className="mt-3 block w-full text-center bg-emerald-deep hover:bg-emerald-bright text-white text-sm font-medium py-2 rounded-lg transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
