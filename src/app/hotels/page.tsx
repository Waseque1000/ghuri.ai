"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HotelFinder from "@/components/HotelFinder";
import Footer from "@/components/Footer";
import {
  ADVANCED_HOTEL_INVENTORY,
  AdvancedHotel,
  RoomOption,
  RoomCategoryType,
  ROOM_CATEGORIES
} from "@/lib/hotelData";

export default function HotelsPage() {
  const router = useRouter();
  const [travelers, setTravelers] = useState<number>(2);
  const [nights, setNights] = useState<number>(2);
  const [roomCategory, setRoomCategory] = useState<RoomCategoryType>("couple");
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [selectedHotel, setSelectedHotel] = useState<AdvancedHotel>(
    ADVANCED_HOTEL_INVENTORY[5]
  );
  const [selectedRoom, setSelectedRoom] = useState<RoomOption>(
    ADVANCED_HOTEL_INVENTORY[5].rooms[0]
  );
  const [selectedMealPlan, setSelectedMealPlan] = useState<
    "roomOnly" | "breakfastIncluded"
  >("roomOnly");

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ghuri_trip_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.travelers) setTravelers(parsed.travelers);
        if (parsed.nights) setNights(parsed.nights);
        if (parsed.roomCategory) setRoomCategory(parsed.roomCategory);
        if (parsed.roomsCount) setRoomsCount(parsed.roomsCount);
        if (parsed.selectedMealPlan) setSelectedMealPlan(parsed.selectedMealPlan);
        if (parsed.selectedHotelId) {
          const foundHotel = ADVANCED_HOTEL_INVENTORY.find(
            (h) => h.id === parsed.selectedHotelId
          );
          if (foundHotel) {
            setSelectedHotel(foundHotel);
            const foundRoom =
              foundHotel.rooms.find((r) => r.id === parsed.selectedRoomId) ||
              foundHotel.rooms.find((r) => r.category === parsed.roomCategory) ||
              foundHotel.rooms[0];
            setSelectedRoom(foundRoom);
          }
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const saveToStorage = (
    hotel: AdvancedHotel,
    room: RoomOption,
    mealPlan: "roomOnly" | "breakfastIncluded",
    tCount = travelers,
    nCount = nights,
    rCount = roomsCount
  ) => {
    try {
      const existingRaw = localStorage.getItem("ghuri_trip_state");
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      localStorage.setItem(
        "ghuri_trip_state",
        JSON.stringify({
          ...existing,
          travelers: tCount,
          nights: nCount,
          roomCategory: room.category,
          roomsCount: rCount,
          selectedHotelId: hotel.id,
          selectedRoomId: room.id,
          selectedMealPlan: mealPlan
        })
      );
    } catch {
      // ignore storage errors
    }
  };

  const handleSelectRoomCategory = (newCat: RoomCategoryType) => {
    setRoomCategory(newCat);
    const catInfo =
      ROOM_CATEGORIES.find((c) => c.id === newCat) || ROOM_CATEGORIES[0];
    const nextTravelers = catInfo.maxGuests;
    setTravelers(nextTravelers);
    setRoomsCount(1);

    if (selectedHotel) {
      const matchingRoom =
        selectedHotel.rooms.find((r) => r.category === newCat) ||
        selectedHotel.rooms[0];
      setSelectedRoom(matchingRoom);
      saveToStorage(
        selectedHotel,
        matchingRoom,
        selectedMealPlan,
        nextTravelers,
        nights,
        1
      );
    }
  };

  const handleSelectHotelAndRoom = (
    hotel: AdvancedHotel,
    room: RoomOption,
    mealPlan: "roomOnly" | "breakfastIncluded"
  ) => {
    const neededRooms = Math.max(1, Math.ceil(travelers / room.maxGuests));
    setSelectedHotel(hotel);
    setSelectedRoom(room);
    setRoomCategory(room.category);
    setSelectedMealPlan(mealPlan);
    setRoomsCount(neededRooms);
    saveToStorage(hotel, room, mealPlan, travelers, nights, neededRooms);
    router.push("/#budget");
  };

  const activeNightly =
    selectedMealPlan === "breakfastIncluded"
      ? selectedRoom.breakfastIncludedPrice
      : selectedRoom.roomOnlyPrice;
  const activeTotalStay = activeNightly * roomsCount * nights;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar activeTab="Hotels" />

      <main className="flex-1 pt-20">
        {/* Top Hero Strip for Dedicated Hotels Page */}
        <section className="bg-gradient-to-b from-[#005C55] to-[#003E39] text-white py-10 sm:py-12 px-4 sm:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-[#9CF2E8] mb-3">
                <span className="material-symbols-outlined text-sm">hotel</span>
                <span>Dedicated Accommodation Directory • 2026 Verified Report</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                All Verified Hotels & Resorts in Bangladesh
              </h1>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl mt-2">
                Explore all 16 verified Cox&apos;s Bazar hotels & resorts (Budget, Standard, Premium & Luxury) plus Sajek Valley cottages. Select any room category to sync directly with your Trip Budget.
              </p>
            </div>

            {/* Quick Stay Configurator Pill */}
            <div className="w-full lg:w-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block">
                  Travelers
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const nextT = Math.max(1, travelers - 1);
                      const nextR = Math.max(
                        1,
                        Math.ceil(nextT / selectedRoom.maxGuests)
                      );
                      setTravelers(nextT);
                      setRoomsCount(nextR);
                      saveToStorage(
                        selectedHotel,
                        selectedRoom,
                        selectedMealPlan,
                        nextT,
                        nights,
                        nextR
                      );
                    }}
                    className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-extrabold text-sm">{travelers}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextT = Math.min(20, travelers + 1);
                      const nextR = Math.max(
                        1,
                        Math.ceil(nextT / selectedRoom.maxGuests)
                      );
                      setTravelers(nextT);
                      setRoomsCount(nextR);
                      saveToStorage(
                        selectedHotel,
                        selectedRoom,
                        selectedMealPlan,
                        nextT,
                        nights,
                        nextR
                      );
                    }}
                    className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-l border-white/20 pl-3 sm:pl-4">
                <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block">
                  Stay Duration
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const nextN = Math.max(1, nights - 1);
                      setNights(nextN);
                      saveToStorage(
                        selectedHotel,
                        selectedRoom,
                        selectedMealPlan,
                        travelers,
                        nextN,
                        roomsCount
                      );
                    }}
                    className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-extrabold text-sm">
                    {nights} {nights === 1 ? "Night" : "Nights"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextN = Math.min(14, nights + 1);
                      setNights(nextN);
                      saveToStorage(
                        selectedHotel,
                        selectedRoom,
                        selectedMealPlan,
                        travelers,
                        nextN,
                        roomsCount
                      );
                    }}
                    className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-white/20 pt-2.5 sm:pt-0 sm:pl-4">
                <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block truncate">
                  Active Selection ({selectedHotel.name})
                </span>
                <div className="font-extrabold text-sm mt-0.5">
                  ৳{activeTotalStay.toLocaleString()} ({roomsCount} rm × {nights} nt)
                </div>
              </div>

              <Link
                href="/#budget"
                className="col-span-2 sm:col-span-1 w-full sm:w-auto justify-center bg-[#9CF2E8] text-[#00201D] hover:bg-white px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1"
              >
                <span>Open Trip Budget</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Full Hotel Finder Component */}
        <HotelFinder
          onSelectHotelAndRoom={handleSelectHotelAndRoom}
          selectedHotelId={selectedHotel?.id}
          selectedRoomId={selectedRoom?.id}
          preferredCategory={roomCategory}
          onChangePreferredCategory={handleSelectRoomCategory}
          nights={nights}
          travelers={travelers}
          customRoomsCount={roomsCount}
        />
      </main>

      <Footer />
    </div>
  );
}

