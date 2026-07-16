"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (error) {
      toast.error(error.message || "Invalid email or password.");
      return;
    }

    toast.success("Login successful!");
    router.push("/");
  } catch (err) {
    console.error("Login Error:", err);

    toast.error(
      err instanceof Error
        ? err.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const handleDemoLogin = async () => {
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email: "arakash022@gmail.com",
      password: "12345678",
      rememberMe: true,
    });
    if (error) {
      toast.error(error.message || "login failed");
      setLoading(false);
      return;
    }

    toast.success("Login successful!");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Peyaraful Farm</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-gray-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <hr className="flex-1 border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            Demo Login (user)
          </button>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-green-700 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
