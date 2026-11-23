"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // <-- Import icons

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
    
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* LOGO */}
            <div className="flex-shrink-0 flex items-center z-50">
              <Link href="/">
                <img src="/spotless.png" alt="Spotless" className="h-10 w-auto object-contain" />


              </Link>
            </div>

            {/* DESKTOP LINKS (Hidden on Mobile) */}
            <div className="hidden md:flex space-x-2 sm:space-x-6 items-center">
              <Link href="/" className="text-gray-600 hover:text-black px-2 py-2 text-sm font-medium transition-colors">
                Services
              </Link>
              <Link href="/locations" className="text-gray-600 hover:text-black px-2 py-2 text-sm font-medium transition-colors">
                Locations
              </Link>
              
              {isLoggedIn && (
                <>
                  <Link href="/my-bookings" className="text-gray-600 hover:text-black px-2 py-2 text-sm font-medium transition-colors">
                    My Bookings
                  </Link>
                  <Link href="/profile" className="text-gray-600 hover:text-black px-2 py-2 text-sm font-medium transition-colors">
                    Profile
                  </Link>
                </>
              )}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-black px-4 py-2 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* MOBILE HAMBURGER BUTTON (Visible on Mobile) */}
            <div className="flex md:hidden items-center z-50">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-black focus:outline-none p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-all duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 ${
          isMobileMenuOpen 
            ? "opacity-100 translate-y-0 visible" 
            : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <div className="flex flex-col space-y-6 text-center mt-8">
          <Link 
            href="/" 
            className="text-2xl font-heading font-medium text-gray-800 hover:text-black transition-colors"
          >
            Services
          </Link>
          <Link 
            href="/locations" 
            className="text-2xl font-heading font-medium text-gray-800 hover:text-black transition-colors"
          >
            Locations
          </Link>
          
          {isLoggedIn && (
            <>
              <Link 
                href="/my-bookings" 
                className="text-2xl font-heading font-medium text-gray-800 hover:text-black transition-colors"
              >
                My Bookings
              </Link>
              <Link 
                href="/profile" 
                className="text-2xl font-heading font-medium text-gray-800 hover:text-black transition-colors"
              >
                Profile
              </Link>
            </>
          )}

          <div className="pt-6 border-t border-gray-100">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full text-black px-6 py-4 rounded-full text-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full bg-black text-white px-6 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}