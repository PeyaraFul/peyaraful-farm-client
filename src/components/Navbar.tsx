"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";

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
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out!");
    setMenuOpen(false);
    router.push("/");
  };

  const links = user
    ? [...publicLinks, ...userLinks]
    : [...publicLinks, ...guestLinks];

  return (
    <nav className="sticky top-0 z-50 bg-emerald-deep text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Peyaraful Farm
          </Link>

          {/* Desktop nav */}
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
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:text-gold transition-colors cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-emerald-bright transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-deep border-t border-emerald-bright">
          <div className="px-4 py-3 space-y-2">
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
                className="block w-full text-left py-2 text-sm font-medium hover:text-gold transition-colors cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
