"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scale, Menu, X, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./AuthProvider";


export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/apps/vakilai");
  };

  const navLinks = [
    { href: "/apps/vakilai/dashboard", label: "Dashboard" },
    { href: "/apps/vakilai/mapper", label: "Section Mapper" },
    { href: "/apps/vakilai/summarizer", label: "Summarizer" },
    { href: "/apps/vakilai/petition", label: "Petition Draft" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/apps/vakilai" className="flex items-center gap-2 font-bold text-indigo-700 text-lg">
          <Scale className="w-5 h-5" />
          VakilAI
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {user &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                {user.trial_days_remaining}d trial
              </span>
              <Link
                href="/apps/vakilai/settings"
                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-100"
              >
                <Settings className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/apps/vakilai/login"
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/apps/vakilai/register"
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {user &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          {user ? (
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                {user.trial_days_remaining} days trial remaining
              </span>
              <div className="flex gap-2">
                <Link
                  href="/apps/vakilai/settings"
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <Link
                href="/apps/vakilai/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/apps/vakilai/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center text-sm bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
