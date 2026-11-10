"use client";

import { useState, useRef, useEffect } from "react";
import { ROOM_CATEGORIES, RoomCategoryType } from "@/lib/hotelData";

interface HeroSectionProps {
  destination: string;
  setDestination: (d: string) => void;
  travelers: number;
  setTravelers: (t: number) => void;
  nights: number;
  setNights: (n: number) => void;
  checkInDate: string;
  setCheckInDate: (d: string) => void;
  roomCategory: RoomCategoryType;
  setRoomCategory: (c: RoomCategoryType) => void;
  roomsCount: number;
  setRoomsCount: (r: number) => void;
  travelStyle: "Budget" | "Comfort" | "Luxury";
  setTravelStyle: (s: "Budget" | "Comfort" | "Luxury") => void;
}

const BANGLADESH_DESTINATIONS = [
  { name: "Cox's Bazar", division: "Chittagong Coast", icon: "beach_access" },
  { name: "Sajek Valley", division: "Rangamati Hills", icon: "filter_drama" },
  { name: "Sreemangal", division: "Sylhet Tea Capital", icon: "forest" },
  { name: "Saint Martin's", division: "Bay of Bengal Coral Island", icon: "water" },
  { name: "Bandarban", division: "Chittagong Hill Tracts", icon: "terrain" },
  { name: "Sundarbans", division: "Khulna Mangrove Forest", icon: "pets" }
];

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatDateRange(startDateStr: string, nightsCount: number): string {
  try {
    const [year, month, day] = startDateStr.split("-").map(Number);
    const start = new Date(Date.UTC(year, month - 1, day));
    const end = new Date(Date.UTC(year, month - 1, day + nightsCount));
    const fmt = (d: Date) => `${SHORT_MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
    return `${fmt(start)} – ${fmt(end)}`;
  } catch {
    return "Nov 14 – Nov 18";
  }
}

function getCheckoutDateString(startDateStr: string, nightsCount: number): string {
  try {
    const [year, month, day] = startDateStr.split("-").map(Number);
    const end = new Date(year, month - 1, day + nightsCount);
    const y = end.getFullYear();
    const m = String(end.getMonth() + 1).padStart(2, "0");
    const d = String(end.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  } catch {
    return "2026-11-18";
  }
}

export default function HeroSection({
  destination,
  setDestination,
  travelers,
  setTravelers,
  nights,
  setNights,
  checkInDate,
  setCheckInDate,
  roomCategory,
  setRoomCategory,
  roomsCount,
  setRoomsCount,
  travelStyle,
  setTravelStyle
}: HeroSectionProps) {
  const [activePopover, setActivePopover] = useState<
    "destination" | "dates" | "party" | "budget" | null
  >(null);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentRoomCategoryObj =
    ROOM_CATEGORIES.find((c) => c.id === roomCategory) || ROOM_CATEGORIES[0];

  const handleCheckoutDateChange = (newCheckOutStr: string) => {
    try {
      const [y1, m1, d1] = checkInDate.split("-").map(Number);
      const [y2, m2, d2] = newCheckOutStr.split("-").map(Number);
      const start = new Date(y1, m1 - 1, d1);
      const end = new Date(y2, m2 - 1, d2);
      const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 1 && diffDays <= 30) {
        setNights(diffDays);
      }
    } catch {
      // ignore invalid date
    }
  };

  // Handlers for Party & Room Setup
  const handleDecreaseTravelers = () => {
    const nextTravelers = Math.max(1, travelers - 1);
    setTravelers(nextTravelers);
    const neededRooms = Math.max(1, Math.ceil(nextTravelers / currentRoomCategoryObj.maxGuests));
    setRoomsCount(neededRooms);
  };

  const handleIncreaseTravelers = () => {
    const nextTravelers = Math.min(20, travelers + 1);
    setTravelers(nextTravelers);
    const neededRooms = Math.max(1, Math.ceil(nextTravelers / currentRoomCategoryObj.maxGuests));
    setRoomsCount(neededRooms);
  };

  const handleDecreaseRooms = () => {
    const nextRooms = Math.max(1, roomsCount - 1);
    setRoomsCount(nextRooms);
    const maxAllowedGuests = nextRooms * currentRoomCategoryObj.maxGuests;
    if (travelers > maxAllowedGuests) {
      setTravelers(maxAllowedGuests);
    }
  };

  const handleIncreaseRooms = () => {
    const nextRooms = Math.min(10, roomsCount + 1);
    setRoomsCount(nextRooms);
  };

  const budgetLabels: Record<"Budget" | "Comfort" | "Luxury", string> = {
    Budget: "Backpacker (৳2,500/day)",
    Comfort: "Mid-range (৳6,000/day)",
    Luxury: "Premium Comfort (৳12,000/day)"
  };

  return (
    <section id="discover" className="relative w-full overflow-visible bg-[#F8F9FF] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-20">
      {/* Living Decorative Gradient Blobs (clipped to prevent horizontal overflow on mobile) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1100px] max-w-[150vw] h-[550px] bg-gradient-to-b from-[#9CF2E8]/20 via-[#E6EEFF]/40 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-40 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#FFDCC3]/20 rounded-full blur-3xl" />
        <div className="absolute top-80 left-12 w-64 sm:w-80 h-64 sm:h-80 bg-[#95F8A7]/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 flex flex-col items-center">
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
            Bangladesh&apos;s first algorithmic travel itinerary & transparent multi-modal price engine. We cross-verify coach operators, railway slots, and local transport so you explore without financial surprises.
          </p>
        </div>

        {/* Quick Planner & Unified Search Widget (All 4 Fields Clickable & Interactive) */}
        <div
          ref={widgetRef}
          className="w-full max-w-5xl bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 relative z-30"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-stretch">
            {/* 1. Destination Field (Clickable Dropdown + Input) */}
            <div className="lg:col-span-3 relative">
              <div
                onClick={() => setActivePopover(activePopover === "destination" ? null : "destination")}
                className={`h-full bg-[#EFF4FF] hover:bg-[#E4ECFF] rounded-xl p-3 flex flex-col justify-center transition-all cursor-pointer border ${
                  activePopover === "destination"
                    ? "border-[#005C55] ring-2 ring-[#005C55]/20 bg-[#E6EEFF]"
                    : "border-transparent"
                }`}
              >
                <span className="text-[11px] font-bold text-[#3E4947] flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#005C55] text-sm">location_on</span>
                    Destination in Bangladesh
                  </span>
                  <span className="material-symbols-outlined text-xs text-gray-500">expand_more</span>
                </span>
                <div className="flex items-center justify-between pt-1">
                  <input
                    id="destinationInput"
                    type="text"
                    value={destination}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopover("destination");
                    }}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setActivePopover("destination");
                    }}
                    placeholder="Choose destination..."
                    className="bg-transparent text-sm sm:text-base font-bold text-[#121C2A] focus:outline-hidden w-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Destination Popover Menu */}
              {activePopover === "destination" && (
                <div className="absolute left-0 top-full mt-2 w-full sm:w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Select Destination
                  </div>
                  {BANGLADESH_DESTINATIONS.map((d) => {
                    const isSelected = destination.toLowerCase() === d.name.toLowerCase();
                    return (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => {
                          setDestination(d.name);
                          setActivePopover(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#9CF2E8]/40 text-[#005C55] font-bold"
                            : "hover:bg-[#EFF4FF] text-[#121C2A]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-base text-[#005C55]">{d.icon}</span>
                          <div>
                            <div className="text-xs font-bold">{d.name}</div>
                            <div className="text-[10px] text-gray-500">{d.division}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-sm text-[#005C55]">check_circle</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Travel Window (Clickable Date & Nights Selector) */}
            <div className="lg:col-span-3 relative">
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === "dates" ? null : "dates")}
                className={`w-full h-full text-left bg-[#EFF4FF] hover:bg-[#E4ECFF] rounded-xl p-3 flex flex-col justify-center transition-all cursor-pointer border ${
                  activePopover === "dates"
                    ? "border-[#005C55] ring-2 ring-[#005C55]/20 bg-[#E6EEFF]"
                    : "border-transparent"
                }`}
              >
                <span className="text-[11px] font-bold text-[#3E4947] flex items-center justify-between uppercase tracking-wider w-full">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#005C55] text-sm">calendar_month</span>
                    Travel Window
                  </span>
                  <span className="material-symbols-outlined text-xs text-gray-500">edit_calendar</span>
                </span>
                <div className="flex items-center justify-between pt-1 w-full gap-1">
                  <span className="text-sm sm:text-base font-bold text-[#121C2A] truncate">
                    {formatDateRange(checkInDate, nights)}
                  </span>
                  <span className="text-xs font-bold text-[#005C55] bg-[#9CF2E8]/70 px-2 py-0.5 rounded-md shrink-0">
                    {nights} {nights === 1 ? "Night" : "Nights"}
                  </span>
                </div>
              </button>

              {/* Travel Window Popover */}
              {activePopover === "dates" && (
                <div className="absolute left-0 md:left-auto md:right-0 lg:left-0 top-full mt-2 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3.5 sm:p-4 z-50 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 gap-1">
                    <span className="text-xs font-extrabold text-[#121C2A]">Customize Travel Dates</span>
                    <span className="text-[11px] font-bold text-[#005C55] bg-[#9CF2E8]/50 px-2 py-0.5 rounded-full shrink-0">
                      {nights} Nights ({nights + 1} Days)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Check-In Date
                      </label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => e.target.value && setCheckInDate(e.target.value)}
                        className="w-full text-xs font-bold p-2 rounded-lg border border-gray-200 bg-[#EFF4FF] text-[#121C2A] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Check-Out Date
                      </label>
                      <input
                        type="date"
                        value={getCheckoutDateString(checkInDate, nights)}
                        min={getCheckoutDateString(checkInDate, 1)}
                        onChange={(e) => handleCheckoutDateChange(e.target.value)}
                        className="w-full text-xs font-bold p-2 rounded-lg border border-gray-200 bg-[#EFF4FF] text-[#121C2A] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Direct Nights Stepper */}
                  <div className="flex items-center justify-between bg-[#EFF4FF] p-2.5 rounded-xl">
                    <span className="text-xs font-bold text-[#121C2A]">Stay Duration (Nights)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNights(Math.max(1, nights - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 font-extrabold text-sm text-[#121C2A] flex items-center justify-center cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold text-[#005C55]">{nights}</span>
                      <button
                        type="button"
                        onClick={() => setNights(Math.min(14, nights + 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 font-extrabold text-sm text-[#121C2A] flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {[1, 2, 3, 4, 5, 7].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNights(n)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                          nights === n
                            ? "bg-[#005C55] text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {n} {n === 1 ? "Night" : "Nights"}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePopover(null)}
                    className="w-full py-2 rounded-xl bg-[#005C55] text-white text-xs font-bold hover:bg-[#0F766E] cursor-pointer"
                  >
                    Apply Travel Window
                  </button>
                </div>
              )}
            </div>

            {/* 3. Party & Room Category (Clickable Guests + Rooms + Category Selector) */}
            <div className="lg:col-span-3 relative">
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === "party" ? null : "party")}
                className={`w-full h-full text-left bg-[#EFF4FF] hover:bg-[#E4ECFF] rounded-xl p-3 flex flex-col justify-center transition-all cursor-pointer border ${
                  activePopover === "party"
                    ? "border-[#005C55] ring-2 ring-[#005C55]/20 bg-[#E6EEFF]"
                    : "border-transparent"
                }`}
              >
                <span className="text-[11px] font-bold text-[#3E4947] flex items-center justify-between uppercase tracking-wider w-full">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#005C55] text-sm">group</span>
                    Party & Room
                  </span>
                  <span className="material-symbols-outlined text-xs text-gray-500">expand_more</span>
                </span>
                <div className="pt-1 flex items-center justify-between gap-1 w-full">
                  <span className="text-sm font-bold text-[#121C2A] truncate">
                    {travelers} {travelers === 1 ? "Adult" : "Adults"} • {roomsCount} {roomsCount === 1 ? "Room" : "Rooms"}
                  </span>
                  <span className="text-[10px] font-bold text-[#005C55] bg-[#9CF2E8]/60 px-1.5 py-0.5 rounded shrink-0">
                    {currentRoomCategoryObj.shortLabel}
                  </span>
                </div>
              </button>

              {/* Party & Room Popover */}
              {activePopover === "party" && (
                <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-2 w-full sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-200 p-3.5 sm:p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 gap-1">
                    <span className="text-xs font-extrabold text-[#121C2A]">Travelers & Room Setup</span>
                    <span className="text-[10px] font-bold text-[#005F29] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                      {travelers} Guests • {roomsCount} {roomsCount === 1 ? "Room" : "Rooms"}
                    </span>
                  </div>

                  {/* Travelers Count */}
                  <div className="flex items-center justify-between bg-[#EFF4FF] p-2.5 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-[#121C2A] block">Adults / Travelers</span>
                      <span className="text-[10px] text-gray-500">Total people on this trip</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDecreaseTravelers}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 font-extrabold text-sm text-[#121C2A] flex items-center justify-center cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-xs font-extrabold text-[#005C55]">{travelers}</span>
                      <button
                        type="button"
                        onClick={handleIncreaseTravelers}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 font-extrabold text-sm text-[#121C2A] flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Room Category Selection (All 5 visible, no numbers) */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                      Preferred Room Category
                    </label>
                    <div className="space-y-1.5">
                      {ROOM_CATEGORIES.map((cat) => {
                        const isSelected = roomCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setRoomCategory(cat.id)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-[#9CF2E8]/40 border-[#005C55] text-[#121C2A] ring-1 ring-[#005C55]"
                                : "bg-gray-50/70 border-gray-200 hover:bg-[#EFF4FF] text-gray-700"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-xs text-[#121C2A]">{cat.fullLabel}</div>
                              <div className="text-[10px] text-gray-500">{cat.description}</div>
                            </div>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded shrink-0 ml-2 ${
                                isSelected
                                  ? "bg-[#005C55] text-white"
                                  : "bg-white text-[#005C55] border border-gray-200"
                              }`}
                            >
                              {cat.maxGuests}P
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rooms Count Stepper */}
                  <div className="flex items-center justify-between bg-[#EFF4FF] p-2.5 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-[#121C2A] block">Number of Rooms</span>
                      <span className="text-[10px] text-gray-500">
                        {currentRoomCategoryObj.shortLabel} • Max {currentRoomCategoryObj.maxGuests} guests/room
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDecreaseRooms}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 font-extrabold text-sm text-[#121C2A] flex items-center justify-center cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-xs font-extrabold text-[#005C55]">{roomsCount}</span>
                      <button
                        type="button"
                        onClick={handleIncreaseRooms}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 font-extrabold text-sm text-[#121C2A] flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePopover(null)}
                    className="w-full py-2.5 rounded-xl bg-[#005C55] text-white text-xs font-bold hover:bg-[#0F766E] cursor-pointer"
                  >
                    Apply Party & Rooms
                  </button>
                </div>
              )}
            </div>

            {/* 4. Budget Tier (Clickable Selector) */}
            <div className="lg:col-span-3 relative">
              <div
                onClick={() => setActivePopover(activePopover === "budget" ? null : "budget")}
                className={`h-full bg-[#EFF4FF] hover:bg-[#E4ECFF] rounded-xl p-3 flex flex-col justify-center transition-all cursor-pointer border ${
                  activePopover === "budget"
                    ? "border-[#005C55] ring-2 ring-[#005C55]/20 bg-[#E6EEFF]"
                    : "border-transparent"
                }`}
              >
                <span className="text-[11px] font-bold text-[#3E4947] flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#904D00] text-sm">payments</span>
                    Est. Daily Budget
                  </span>
                  <span className="material-symbols-outlined text-xs text-gray-500">expand_more</span>
                </span>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#121C2A] truncate">
                    {budgetLabels[travelStyle]}
                  </span>
                </div>
              </div>

              {/* Budget Tier Popover */}
              {activePopover === "budget" && (
                <div className="absolute right-0 top-full mt-2 w-full sm:w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Choose Comfort & Meal Tier
                  </div>
                  {(
                    [
                      {
                        tier: "Budget" as const,
                        title: "Backpacker (৳2,500/day)",
                        desc: "Economy stays, Non-AC/standard transit & local dining"
                      },
                      {
                        tier: "Comfort" as const,
                        title: "Mid-range (৳6,000/day)",
                        desc: "3–4★ AC hotels, AC Express train/bus & standard meals"
                      },
                      {
                        tier: "Luxury" as const,
                        title: "Premium Comfort (৳12,000/day)",
                        desc: "5★ beachfront resorts, flights/sleeper coach & fine dining"
                      }
                    ]
                  ).map((item) => {
                    const isSelected = travelStyle === item.tier;
                    return (
                      <button
                        key={item.tier}
                        type="button"
                        onClick={() => {
                          setTravelStyle(item.tier);
                          setActivePopover(null);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors cursor-pointer flex items-start justify-between gap-2 ${
                          isSelected
                            ? "bg-[#9CF2E8]/40 text-[#005C55]"
                            : "hover:bg-[#EFF4FF] text-[#121C2A]"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{item.title}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-sm text-[#005C55] shrink-0 mt-0.5">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Popular Route Autocomplete Chips & CTA Button */}
            <div className="lg:col-span-12 flex flex-col lg:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto text-xs">
                <span className="font-semibold text-gray-500">Popular:</span>
                {[
                  { label: "Cox's Bazar", icon: "near_me" },
                  { label: "Sajek Valley", icon: "filter_drama" },
                  { label: "Sreemangal", icon: "forest" },
                  { label: "Saint Martin's", icon: "water" },
                  { label: "Bandarban", icon: "terrain" }
                ].map((chip) => {
                  const isActive = destination.toLowerCase() === chip.label.toLowerCase();
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setDestination(chip.label)}
                      className={`px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1 cursor-pointer border ${
                        isActive
                          ? "bg-[#9CF2E8] text-[#00201D] border-[#005C55] font-bold"
                          : "bg-[#EFF4FF] hover:bg-[#DEE9FC] text-[#121C2A] border-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs text-[#005C55]">{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              <a
                href="#planner"
                onClick={() => setActivePopover(null)}
                className="w-full lg:w-auto bg-[#005C55] hover:bg-[#0F766E] text-white transition-all px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#005C55]/20 text-center"
              >
                <span>Generate AI Itinerary & Compare</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
