"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAdmin = (user as Record<string, unknown>)?.role === "admin";

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Please log in to view your dashboard.</p>
        <Link href="/auth/login" className="inline-block mt-4 px-6 py-3 bg-emerald-deep text-white rounded-lg hover:bg-emerald-bright transition">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-emerald-deep mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome back, <span className="font-semibold">{user.name || user.email}</span>
        {isAdmin && (
          <span className="ml-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-gold/20 text-gold">
            Admin
          </span>
        )}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/dashboard/my-orders"
          className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold text-emerald-deep mb-2">My Orders</h2>
          <p className="text-gray-500 text-sm">View and manage your orders.</p>
        </Link>

        <Link
          href="/dashboard/my-orders"
          className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold text-emerald-deep mb-2">My Favorites</h2>
          <p className="text-gray-500 text-sm">See your saved animals.</p>
        </Link>

        {isAdmin && (
          <>
            <Link
              href="/dashboard/admin/add-item"
              className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-emerald-deep mb-2">Add Animal</h2>
              <p className="text-gray-500 text-sm">List a new cow or buffalo for sale.</p>
            </Link>

            <Link
              href="/dashboard/admin/manage-items"
              className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-emerald-deep mb-2">Manage Animals</h2>
              <p className="text-gray-500 text-sm">Edit or remove existing listings.</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
