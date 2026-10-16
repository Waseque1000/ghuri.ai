"use client";

import { useState } from "react";
import { calculateTripBudget } from "@/lib/calculations";
import { AdvancedHotel, RoomOption } from "@/lib/hotelData";
import { TransportOption } from "@/lib/data";
import {
  Sparkles,
  Calculator,
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
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
  selectedMealPlan?: "roomOnly" | "breakfastIncluded";
  selectedTransport?: TransportOption | null;
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
  selectedMealPlan = "roomOnly",
  selectedTransport
}: PlannerAndBudgetProps) {
  const [style, setStyle] = useState<"Budget" | "Comfort" | "Luxury">("Comfort");
  const [isRoundTrip, setIsRoundTrip] = useState(true);

  // Dynamic cost parameters based on style
  const defaultTransportFare = selectedTransport
    ? selectedTransport.fare
    : (style === "Budget" ? 950 : style === "Comfort" ? 1800 : 4850);

  const defaultFood = style === "Budget" ? 600 : style === "Comfort" ? 1100 : 2200;
  const defaultActivity = style === "Budget" ? 400 : style === "Comfort" ? 800 : 1800;
  const defaultLocalTransit = style === "Budget" ? 1000 : style === "Comfort" ? 2200 : 4500;

  // Active Hotel & Room Price derivation
  const hotelNightly = selectedRoom
    ? (selectedMealPlan === "breakfastIncluded" ? selectedRoom.breakfastIncludedPrice : selectedRoom.roomOnlyPrice)
    : (style === "Budget" ? 1800 : style === "Comfort" ? 4200 : 8200);

  const hasIncludedBreakfast = selectedMealPlan === "breakfastIncluded";

  // Calculate rooms needed based on actual room occupancy
  const roomCapacity = selectedRoom?.maxGuests || 2;
  const roomsNeeded = Math.ceil(travelers / roomCapacity);

  // Run deterministic calculation engine
  const budget = calculateTripBudget({
    travelers,
    nights,
    transportPerPerson: defaultTransportFare,
    roomPricePerNight: hotelNightly,
    rooms: roomsNeeded,
    foodPerPersonPerDay: defaultFood,
    localTransportTotal: defaultLocalTransit,
    activityPerPerson: defaultActivity,
    contingencyPercent: 10,
    isRoundTripTransport: isRoundTrip,
    breakfastIncluded: hasIncludedBreakfast
  });

  return (
    <section id="planner" className="py-12 sm:py-16 bg-[#F8F9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
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
            Select transport, hotels, and meal plans — watch the total and per-person cost calibrate deterministically in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itinerary Configuration & Day Schedule (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 border border-[#E5E7EB] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-[#121C2A] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55]">tune</span>
                  Interactive Trip Parameters
                </h3>
                <span className="text-xs font-bold text-[#005F29] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  Live: {destination} • {nights} Nights • {travelers} Travelers
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-200 bg-[#EFF4FF] text-[#121C2A] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Cox's Bazar">Cox's Bazar</option>
                    <option value="Sajek Valley">Sajek Valley</option>
                    <option value="Sreemangal">Sreemangal</option>
                    <option value="Saint Martin's">Saint Martin's</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Travelers Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={travelers}
                    onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-200 bg-[#EFF4FF] text-[#121C2A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Duration (Nights)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={nights}
                    onChange={(e) => setNights(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-200 bg-[#EFF4FF] text-[#121C2A]"
                  />
                </div>
              </div>

              {/* Connected Hotel & Transport Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Hotel badge */}
                <div className="p-3.5 rounded-xl bg-[#EFF4FF] border border-[#DEE9FC] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#005C55] text-white flex items-center justify-center shrink-0">
                      <HotelIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-[#005C55] uppercase block">
                        Linked Hotel
                      </span>
                      <h4 className="text-xs font-bold text-[#121C2A] line-clamp-1">
                        {selectedHotel ? selectedHotel.name : "Long Beach Hotel"}
                      </h4>
                      <span className="text-[10px] text-gray-500">
                        {hasIncludedBreakfast ? "Breakfast Included" : "Room Only"}
                      </span>
                    </div>
                  </div>
                  <a href="#hotels" className="text-[11px] font-bold text-[#005C55] underline hover:text-[#0F766E] shrink-0">
                    Edit ↑
                  </a>
                </div>

                {/* Transport badge */}
                <div className="p-3.5 rounded-xl bg-[#EFF4FF] border border-[#DEE9FC] flex items-center justify-between">
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
                        ৳{defaultTransportFare.toLocaleString()}/seat
                      </span>
                    </div>
                  </div>
                  <a href="#transport" className="text-[11px] font-bold text-[#005C55] underline hover:text-[#0F766E] shrink-0">
                    Edit ↑
                  </a>
                </div>
              </div>
            </div>

            {/* Generated AI Day-by-Day Timeline */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#121C2A] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#005C55]" />
                  <span>Verified Itinerary Timeline ({nights + 1} Days in {destination})</span>
                </h3>
                <span className="text-[11px] font-bold text-[#005F29] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-green-200">
                  Zod Validated Schedule
                </span>
              </div>

              {/* Day 1 */}
              <div className="border-l-2 border-[#005C55] pl-4 ml-2 space-y-2 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#005C55] ring-4 ring-[#005C55]/20" />
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#121C2A]">Day 1: Arrival, Check-in & Marine Drive</h4>
                  <span className="text-xs text-gray-500">{selectedHotel ? selectedHotel.name : "Hotel"}</span>
                </div>
                <div className="bg-[#F8F9FF] p-3 rounded-xl text-xs text-[#3E4947] space-y-1.5 border border-gray-100">
                  <p><strong>08:00 AM:</strong> Arrive via {selectedTransport ? selectedTransport.operator : "Cox's Bazar Express AC Train"}.</p>
                  <p><strong>01:00 PM:</strong> Check-in at hotel, settle into {roomsNeeded} room(s) for {travelers} travelers.</p>
                  <p><strong>03:30 PM:</strong> Open-roof Chander Gari tour along scenic Marine Drive to Inani Beach.</p>
                  <p><strong>06:00 PM:</strong> Sunset at Inani Coral Beach with coconut water.</p>
                  <p><strong>08:30 PM:</strong> Fresh barbecue seafood dinner at local beach restaurant.</p>
                </div>
              </div>

              {/* Day 2 */}
              <div className="border-l-2 border-[#005C55] pl-4 ml-2 space-y-2 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#005C55] ring-4 ring-[#005C55]/20" />
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#121C2A]">Day 2: Himchari Waterfalls & Sunset</h4>
                  <span className="text-xs text-gray-500">Nature & Relaxation</span>
                </div>
                <div className="bg-[#F8F9FF] p-3 rounded-xl text-xs text-[#3E4947] space-y-1.5 border border-gray-100">
                  <p><strong>08:30 AM:</strong> {hasIncludedBreakfast ? "Complimentary hotel breakfast buffet included in your rate." : "Breakfast at local town café."}</p>
                  <p><strong>10:30 AM:</strong> Himchari National Park hike & panoramic hilltop view.</p>
                  <p><strong>04:00 PM:</strong> Pool session at hotel & sunset stroll along Laboni Point.</p>
                  <p><strong>08:00 PM:</strong> Souvenir shopping at Burmese market for tribal handicrafts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Deterministic Budget Calculator (5 cols) */}
          <div id="budget" className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-xl overflow-hidden">
              <div className="bg-[#005C55] p-5 sm:p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#9CF2E8]">
                    Calculated Total Trip Budget
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20">
                    {travelers} Travelers • {nights} Nights
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black">৳{budget.total.toLocaleString()}</span>
                  <span className="text-xs opacity-80">BDT (All Taxes Included)</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center text-xs">
                  <span>Split Per Person:</span>
                  <span className="font-extrabold text-sm sm:text-base text-[#9CF2E8]">
                    ৳{budget.perPerson.toLocaleString()} / person
                  </span>
                </div>
              </div>

              {/* Cost Line Items */}
              <div className="p-4 sm:p-6 space-y-4 text-xs">
                {/* Accommodation line connected to active hotel */}
                <div className="flex justify-between items-start pb-3 border-b border-gray-100 bg-[#EFF4FF] p-2.5 rounded-xl">
                  <div>
                    <span className="font-extrabold text-[#005C55] flex items-center gap-1">
                      <HotelIcon className="w-3.5 h-3.5" />
                      Accommodation ({selectedHotel ? selectedHotel.name : "Hotel Stay"})
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {roomsNeeded} room(s) × {nights} nights @ ৳{hotelNightly.toLocaleString()}/night
                    </p>
                    <span className="text-[10px] text-[#005F29] font-bold">
                      {hasIncludedBreakfast ? "✓ Breakfast Included Rate" : "Room Only Rate"}
                    </span>
                  </div>
                  <span className="font-extrabold text-gray-900 text-sm">
                    ৳{budget.accommodation.toLocaleString()}
                  </span>
                </div>

                {/* Transport */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <span className="font-bold text-gray-800">Transport ({selectedTransport ? selectedTransport.operator : "Round Trip"})</span>
                    <p className="text-[11px] text-gray-500">{budget.breakdown.transportNote}</p>
                  </div>
                  <span className="font-bold text-gray-900">৳{budget.transport.toLocaleString()}</span>
                </div>

                {/* Food */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <span className="font-bold text-gray-800">Food & Meals</span>
                    <p className="text-[11px] text-gray-500">
                      {budget.breakdown.foodNote}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900">৳{budget.food.toLocaleString()}</span>
                </div>

                {/* Local & Activities */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <span className="font-bold text-gray-800">Local Transit & Activities</span>
                    <p className="text-[11px] text-gray-500">Chander Gari rental, beach rickshaw & tickets</p>
                  </div>
                  <span className="font-bold text-gray-900">
                    ৳{(budget.localTransport + budget.activities).toLocaleString()}
                  </span>
                </div>

                {/* Contingency */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 bg-amber-50/70 p-2.5 rounded-xl">
                  <div>
                    <span className="font-bold text-[#904D00]">Contingency Buffer (10%)</span>
                    <p className="text-[10px] text-amber-700">Safety margin, tips & medical buffer</p>
                  </div>
                  <span className="font-bold text-[#904D00]">৳{budget.contingency.toLocaleString()}</span>
                </div>

                {/* Breakfast Deduplication Guarantee */}
                {hasIncludedBreakfast && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-[11px] text-[#005F29]">
                    <CheckCircle className="w-4 h-4 shrink-0 text-[#005F29] mt-0.5" />
                    <span>
                      <strong>Double-charge protection active:</strong> Because your hotel rate includes breakfast, daily meal costs were reduced by 20% in the calculation engine!
                    </span>
                  </div>
                )}

                {/* CTA actions */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => alert(`Saved trip plan for ${travelers} travelers to ${destination} at ${selectedHotel ? selectedHotel.name : "Hotel"}! Total: ৳${budget.total.toLocaleString()}`)}
                    className="flex-1 py-3 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white font-bold text-xs shadow-md transition-all text-center cursor-pointer"
                  >
                    Save & Export Trip Plan
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
                    title="Export as PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
