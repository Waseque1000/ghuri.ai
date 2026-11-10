"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface NavbarProps {
  activeTab?: string;
}

export default function Navbar({ activeTab }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { name: "Destinations", href: "/#discover", icon: "explore" },
    { name: "Hotels", href: "/hotels", icon: "hotel" },
    { name: "Transport", href: "/transport", icon: "directions_bus" },
    { name: "Trip Planner", href: "/#planner", icon: "auto_awesome" },
    { name: "Budget Engine", href: "/#budget", icon: "calculate" }
  ];

  const isLinkActive = (href: string, name: string) => {
    if (activeTab && activeTab.toLowerCase() === name.toLowerCase()) return true;
    if (href === "/hotels" && pathname === "/hotels") return true;
    if (href === "/transport" && pathname === "/transport") return true;
    if (href === "/dashboard" && pathname === "/dashboard") return true;
    return false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/80"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-100/60"
        }`}
      >
        <div className="h-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#005C55] to-[#0F766E] flex items-center justify-center text-white shadow-sm shadow-[#005C55]/25 transition-transform group-hover:scale-105">
              <span
                className="material-symbols-outlined text-lg sm:text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                explore
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#121C2A]">
                  Ghuri<span className="text-[#005C55]">.ai</span>
                </span>
                <span className="text-[10px] font-bold text-[#005C55] bg-[#9CF2E8]/40 px-1.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                  Bangladesh
                </span>
              </div>
              <span className="text-[10px] text-gray-500 font-medium tracking-tight hidden sm:block">
                Transparent Travel Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-50/80 border border-gray-100 px-2 py-1 rounded-full">
            {navLinks.map((item) => {
              const active = isLinkActive(item.href, item.name);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#005C55] text-white shadow-xs font-bold"
                      : "text-gray-600 hover:text-[#005C55] hover:bg-white hover:shadow-xs"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action (User + Dashboard + Plan Trip) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {currentUser && (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 bg-[#EFF4FF] hover:bg-[#DEE9FC] border border-[#DEE9FC] px-3 py-1.5 rounded-full transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#005F29]" />
                <span className="text-xs font-bold text-[#121C2A] max-w-[130px] truncate">
                  {currentUser.displayName || currentUser.email?.split("@")[0] || "Traveler"}
                </span>
              </Link>
            )}

            <Link
              href="/dashboard"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                pathname === "/dashboard"
                  ? "bg-[#9CF2E8] text-[#00201D] border-[#005C55]"
                  : "bg-white text-[#005C55] hover:bg-[#EFF4FF] border-[#005C55]/30"
              }`}
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/login"
              className="bg-[#005C55] hover:bg-[#0F766E] text-white px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 shrink-0"
            >
              <span>Plan Trip</span>
              <span className="material-symbols-outlined text-sm hidden sm:inline-block">
                arrow_forward
              </span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-[#005C55] hover:bg-gray-100 transition-colors focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-xl px-4 sm:px-5 py-4 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((item) => {
              const active = isLinkActive(item.href, item.name);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? "bg-[#005C55] text-white"
                      : "text-gray-800 hover:text-[#005C55] hover:bg-[#EFF4FF]"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg ${
                      active ? "text-white" : "text-[#005C55]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Mobile Dashboard & Plan Trip Actions */}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {currentUser && (
                <div className="flex items-center gap-2 bg-[#EFF4FF] p-3 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-[#005F29] shrink-0" />
                  <div className="text-xs font-bold text-[#121C2A] truncate">
                    {currentUser.displayName || currentUser.email}
                  </div>
                </div>
              )}

              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#EFF4FF] hover:bg-[#DEE9FC] text-[#005C55] border border-[#005C55]/30 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                <span>Tour Plan Dashboard</span>
              </Link>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#005C55] hover:bg-[#0F766E] text-white py-2.5 rounded-xl text-xs font-bold transition-all text-center shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Plan Trip</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-16 bg-black/25 backdrop-blur-xs z-40 lg:hidden"
        />
      )}
    </>
  );
}
