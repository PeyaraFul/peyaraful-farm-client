"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const pathname = usePathname()
  const { data: session } = authClient.useSession();
  const user = session?.user ;
  const safeImage =
    user?.image && user.image.startsWith("http://")
      ? user.image
      : FaRegUserCircle;

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <RxHamburgerMenu />
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
            </ul>
          </div>
          <div className="font-bold text-xl">Summer<span className="text-orange-400">Store</span></div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/" className={`${
            pathname === "/"
              ? "underline underline-offset-4 font-semibold"
              : ""
          }`}>Home</Link>
            </li>

            <li>
              <Link href="/products" className={`${
            pathname === "/products"
              ? "underline underline-offset-4 font-semibold"
              : ""
          }`}>Products</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link href="/profile">
            {user?.image && user.image.startsWith("http") ? (
              <Image
                src={user.image}
                width={12}
                height={12}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FaRegUserCircle size={35} />
            )}
          </Link>

          {user ? (
            <Link
              href="/login"
              onClick={async () => await authClient.signOut()}
              className="btn mx-3"
            >
              Sign Out
            </Link>
          ) : (
            <Link href="/login" className="btn mx-3">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;