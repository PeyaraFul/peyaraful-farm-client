"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const breedsByType: Record<string, string[]> = {
  cow: [
    "Holstein Friesian", "Jersey", "Sahiwal", "Red Chittagong",
    "Bangladesh Indigenous", "Crossbreed", "Gir", "Hallikar",
  ],
  buffalo: [
    "Murrah", "Nili-Ravi", "Mehsana", "Jafarabadi",
    "Bottles", "Crossbreed", "Local", "Other",
  ],
};

export default function AddItemPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAdmin = (user as Record<string, unknown>)?.role === "admin";

  const [name, setName] = useState("");
  const [type, setType] = useState<"cow" | "buffalo">("cow");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Access denied. Admin only.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !breed.trim() || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/animals", {
        name: name.trim(),
        type,
        breed: breed.trim(),
        age: age ? parseInt(age, 10) : 0,
        weight: weight ? parseFloat(weight) : 0,
        price: priceNum,
        color: color.trim(),
        imageUrl: imageUrl.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
      });
      toast.success("Animal added successfully!");
      router.push("/dashboard/admin/manage-items");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to add animal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-emerald-deep mb-6">Add New Animal</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Tara"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm"
          />
        </div>

        {/* Type + Breed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as "cow" | "buffalo");
                setBreed("");
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm"
            >
              <option value="cow">Cow</option>
              <option value="buffalo">Buffalo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breed <span className="text-red-500">*</span>
            </label>
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm"
            >
              <option value="">Select breed</option>
              {breedsByType[type].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Age + Weight + Color */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age (months)
            </label>
            <input
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              min={0}
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Black & White"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (BDT) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">৳</span>
            <input
              type="number"
              min={0}
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="0"
              className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm"
          />
          {imageUrl && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief summary (shown on card)"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the animal's health, milk yield, temperament..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-bright focus:border-transparent outline-none transition text-sm resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-emerald-deep hover:bg-emerald-bright text-white font-semibold rounded-lg transition disabled:opacity-50 text-sm cursor-pointer"
          >
            {submitting ? "Adding..." : "Add Animal"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
