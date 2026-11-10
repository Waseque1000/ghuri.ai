"use client";

import { useState } from "react";
import Link from "next/link";
import { POPULAR_DESTINATIONS } from "@/lib/data";

export default function DestinationDiscovery() {
  const [selectedFilter, setSelectedFilter] = useState("All Regions");

  const regions = ["All Regions", "Chittagong Coast & Hills", "Sylhet Division", "Coral Islands"];

  const filtered = POPULAR_DESTINATIONS.filter((d) => {
    if (selectedFilter === "All Regions") return true;
    if (selectedFilter === "Chittagong Coast & Hills") return d.division.includes("Chittagong");
    if (selectedFilter === "Sylhet Division") return d.division === "Sylhet";
    if (selectedFilter === "Coral Islands") return d.name.includes("Saint Martin");
    return true;
  });

  return (
    <>
      {/* 3 Trust Pillars matching Stitch Screen */}
      <section className="w-full bg-[#EFF4FF] py-10 sm:py-14 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-xs border border-[#E5E7EB] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#9CF2E8]/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-[#005C55] mb-4">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    sync_alt
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <h3 className="font-bold text-base text-[#121C2A]">Verified Published Rates</h3>
                  <span className="material-symbols-outlined text-[#005F29] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <p className="text-xs text-[#3E4947] leading-relaxed mb-4">
                  Direct fare records synchronizing hourly across Green Line, Shohagh Paribahan, Bangladesh Railway e-Ticketing, and Biman Bangladesh domestic flights.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#EFF4FF] p-2.5 rounded-lg text-xs font-semibold text-[#121C2A]">
                <span className="material-symbols-outlined text-[#005F29] text-sm">schedule</span>
                <span>Refreshed 24m ago • Zero scrap fees</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-xs border border-[#E5E7EB] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFDCC3]/30 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-[#904D00] mb-4">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    calculate
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <h3 className="font-bold text-base text-[#121C2A]">Deterministic Budget Engine</h3>
                  <span className="material-symbols-outlined text-[#005F29] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <p className="text-xs text-[#3E4947] leading-relaxed mb-4">
                  Rigorous unit-economics separating indivisible shared assets (Chander Gari rentals, 2-bed resort rooms) from per-person meals, boat tariffs, and an automatic 10% contingency buffer.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#EFF4FF] p-2.5 rounded-lg text-xs font-semibold text-[#121C2A]">
                <span className="material-symbols-outlined text-[#904D00] text-sm">savings</span>
                <span>Includes 10% safety margin</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-xs border border-[#E5E7EB] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#95F8A7]/30 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-[#005F29] mb-4">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    domain_verification
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <h3 className="font-bold text-base text-[#121C2A]">Zero Hallucinated Stays</h3>
                  <span className="material-symbols-outlined text-[#005F29] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shield
                  </span>
                </div>
                <p className="text-xs text-[#3E4947] leading-relaxed mb-4">
                  No fictional AI suggestions. We cross-reference certified resort phone desks, confirmed OTA inventory, and registered army/police checkpoint permits for sensitive hill-tract journeys.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#EFF4FF] p-2.5 rounded-lg text-xs font-semibold text-[#121C2A]">
                <span className="material-symbols-outlined text-[#005C55] text-sm">verified</span>
                <span>Manual spot-check audit active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid matching Stitch Screen */}
      <section className="w-full bg-[#F8F9FF] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] text-[#005C55] uppercase font-bold tracking-widest bg-[#9CF2E8]/40 px-2.5 py-0.5 rounded-full">
                  Handcrafted Curations
                </span>
                <span className="text-xs text-gray-500">• Season 2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#121C2A] tracking-tight">
                Iconic Escapes Across Bangladesh
              </h2>
              <p className="text-xs sm:text-sm text-[#3E4947] max-w-xl mt-1">
                Live multi-modal schedules, seasonality guides, and transparent budget footprints calculated for both sole backpackers and families.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#EFF4FF] p-1.5 rounded-xl self-start md:self-auto overflow-x-auto max-w-full scrollbar-none pb-1.5 md:pb-1.5">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedFilter(reg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedFilter === reg
                      ? "bg-[#FFFFFF] text-[#121C2A] shadow-xs"
                      : "text-[#3E4947] hover:bg-[#DEE9FC]"
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* 6 Destination Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest) => (
              <div
                key={dest.id}
                className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-[#FFFFFF]/90 backdrop-blur-md text-[11px] font-bold text-[#005F29] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Verified Transit
                    </span>
                    <span className="bg-[#FE932C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Popular
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#9CF2E8] font-semibold block">
                        {dest.division}
                      </span>
                      <h3 className="text-xl font-bold">{dest.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold">
                      <span className="material-symbols-outlined text-amber-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span>{dest.rating}</span>
                      <span className="opacity-80 font-normal">({dest.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#3E4947] line-clamp-2 leading-relaxed mb-3">
                      {dest.description}
                    </p>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {dest.highlights.slice(0, 4).map((h, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-[#EFF4FF] text-[#3E4947] px-2.5 py-0.5 rounded-full font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Metadata specs */}
                    <div className="grid grid-cols-2 gap-2 bg-[#EFF4FF] p-3 rounded-xl">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                          Est. Daily Budget
                        </span>
                        <span className="text-xs font-bold text-[#005C55]">
                          ৳{dest.estimatedDailyBudget.min.toLocaleString()} – ৳{dest.estimatedDailyBudget.max.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold block">
                          Best Window
                        </span>
                        <span className="text-xs font-semibold text-[#121C2A]">
                          Nov – Mar (Dry)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action bottom */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-[#3E4947]">
                      <span className="material-symbols-outlined text-[#005C55] text-base">directions_bus</span>
                      <span className="font-medium">Direct AC Transport</span>
                    </div>
                    <Link
                      href="/login"
                      className="bg-[#005C55] text-white hover:bg-[#0F766E] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span>Plan Trip</span>
                      <span className="material-symbols-outlined text-sm">arrow_outward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
