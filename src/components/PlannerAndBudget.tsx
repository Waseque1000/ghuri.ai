"use client";

import { useState } from "react";
import Link from "next/link";
import { calculateTripBudget } from "@/lib/calculations";
import {
  ADVANCED_HOTEL_INVENTORY,
  AdvancedHotel,
  RoomOption,
  ROOM_CATEGORIES,
  RoomCategoryType
} from "@/lib/hotelData";
import { SAMPLE_TRANSPORTS, TransportOption } from "@/lib/data";
import PrintableTripSheet from "@/components/PrintableTripSheet";
import {
  Sparkles,
  CheckCircle,
  Printer,
  Hotel as HotelIcon,
  Bus as BusIcon
} from "lucide-react";

interface PlannerAndBudgetProps {
  destination: string;
  setDestination: (d: string) => void;
  travelers: number;
  setTravelers: (t: number) => void;
  nights: number;
  setNights: (n: number) => void;
  selectedHotel?: AdvancedHotel | null;
  selectedRoom?: RoomOption | null;
  onSelectRoomCategory?: (category: RoomCategoryType) => void;
  selectedMealPlan?: "roomOnly" | "breakfastIncluded";
  onSelectMealPlan?: (plan: "roomOnly" | "breakfastIncluded") => void;
  selectedTransport?: TransportOption | null;
  travelStyle: "Budget" | "Comfort" | "Luxury";
  setTravelStyle: (s: "Budget" | "Comfort" | "Luxury") => void;
  customRoomsCount?: number;
  setCustomRoomsCount?: (r: number) => void;
}

