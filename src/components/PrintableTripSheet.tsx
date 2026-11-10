"use client";

import { AdvancedHotel, RoomOption } from "@/lib/hotelData";
import { TransportOption } from "@/lib/data";
import { BudgetResult } from "@/lib/calculations";

export interface PrintableDaySchedule {
  day: number;
  title: string;
  subtitle?: string;
  items: {
    time: string;
    phase?: string;
    title: string;
    detail?: string;
  }[];
}

interface PrintableTripSheetProps {
  travelerName?: string;
  destination: string;
  checkInDate?: string;
  nights: number;
  travelers: number;
  roomsCount: number;
  travelStyle: "Budget" | "Comfort" | "Luxury";
  selectedHotel: AdvancedHotel;
  selectedRoom: RoomOption;
  selectedMealPlan: "roomOnly" | "breakfastIncluded";
  selectedTransport: TransportOption;
  isRoundTrip: boolean;
  contingencyPercent: number;
  budget: BudgetResult;
  daysSchedule: PrintableDaySchedule[];
}

export default function PrintableTripSheet({
  travelerName = "Valued Traveler",
  destination,
  checkInDate = "2026-11-14",
  nights,
  travelers,
  roomsCount,
  travelStyle,
  selectedHotel,
  selectedRoom,
  selectedMealPlan,
  selectedTransport,
  isRoundTrip,
  contingencyPercent,
  budget,
  daysSchedule
}: PrintableTripSheetProps) {
  const hotelNightly =
    selectedMealPlan === "breakfastIncluded"
      ? selectedRoom.breakfastIncludedPrice
      : selectedRoom.roomOnlyPrice;

  const isMultiDayCompact = daysSchedule.length > 4;

  return (
    <div className="printable-trip-sheet hidden print:block bg-white text-[#121C2A] w-full font-sans">
      {/* 1. Compact Single-Page Official Header */}
      <div className="border-b-2 border-[#005C55] pb-2 mb-2.5 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-[#005C55]">
              Ghuri.ai
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded border border-[#005C55] text-[#005C55]">
              Official Single-Page Tour Plan & Voucher
            </span>
          </div>
          <h1 className="text-base font-extrabold text-[#121C2A] leading-tight mt-0.5">
            {destination} Complete Tour Plan & Budget Sheet
          </h1>
          <p className="text-[10px] text-gray-600 mt-0.5">
            Traveler: <strong>{travelerName}</strong> • Check-In:{" "}
            <strong>{checkInDate}</strong> • Stay:{" "}
            <strong>
              {nights} {nights === 1 ? "Night" : "Nights"} ({budget.days} Days)
            </strong>{" "}
            • Party:{" "}
            <strong>
              {travelers} {travelers === 1 ? "Guest" : "Guests"} ({roomsCount}{" "}
              {roomsCount === 1 ? "Room" : "Rooms"})
            </strong>
          </p>
        </div>

        <div className="text-right border-2 border-[#005C55] rounded-lg px-3 py-1.5 bg-[#F8F9FF] shrink-0">
          <span className="text-[8px] font-extrabold uppercase tracking-wider text-[#005C55] block">
            Total Verified Budget
          </span>
          <span className="text-lg font-black text-[#121C2A] leading-tight block">
            ৳{budget.total.toLocaleString()} BDT
          </span>
          <span className="text-[10px] font-extrabold text-[#005C55] block">
            Split: ৳{budget.perPerson.toLocaleString()} / person
          </span>
        </div>
      </div>

      {/* 2. Compact 2-Column Row: Step 1 (Transport) & Step 2 (Hotel) */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        {/* Step 1: Transport Box */}
        <div className="border border-gray-300 rounded-lg p-2.5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-1 mb-1.5">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#005C55]">
              Step 1 • Intercity Transport
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-800">
              {isRoundTrip ? "Round Trip (×2)" : "One Way (×1)"}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-extrabold text-[#121C2A] truncate">
              {selectedTransport.operator}
            </span>
            <span className="text-[9px] font-bold text-gray-600 shrink-0">
              {selectedTransport.isAC ? "AC" : "Non-AC"} • {selectedTransport.seatClass}
            </span>
          </div>
          {selectedTransport.coachCode && (
            <div className="text-[9px] text-gray-500 font-mono truncate">
              Coach: {selectedTransport.coachCode}
            </div>
          )}
          <div className="mt-1.5 pt-1 border-t border-dashed border-gray-200 grid grid-cols-2 gap-1.5 text-[10px]">
            <div>
              <span className="text-[8px] text-gray-500 uppercase font-bold block">
                Boarding ({selectedTransport.departureTime})
              </span>
              <span className="font-semibold text-[#121C2A] truncate block">
                {selectedTransport.origin}
              </span>
            </div>
            <div>
              <span className="text-[8px] text-gray-500 uppercase font-bold block">
                Dropping ({selectedTransport.arrivalTime})
              </span>
              <span className="font-semibold text-[#121C2A] truncate block">
                {selectedTransport.destination}
              </span>
            </div>
          </div>
          <div className="mt-1.5 pt-1 border-t border-gray-200 flex justify-between items-center text-[10px]">
            <span className="text-gray-600">
              Duration: {selectedTransport.duration}
            </span>
            <strong className="text-[#005C55]">
              ৳{budget.transport.toLocaleString()} (৳{selectedTransport.fare.toLocaleString()}/seat)
            </strong>
          </div>
        </div>

        {/* Step 2: Hotel Box */}
        <div className="border border-gray-300 rounded-lg p-2.5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-1 mb-1.5">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#005C55]">
              Step 2 • Hotel & Room Stay
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-800">
              {selectedHotel.priceSegment} • {selectedHotel.starRating}★
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-extrabold text-[#121C2A] truncate">
              {selectedHotel.name}
            </span>
            {selectedHotel.contactPhone && (
              <span className="text-[9px] font-semibold text-gray-600 shrink-0">
                📞 {selectedHotel.contactPhone.split(",")[0]}
              </span>
            )}
          </div>
          <div className="text-[9px] text-gray-600 truncate">
            📍 {selectedHotel.address}
          </div>
          <div className="mt-1.5 pt-1 border-t border-dashed border-gray-200 grid grid-cols-2 gap-1.5 text-[10px]">
            <div>
              <span className="text-[8px] text-gray-500 uppercase font-bold block">
                Room Category
              </span>
              <span className="font-bold text-[#121C2A] truncate block">
                {selectedRoom.categoryLabel} ({roomsCount} rm)
              </span>
            </div>
            <div>
              <span className="text-[8px] text-gray-500 uppercase font-bold block">
                Meal Plan & Rate
              </span>
              <span className="font-bold text-[#121C2A] truncate block">
                {selectedMealPlan === "breakfastIncluded" ? "w/ Breakfast" : "Room Only"} (৳
                {hotelNightly.toLocaleString()}/nt)
              </span>
            </div>
          </div>
          <div className="mt-1.5 pt-1 border-t border-gray-200 flex justify-between items-center text-[10px]">
            <span className="text-gray-600">
              Max {selectedRoom.maxGuests}P/room • {selectedRoom.viewType}
            </span>
            <strong className="text-[#005C55]">
              Total: ৳{budget.accommodation.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* 3. Compact Deterministic Cost Breakdown Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden mb-2.5">
        <div className="bg-gray-100 px-3 py-1 border-b border-gray-300 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#121C2A]">
            Step 3 • Deterministic Cost Breakdown & Group Split Ledger
          </span>
          <span className="text-[9px] font-bold text-gray-600">
            Per Person Split: ৳{budget.perPerson.toLocaleString()} × {travelers} Travelers = ৳{budget.total.toLocaleString()}
          </span>
        </div>
        <table className="w-full text-[10px] text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70">
              <th className="py-1 px-2.5 font-bold text-gray-700">Category</th>
              <th className="py-1 px-2.5 font-bold text-gray-700">Calculation Formula</th>
              <th className="py-1 px-2.5 font-bold text-gray-700 text-right">Amount (BDT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-1 px-2.5 font-bold text-[#121C2A]">
                1. Hotel ({selectedHotel.name})
              </td>
              <td className="py-1 px-2.5 text-gray-700">
                {budget.breakdown.accommodationNote} ({selectedRoom.categoryLabel})
              </td>
              <td className="py-1 px-2.5 font-bold text-right text-[#121C2A]">
                ৳{budget.accommodation.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="py-1 px-2.5 font-bold text-[#121C2A]">
                2. Transport ({selectedTransport.operator})
              </td>
              <td className="py-1 px-2.5 text-gray-700">
                {budget.breakdown.transportNote}
              </td>
              <td className="py-1 px-2.5 font-bold text-right text-[#121C2A]">
                ৳{budget.transport.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="py-1 px-2.5 font-bold text-[#121C2A]">
                3. Food & Meals ({travelStyle})
              </td>
              <td className="py-1 px-2.5 text-gray-700">
                {budget.breakdown.foodNote}
              </td>
              <td className="py-1 px-2.5 font-bold text-right text-[#121C2A]">
                ৳{budget.food.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="py-1 px-2.5 font-bold text-[#121C2A]">
                4. Local Transit & Sightseeing
              </td>
              <td className="py-1 px-2.5 text-gray-700">
                {budget.breakdown.localActivitiesNote}
              </td>
              <td className="py-1 px-2.5 font-bold text-right text-[#121C2A]">
                ৳{budget.localAndActivities.toLocaleString()}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-1 px-2.5 font-extrabold text-[#005C55]">
                Total (incl. {contingencyPercent}% Contingency)
              </td>
              <td className="py-1 px-2.5 text-gray-600">
                Subtotal ৳{budget.subtotal.toLocaleString()} + Buffer ৳{budget.contingency.toLocaleString()}
              </td>
              <td className="py-1 px-2.5 font-black text-right text-[#005C55]">
                ৳{budget.total.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Multi-Column Day-by-Day Itinerary Grid (Fits on the Same Single Page) */}
      <div>
        <div className="border-b border-gray-300 pb-1 mb-2 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#005C55]">
            Step 4 • Step-by-Step Guided Tour Schedule ({budget.days} Days / {nights} Nights)
          </span>
          <span className="text-[9px] text-gray-500">
            Tick each box [ ] as you complete each step
          </span>
        </div>

        <div
          className={`grid gap-2 ${
            isMultiDayCompact ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {daysSchedule.slice(0, 6).map((dayObj) => (
            <div
              key={dayObj.day}
              className="border border-gray-300 rounded-lg p-2 bg-white"
            >
              <div className="border-b border-gray-200 pb-1 mb-1 flex items-center justify-between gap-1">
                <h3 className="text-[10px] font-extrabold text-[#121C2A] truncate">
                  {dayObj.title}
                </h3>
                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-[#EFF4FF] text-[#005C55] shrink-0">
                  Day {dayObj.day}
                </span>
              </div>

              <div className="space-y-1">
                {dayObj.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-1.5 text-[9.5px] leading-tight"
                  >
                    <span className="inline-block w-2.5 h-2.5 border border-gray-400 rounded-[2px] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-[#005C55]">{item.time}:</strong>{" "}
                      <span className="font-semibold text-[#121C2A]">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Compact Single-Line Footer */}
      <div className="mt-2.5 pt-1.5 border-t border-gray-300 flex items-center justify-between text-[9px] text-gray-600">
        <span>
          <strong>Checklist:</strong> Carry NID / Passport copies for hotel check-in • Keep bus boarding pass • Emergency: <strong>999</strong> | Tourist Police: <strong>01320-163599</strong>
        </span>
        <span className="font-bold text-[#005C55] shrink-0">
          Ghuri.ai Verified Tour Sheet
        </span>
      </div>
    </div>
  );
}
