"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  activeTab?: string;
}

export default function Navbar({ activeTab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Destinations", href: "#discover", icon: "explore" },
    { name: "Hotels", href: "#hotels", icon: "hotel" },
    { name: "Transport", href: "#transport", icon: "directions_bus" },
    { name: "Trip Planner", href: "#planner", icon: "auto_awesome" },
    { name: "Budget Engine", href: "#budget", icon: "calculate" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/80"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-100/60"
        }`}
      >
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#005C55] to-[#0F766E] flex items-center justify-center text-white shadow-sm shadow-[#005C55]/25 transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                explore
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-xl tracking-tight text-[#121C2A]">
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
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-600 hover:text-[#005C55] hover:bg-white transition-all hover:shadow-xs"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#planner"
              className="bg-[#005C55] hover:bg-[#0F766E] text-white px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 shrink-0"
            >
              <span>Plan Trip</span>
              <span className="material-symbols-outlined text-sm hidden sm:inline-block">arrow_forward</span>
            </a>

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
          <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-xl px-5 py-4 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:text-[#005C55] hover:bg-[#EFF4FF] transition-colors"
              >
                <span className="material-symbols-outlined text-lg text-[#005C55]">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            ))}

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <a
                href="#planner"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#005C55] hover:bg-[#0F766E] text-white py-2.5 rounded-xl text-xs font-bold transition-all text-center shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Start Planning Your Trip</span>
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </a>
              <div className="text-center py-1">
                <span className="text-[11px] font-semibold text-gray-400">
                  🇧🇩 Verified Published Tariffs • Zero Markups
                </span>
              </div>
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