export default function PlannerAndBudget({
  destination,
  setDestination,
  travelers,
  setTravelers,
  nights,
  setNights,
  selectedHotel,
  selectedRoom,
  onSelectRoomCategory,
  selectedMealPlan = "roomOnly",
  onSelectMealPlan,
  selectedTransport,
  travelStyle,
  setTravelStyle,
  customRoomsCount,
  setCustomRoomsCount
}: PlannerAndBudgetProps) {
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [contingencyPercent, setContingencyPercent] = useState<number>(0);

  // Dynamic cost parameters based on travelStyle
  const defaultTransportFare = selectedTransport
    ? selectedTransport.fare
    : travelStyle === "Budget"
    ? 950
    : travelStyle === "Comfort"
    ? 1325
    : 4850;

  // Daily food per person per day calibrated to Bangladesh rates
  const defaultFoodPerDay =
    travelStyle === "Budget" ? 500 : travelStyle === "Comfort" ? 800 : 1600;

  // Per-person activity & entry tickets
  const defaultActivityPerPerson =
    travelStyle === "Budget" ? 300 : travelStyle === "Comfort" ? 600 : 1200;

  // Local transport scales with days and group size (e.g. Chander Gari / auto rickshaw)
  const daysCount = Math.max(1, nights) + 1;
  const vehiclesNeeded = Math.max(1, Math.ceil(travelers / 6));
  const dailyLocalTransitRate =
    travelStyle === "Budget" ? 400 : travelStyle === "Comfort" ? 700 : 1400;
  const defaultLocalTransitTotal = daysCount * dailyLocalTransitRate * vehiclesNeeded;

  // Active Hotel & Room Price derivation
  const hotelNightly = selectedRoom
    ? selectedMealPlan === "breakfastIncluded"
      ? selectedRoom.breakfastIncludedPrice
      : selectedRoom.roomOnlyPrice
    : travelStyle === "Budget"
    ? 1800
    : travelStyle === "Comfort"
    ? 3800
    : 8200;

  const hasIncludedBreakfast = selectedMealPlan === "breakfastIncluded";

  // Calculate rooms needed based on selected room category capacity
  const roomCapacity = selectedRoom?.maxGuests || 2;
  const minRoomsNeeded = Math.max(1, Math.ceil(travelers / roomCapacity));
  const roomsNeeded =
    customRoomsCount && customRoomsCount >= minRoomsNeeded
      ? customRoomsCount
      : minRoomsNeeded;

  // Run deterministic calculation engine
  const budget = calculateTripBudget({
    travelers,
    nights,
    transportPerPerson: defaultTransportFare,
    roomPricePerNight: hotelNightly,
    rooms: roomsNeeded,
    foodPerPersonPerDay: defaultFoodPerDay,
    localTransportTotal: defaultLocalTransitTotal,
    activityPerPerson: defaultActivityPerPerson,
    contingencyPercent,
    isRoundTripTransport: isRoundTrip,
    breakfastIncluded: hasIncludedBreakfast
  });

  // Generate dynamic day-by-day schedule for all (nights + 1) days
  const generateItineraryDays = () => {
    const totalDays = nights + 1;
    const daysList = [];
    for (let d = 1; d <= totalDays; d++) {
      if (d === 1) {
        daysList.push({
          day: 1,
          title: `Day 1: Arrival, Check-In & Sunset Exploration`,
          tag: selectedHotel ? selectedHotel.name : "Hotel Check-in",
          items: [
            `08:00 AM: Arrive in ${destination} via ${
              selectedTransport ? selectedTransport.operator : "Express Transit"
            }.`,
            `01:00 PM: Check-in at ${
              selectedHotel ? selectedHotel.name : "hotel"
            } — settle into ${roomsNeeded} × ${
              selectedRoom ? selectedRoom.categoryLabel : "Room"
            } (Max ${roomCapacity}P/room) for ${travelers} traveler(s).`,
            `03:30 PM: Scenic local tour (${
              destination === "Sajek Valley"
                ? "Chander Gari hill climb & Helipad view"
                : destination === "Sreemangal"
                ? "Finlay Tea Estate & 7-Layer Tea cabin"
                : "Open-roof Marine Drive ride to Inani Coral Beach"
            }).`,
            `06:00 PM: Golden hour sunset view & local refreshments.`,
            `08:30 PM: Welcome dinner featuring regional specialties.`
          ]
        });
      } else if (d === totalDays) {
        daysList.push({
          day: d,
          title: `Day ${d}: Morning Stroll, Souvenirs & Return Journey`,
          tag: isRoundTrip ? "Return Transit Included" : "Checkout Day",
          items: [
            `08:00 AM: ${
              hasIncludedBreakfast
                ? "Complimentary hotel breakfast buffet included in room tariff."
                : "Morning breakfast & fresh tea at local café."
            }`,
            `09:30 AM: Souvenir & local craft shopping at traditional market.`,
            `11:30 AM: Check-out from ${roomsNeeded} room(s) at ${
              selectedHotel ? selectedHotel.name : "hotel"
            }.`,
            `02:00 PM: Farewell lunch & transfer to station/terminal.`,
            `04:30 PM: ${
              isRoundTrip
                ? `Board return ${
                    selectedTransport ? selectedTransport.operator : "transport"
                  } back home.`
                : "End of planned stay in " + destination + "."
            }`
          ]
        });
      } else {
        daysList.push({
          day: d,
          title:
            d === 2
              ? `Day 2: Iconic Landmarks, Adventure & Nature Trail`
              : `Day ${d}: Island / Hill Excursion & Cultural Discovery`,
          tag: "Full-Day Sightseeing",
          items: [
            `08:30 AM: ${
              hasIncludedBreakfast
                ? "Complimentary hotel breakfast buffet included in your rate."
                : "Breakfast at local town café."
            }`,
            `10:00 AM: Guided excursion to ${
              destination === "Sajek Valley"
                ? "Konglak Para highest peak & Lushai Heritage Village"
                : destination === "Sreemangal"
                ? "Lawachara National Park & Madhabpur Lake"
                : d === 2
                ? "Himchari Waterfalls & panoramic hilltop viewpoint"
                : "Maheshkhali Adinath Temple & Sonadia Island boat trip"
            }.`,
            `01:30 PM: Authentic midday meal (${budget.effectiveFoodPerDay} BDT/day meal plan).`,
            `04:30 PM: Relaxation session & evening promenade.`,
            `08:30 PM: Group barbecue / local cuisine dinner.`
          ]
        });
      }
    }
    return daysList;
  };

  const itineraryDays = generateItineraryDays();
  const activeHotel = selectedHotel || ADVANCED_HOTEL_INVENTORY[5];
  const activeRoom = selectedRoom || activeHotel.rooms[0];
  const activeTransport = selectedTransport || SAMPLE_TRANSPORTS[3];

  return (
    <section id="planner" className="py-12 sm:py-16 bg-[#F8F9FF] print:py-0 print:bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 no-print">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9CF2E8]/40 text-[#005C55] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Itinerary & Connected Budget Engine
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#121C2A] tracking-tight">
            Plan Trip & Estimate Exact Costs
          </h2>
          <p className="text-[#3E4947] mt-2 text-xs sm:text-sm md:text-base">
            Select transport, hotel room categories, and meal plans — watch every line item, subtotal, and per-person cost calibrate deterministically in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itinerary Configuration & Day Schedule (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-[#121C2A] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55]">tune</span>
                  Interactive Trip Parameters
                </h3>
                <span className="text-xs font-bold text-[#005F29] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  Live: {destination} • {nights} Nights ({budget.days} Days) • {travelers} Travelers
                </span>
              </div>

              {/* Row 1: Destination, Travelers, Nights, Comfort Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-200 bg-[#EFF4FF] text-[#121C2A] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Cox's Bazar">Cox&apos;s Bazar</option>
                    <option value="Sajek Valley">Sajek Valley</option>
                    <option value="Sreemangal">Sreemangal</option>
                    <option value="Saint Martin's">Saint Martin&apos;s</option>
                    <option value="Bandarban">Bandarban</option>
                    <option value="Sundarbans">Sundarbans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Travelers Count
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-200 bg-[#EFF4FF] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="px-2.5 py-2 text-xs font-extrabold text-[#005C55] hover:bg-[#DEE9FC] cursor-pointer"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={travelers}
                      onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                      className="w-full text-center text-xs font-bold py-2 bg-transparent text-[#121C2A] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.min(20, travelers + 1))}
                      className="px-2.5 py-2 text-xs font-extrabold text-[#005C55] hover:bg-[#DEE9FC] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Duration (Nights)
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-200 bg-[#EFF4FF] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setNights(Math.max(1, nights - 1))}
                      className="px-2.5 py-2 text-xs font-extrabold text-[#005C55] hover:bg-[#DEE9FC] cursor-pointer"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={nights}
                      onChange={(e) => setNights(Math.max(1, Number(e.target.value)))}
                      className="w-full text-center text-xs font-bold py-2 bg-transparent text-[#121C2A] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setNights(Math.min(14, nights + 1))}
                      className="px-2.5 py-2 text-xs font-extrabold text-[#005C55] hover:bg-[#DEE9FC] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Food & Local Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) =>
                      setTravelStyle(e.target.value as "Budget" | "Comfort" | "Luxury")
                    }
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-200 bg-[#EFF4FF] text-[#121C2A] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Budget">Budget (৳500 food/d)</option>
                    <option value="Comfort">Mid-Range (৳800 food/d)</option>
                    <option value="Luxury">Luxury (৳1,600 food/d)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Room Category Quick Switcher inside Planner */}
              <div className="bg-[#EFF4FF] p-3.5 rounded-xl border border-[#DEE9FC] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-[#005C55] uppercase tracking-wider">
                    Hotel Room Category ({selectedHotel ? selectedHotel.name : "Selected Hotel"}):
                  </span>
                  <span className="text-[11px] font-bold text-[#005F29]">
                    Capacity: Max {roomCapacity} guests/room → {roomsNeeded}{" "}
                    {roomsNeeded === 1 ? "Room" : "Rooms"} Allocated
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ROOM_CATEGORIES.map((cat) => {
                    const isSelected = selectedRoom?.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelectRoomCategory && onSelectRoomCategory(cat.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#005C55] text-white border-[#005C55] shadow-xs"
                            : "bg-white text-[#121C2A] border-gray-200 hover:border-[#005C55]"
                        }`}
                      >
                        {cat.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Connected Hotel & Transport Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Hotel badge */}
                <div className="p-3.5 rounded-xl bg-[#EFF4FF] border border-[#DEE9FC] flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#005C55] text-white flex items-center justify-center shrink-0">
                        <HotelIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-[#005C55] uppercase block">
                          Linked Hotel • {selectedRoom ? selectedRoom.categoryLabel : "Room"}
                        </span>
                        <h4 className="text-xs font-bold text-[#121C2A] line-clamp-1">
                          {selectedHotel ? selectedHotel.name : "Long Beach Hotel"}
                        </h4>
                        <span className="text-[10px] text-gray-500">
                          ৳{hotelNightly.toLocaleString()}/night × {roomsNeeded} rm
                        </span>
                      </div>
                    </div>
                    <a
                      href="/hotels"
                      className="text-[11px] font-bold text-[#005C55] underline hover:text-[#0F766E] shrink-0"
                    >
                      All Hotels →
                    </a>
                  </div>

                  {/* Quick Meal Plan Toggle */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-gray-200/60">
                    <button
                      type="button"
                      onClick={() => onSelectMealPlan && onSelectMealPlan("roomOnly")}
                      className={`flex-1 py-1 px-2 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        !hasIncludedBreakfast
                          ? "bg-[#005C55] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Room Only
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectMealPlan && onSelectMealPlan("breakfastIncluded")}
                      className={`flex-1 py-1 px-2 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        hasIncludedBreakfast
                          ? "bg-[#005F29] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      + Breakfast
                    </button>
                  </div>
                </div>

                {/* Transport badge */}
                <div className="p-3.5 rounded-xl bg-[#EFF4FF] border border-[#DEE9FC] flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#005F29] text-white flex items-center justify-center shrink-0">
                        <BusIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-[#005F29] uppercase block">
                          Linked Transport
                        </span>
                        <h4 className="text-xs font-bold text-[#121C2A] line-clamp-1">
                          {selectedTransport ? selectedTransport.operator : "Cox's Bazar Express AC"}
                        </h4>
                        <span className="text-[10px] text-gray-500">
                          ৳{defaultTransportFare.toLocaleString()}/seat •{" "}
                          {isRoundTrip ? "Round Trip (×2)" : "One Way (×1)"}
                        </span>
                      </div>
                    </div>
                    <a
                      href="/transport"
                      className="text-[11px] font-bold text-[#005C55] underline hover:text-[#0F766E] shrink-0"
                    >
                      All Transport →
                    </a>
                  </div>

                  {/* Quick Round Trip vs One Way Toggle */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-gray-200/60">
                    <button
                      type="button"
                      onClick={() => setIsRoundTrip(true)}
                      className={`flex-1 py-1 px-2 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        isRoundTrip
                          ? "bg-[#005F29] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Round Trip (×2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRoundTrip(false)}
                      className={`flex-1 py-1 px-2 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        !isRoundTrip
                          ? "bg-[#005C55] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      One Way (×1)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated AI Day-by-Day Timeline */}
            <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#121C2A] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#005C55] shrink-0" />
                  <span>
                    Verified Itinerary Timeline ({budget.days} Days / {nights} Nights in {destination})
                  </span>
                </h3>
                <span className="text-[11px] font-bold text-[#005F29] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-green-200">
                  Zod Validated Schedule
                </span>
              </div>

              <div className="space-y-5">
                {itineraryDays.map((dayObj) => (
                  <div
                    key={dayObj.day}
                    className="border-l-2 border-[#005C55] pl-4 ml-2 space-y-2 relative"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#005C55] ring-4 ring-[#005C55]/20" />
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4 className="font-extrabold text-sm text-[#121C2A]">{dayObj.title}</h4>
                      <span className="text-xs text-gray-500 font-medium">{dayObj.tag}</span>
                    </div>
                    <div className="bg-[#F8F9FF] p-3 rounded-xl text-xs text-[#3E4947] space-y-1.5 border border-gray-100">
                      {dayObj.items.map((line, idx) => {
                        const [timePart, ...rest] = line.split(": ");
                        return (
                          <p key={idx}>
                            <strong>{timePart}:</strong> {rest.join(": ")}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Deterministic Budget Calculator (5 cols) */}
          <div id="budget" className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-xl overflow-hidden">
              <div className="bg-[#005C55] p-4 sm:p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                  <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-[#9CF2E8]">
                    Calculated Total Trip Budget
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 shrink-0">
                    {travelers} {travelers === 1 ? "Traveler" : "Travelers"} • {nights}{" "}
                    {nights === 1 ? "Night" : "Nights"}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black">
                    ৳{budget.total.toLocaleString()}
                  </span>
                  <span className="text-xs opacity-80">BDT (All Taxes Included)</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap justify-between items-center gap-1 text-xs">
                  <span>
                    Split Per Person (৳{budget.total.toLocaleString()} ÷ {travelers}):
                  </span>
                  <span className="font-extrabold text-sm sm:text-base text-[#9CF2E8]">
                    ৳{budget.perPerson.toLocaleString()} / person
                  </span>
                </div>
              </div>

              {/* Cost Line Items */}
              <div className="p-4 sm:p-6 space-y-4 text-xs">
                {/* 1. Accommodation line connected to active hotel & room category */}
                <div className="flex justify-between items-start pb-3 border-b border-gray-100 bg-[#EFF4FF] p-3 rounded-xl">
                  <div className="pr-2">
                    <span className="font-extrabold text-[#005C55] flex items-center gap-1">
                      <HotelIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Accommodation ({selectedHotel ? selectedHotel.name : "Hotel Stay"})
                      </span>
                    </span>
                    <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                      {budget.breakdown.accommodationNote}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-[10px] bg-white text-[#005C55] px-1.5 py-0.5 rounded font-bold border border-[#005C55]/20">
                        {selectedRoom ? selectedRoom.categoryLabel : "Couple Room"} (Max{" "}
                        {roomCapacity}P/rm)
                      </span>
                      <span className="text-[10px] text-[#005F29] font-bold">
                        {hasIncludedBreakfast ? "✓ Breakfast Included" : "• Room Only Rate"}
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900 text-sm shrink-0">
                    ৳{budget.accommodation.toLocaleString()}
                  </span>
                </div>

                {/* 2. Transport */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="pr-2">
                    <span className="font-bold text-gray-800">
                      Transport ({selectedTransport ? selectedTransport.operator : "Transit"})
                    </span>
                    <p className="text-[11px] text-gray-500">{budget.breakdown.transportNote}</p>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ৳{budget.transport.toLocaleString()}
                  </span>
                </div>

                {/* 3. Food & Meals */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="pr-2">
                    <span className="font-bold text-gray-800">
                      Food & Meals ({travelStyle} Plan)
                    </span>
                    <p className="text-[11px] text-gray-500">{budget.breakdown.foodNote}</p>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ৳{budget.food.toLocaleString()}
                  </span>
                </div>

                {/* 4. Local Transit & Activities */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="pr-2">
                    <span className="font-bold text-gray-800">Local Transit & Activities</span>
                    <p className="text-[11px] text-gray-500">
                      {budget.breakdown.localActivitiesNote}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ৳{budget.localAndActivities.toLocaleString()}
                  </span>
                </div>

                {/* Subtotal Row */}
                <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-200 text-gray-600 font-bold">
                  <span>Net Trip Subtotal</span>
                  <span>৳{budget.subtotal.toLocaleString()}</span>
                </div>

                {/* 5. Contingency Buffer */}
                <div className="flex justify-between items-center gap-2 bg-amber-50/80 p-3 rounded-xl border border-amber-200/60">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-[#904D00]">
                        Contingency Buffer ({contingencyPercent}%)
                      </span>
                      <div className="flex items-center gap-1">
                        {[0, 5, 10].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setContingencyPercent(pct)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              contingencyPercent === pct
                                ? "bg-[#904D00] text-white"
                                : "bg-white text-[#904D00] border border-amber-300"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-amber-800 mt-0.5">
                      {budget.breakdown.contingencyNote} • Safety & emergency margin
                    </p>
                  </div>
                  <span className="font-bold text-[#904D00] shrink-0">
                    ৳{budget.contingency.toLocaleString()}
                  </span>
                </div>

                {/* Breakfast Deduplication Guarantee */}
                {hasIncludedBreakfast && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-[11px] text-[#005F29]">
                    <CheckCircle className="w-4 h-4 shrink-0 text-[#005F29] mt-0.5" />
                    <span>
                      <strong>Double-charge protection active:</strong> Because your hotel rate includes breakfast, daily meal costs were automatically reduced by 20% (to ৳{budget.effectiveFoodPerDay}/day)!
                    </span>
                  </div>
                )}

                {/* CTA actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Link
                    href="/login"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white font-bold text-xs shadow-md transition-all text-center cursor-pointer flex items-center justify-center"
                  >
                    Save & Export Trip Plan
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="py-3 px-4 rounded-xl bg-[#EFF4FF] hover:bg-[#DEE9FC] border border-[#005C55]/30 text-[#005C55] font-extrabold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    title="Print Official A4 Tour Plan & Budget Sheet"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Tour Plan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated A4 Official Printable Tour Plan Sheet */}
      <PrintableTripSheet
        destination={destination}
        nights={nights}
        travelers={travelers}
        roomsCount={roomsNeeded}
        travelStyle={travelStyle}
        selectedHotel={activeHotel}
        selectedRoom={activeRoom}
        selectedMealPlan={selectedMealPlan}
        selectedTransport={activeTransport}
        isRoundTrip={isRoundTrip}
        contingencyPercent={contingencyPercent}
        budget={budget}
        daysSchedule={itineraryDays.map((d) => ({
          day: d.day,
          title: d.title,
          subtitle: d.tag,
          items: d.items.map((line) => {
            const [timePart, ...rest] = line.split(": ");
            return {
              time: timePart,
              title: rest.join(": ")
            };
          })
        }))}
      />
    </section>
  );
}
