"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/all-cows", label: "All Cows" },
  { href: "/about", label: "About" },
];

const guestLinks = [
  { href: "/auth/login", label: "Login" },
  { href: "/auth/register", label: "Register" },
];

const userLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/my-orders", label: "My Orders" },
];

export default function Navbar() {
  const router = useRouter();
  

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // const { data: session, isPending } = useSession();
const { data: session } = authClient.useSession();
  const user = session?.user;

  const links = user
    ? [...publicLinks, ...userLinks]
    : [...publicLinks, ...guestLinks];
    // console.log('kdk,',user);

  const handleLogout = async () => {
    router.refresh();
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Failed to sign out.");
        return;
      }

      toast.success("Signed out successfully.");

      setMenuOpen(false);

      router.replace("/auth/login");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  

  return (
    <nav className="sticky top-0 z-50 bg-emerald-deep text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            Peyaraful Farm
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                <span className="text-sm font-semibold text-gold">
                  Hi, {user.name?.split(" ")[0] || "User"}
                </span>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-sm font-medium hover:text-gold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-md hover:bg-emerald-bright transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-deep border-t border-emerald-bright">
          <div className="px-4 py-3 space-y-2">
            {user && (
              <div className="pb-2 border-b border-emerald-bright">
                <p className="text-sm text-gray-300">Signed in as</p>
                <p className="font-semibold text-gold">
                  {user.name || user.email}
                </p>
              </div>
            )}

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="block w-full text-left py-2 text-sm font-medium hover:text-gold transition-colors cursor-pointer disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}