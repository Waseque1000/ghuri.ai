"use client";

import { useState } from "react";

export default function HeroSection() {
  const [destination, setDestination] = useState("Cox's Bazar");
  const [budgetTier, setBudgetTier] = useState("mid");

  return (
    <section id="discover" className="relative w-full overflow-hidden bg-[#F8F9FF] pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20">
      {/* Living Decorative Gradient Blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#9CF2E8]/20 via-[#E6EEFF]/40 to-transparent blur-3xl opacity-80 -z-10" />
      <div className="pointer-events-none absolute top-40 right-10 w-96 h-96 bg-[#FFDCC3]/20 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-80 left-12 w-80 h-80 bg-[#95F8A7]/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center">
        {/* Trust Pill Notice */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-1.5 rounded-full shadow-xs mb-6 border border-gray-100 max-w-full">
          <span className="material-symbols-outlined text-[#005C55] text-base shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span className="text-xs font-semibold text-[#121C2A] text-center">
            <span className="hidden sm:inline">100% Transparent Costs: </span>Verified published fares & tariffs
          </span>
          <span className="bg-[#9CF2E8] text-[#00201D] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-0.5">
            No Markups
          </span>
        </div>

        {/* Main Headline Editorial Hierarchy */}
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#121C2A] tracking-tight mb-4 leading-tight">
            Discover more. Plan smarter. <br className="hidden sm:inline" />
            <span className="text-[#005C55] underline decoration-[#FE932C] decoration-wavy decoration-2 underline-offset-8">
              Travel better.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#3E4947] max-w-2xl text-center mb-8 leading-relaxed px-2">
            Bangladesh's first algorithmic travel itinerary & transparent multi-modal price engine. We cross-verify coach operators, railway slots, and local transport so you explore without financial surprises.
          </p>
        </div>

        {/* Quick Planner & Unified Search Widget */}
        <div className="w-full max-w-5xl bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 relative z-20">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center" onSubmit={(e) => e.preventDefault()}>
            {/* Destination Field */}
            <div className="lg:col-span-4 bg-[#EFF4FF] rounded-xl p-3 flex flex-col justify-center transition-colors focus-within:bg-[#E6EEFF]">
              <span className="text-[11px] font-bold text-[#3E4947] flex items-center gap-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[#005C55] text-sm">location_on</span>
                Destination in Bangladesh
              </span>
              <input
                id="destinationInput"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Sajek, Sreemangal, Saint Martin"
                className="bg-transparent text-sm sm:text-base font-bold text-[#121C2A] focus:outline-hidden w-full pt-1"
              />
            </div>

            {/* Travel Window */}
            <div className="lg:col-span-3 bg-[#EFF4FF] rounded-xl p-3 flex flex-col justify-center transition-colors focus-within:bg-[#E6EEFF]">
              <span className="text-[11px] font-bold text-[#3E4947] flex items-center gap-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[#005C55] text-sm">calendar_month</span>
                Travel Window
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm sm:text-base font-bold text-[#121C2A]">Nov 14 – Nov 18</span>
                <span className="text-xs font-bold text-[#005C55] bg-[#9CF2E8]/60 px-2 py-0.5 rounded-md">
                  4 Nights
                </span>
              </div>
            </div>

            {/* Expedition Party */}
            <div className="lg:col-span-2 bg-[#EFF4FF] rounded-xl p-3 flex flex-col justify-center transition-colors focus-within:bg-[#E6EEFF]">
              <span className="text-[11px] font-bold text-[#3E4947] flex items-center gap-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[#005C55] text-sm">group</span>
                Party
              </span>
              <div className="pt-1">
                <span className="text-sm font-bold text-[#121C2A]">2 Adults • 1 Room</span>
              </div>
            </div>

            {/* Budget Tier */}
            <div className="lg:col-span-3 bg-[#EFF4FF] rounded-xl p-3 flex flex-col justify-center transition-colors focus-within:bg-[#E6EEFF]">
              <span className="text-[11px] font-bold text-[#3E4947] flex items-center gap-1 uppercase tracking-wider">
                <span className="material-symbols-outlined text-[#904D00] text-sm">payments</span>
                Est. Daily Budget
              </span>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#121C2A] focus:outline-hidden cursor-pointer pt-1"
              >
                <option value="budget">Backpacker (৳2,500/day)</option>
                <option value="mid">Mid-range (৳6,000/day)</option>
                <option value="premium">Premium Comfort (৳12,000/day)</option>
              </select>
            </div>

            {/* Popular Route Autocomplete Chips & CTA Button */}
            <div className="lg:col-span-12 flex flex-col lg:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto text-xs">
                <span className="font-semibold text-gray-500">Popular:</span>
                {[
                  { label: "Cox's Bazar", icon: "near_me" },
                  { label: "Sajek Valley", icon: "filter_drama" },
                  { label: "Sreemangal", icon: "forest" },
                  { label: "Saint Martin", icon: "water" },
                  { label: "Bandarban", icon: "terrain" }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setDestination(chip.label)}
                    className="bg-[#EFF4FF] hover:bg-[#DEE9FC] text-[#121C2A] px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs text-[#005C55]">{chip.icon}</span>
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>

              <a
                href="#planner"
                className="w-full lg:w-auto bg-[#005C55] hover:bg-[#0F766E] text-white transition-all px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#005C55]/20 text-center"
              >
                <span>Generate AI Itinerary & Compare</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
