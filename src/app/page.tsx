"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationDiscovery from "@/components/DestinationDiscovery";
import HotelFinder from "@/components/HotelFinder";
import TransportComparison from "@/components/TransportComparison";
import PlannerAndBudget from "@/components/PlannerAndBudget";
import Footer from "@/components/Footer";
import {
  ADVANCED_HOTEL_INVENTORY,
  AdvancedHotel,
  RoomOption,
  RoomCategoryType,
  ROOM_CATEGORIES
} from "@/lib/hotelData";
import { SAMPLE_TRANSPORTS, TransportOption } from "@/lib/data";

export default function HomePage() {
  // Global synchronized travel trip state
  const [destination, setDestination] = useState<string>("Cox's Bazar");
  const [travelers, setTravelersState] = useState<number>(2);
  const [nights, setNights] = useState<number>(2);
  const [checkInDate, setCheckInDate] = useState<string>("2026-11-14");
  const [travelStyle, setTravelStyle] = useState<"Budget" | "Comfort" | "Luxury">("Comfort");

  // Selected hotel, room category, and meal plan
  const [selectedHotel, setSelectedHotel] = useState<AdvancedHotel>(ADVANCED_HOTEL_INVENTORY[5]);
  const [selectedRoom, setSelectedRoom] = useState<RoomOption>(
    ADVANCED_HOTEL_INVENTORY[5].rooms[0]
  );
  const [roomCategory, setRoomCategoryState] = useState<RoomCategoryType>("couple");
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [selectedMealPlan, setSelectedMealPlan] = useState<"roomOnly" | "breakfastIncluded">(
    "roomOnly"
  );

  // Selected transport
  const [selectedTransport, setSelectedTransport] = useState<TransportOption>(
    SAMPLE_TRANSPORTS[3]
  );

  // Load any selection made on /hotels, /transport, or /dashboard from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ghuri_trip_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.destination) setDestination(parsed.destination);
        if (parsed.checkInDate) setCheckInDate(parsed.checkInDate);
        if (parsed.travelStyle) setTravelStyle(parsed.travelStyle);
        if (parsed.travelers) setTravelersState(parsed.travelers);
        if (parsed.nights) setNights(parsed.nights);
        if (parsed.roomCategory) setRoomCategoryState(parsed.roomCategory);
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
        if (parsed.selectedTransportId) {
          const foundTransport = SAMPLE_TRANSPORTS.find(
            (t) => t.id === parsed.selectedTransportId
          );
          if (foundTransport) {
            setSelectedTransport(foundTransport);
          }
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const syncToStorage = (updates: Record<string, unknown>) => {
    try {
      const existingRaw = localStorage.getItem("ghuri_trip_state");
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      localStorage.setItem(
        "ghuri_trip_state",
        JSON.stringify({
          ...existing,
          destination,
          checkInDate,
          travelStyle,
          travelers,
          nights,
          roomCategory,
          roomsCount,
          selectedHotelId: selectedHotel?.id,
          selectedRoomId: selectedRoom?.id,
          selectedMealPlan,
          selectedTransportId: selectedTransport?.id,
          ...updates
        })
      );
    } catch {
      // ignore storage errors
    }
  };

  const handleSetTravelers = (newTravelers: number) => {
    const validTravelers = Math.max(1, newTravelers);
    setTravelersState(validTravelers);
    const cap = selectedRoom?.maxGuests || 2;
    const needed = Math.max(1, Math.ceil(validTravelers / cap));
    setRoomsCount(needed);
    syncToStorage({ travelers: validTravelers, roomsCount: needed });
  };

  const handleSelectRoomCategory = (newCategory: RoomCategoryType) => {
    setRoomCategoryState(newCategory);
    const catInfo = ROOM_CATEGORIES.find((c) => c.id === newCategory) || ROOM_CATEGORIES[0];

    let matchingRoom = selectedRoom;
    if (selectedHotel) {
      matchingRoom =
        selectedHotel.rooms.find((r) => r.category === newCategory) ||
        selectedHotel.rooms[0];
      setSelectedRoom(matchingRoom);
    }

    setTravelersState(catInfo.maxGuests);
    setRoomsCount(1);
    syncToStorage({
      roomCategory: newCategory,
      selectedRoomId: matchingRoom?.id,
      travelers: catInfo.maxGuests,
      roomsCount: 1
    });
  };

  const handleSelectHotelAndRoom = (
    hotel: AdvancedHotel,
    room: RoomOption,
    mealPlan: "roomOnly" | "breakfastIncluded"
  ) => {
    const needed = Math.max(1, Math.ceil(travelers / room.maxGuests));
    setSelectedHotel(hotel);
    setSelectedRoom(room);
    setRoomCategoryState(room.category);
    setSelectedMealPlan(mealPlan);
    setRoomsCount(needed);
    syncToStorage({
      selectedHotelId: hotel.id,
      selectedRoomId: room.id,
      roomCategory: room.category,
      selectedMealPlan: mealPlan,
      roomsCount: needed
    });
  };

  const handleSelectTransport = (transport: TransportOption) => {
    setSelectedTransport(transport);
    syncToStorage({ selectedTransportId: transport.id });
  };

  return (
    <div className="min-h-screen print:min-h-0 flex flex-col bg-[#F8F9FF] print:bg-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <div className="no-print">
          {/* Stitch-style Hero with Fully Clickable & Interactive Quick Search */}
          <HeroSection
            destination={destination}
            setDestination={(d) => {
              setDestination(d);
              syncToStorage({ destination: d });
            }}
            travelers={travelers}
            setTravelers={handleSetTravelers}
            nights={nights}
            setNights={(n) => {
              setNights(n);
              syncToStorage({ nights: n });
            }}
            checkInDate={checkInDate}
            setCheckInDate={(dt) => {
              setCheckInDate(dt);
              syncToStorage({ checkInDate: dt });
            }}
            roomCategory={roomCategory}
            setRoomCategory={handleSelectRoomCategory}
            roomsCount={roomsCount}
            setRoomsCount={(r) => {
              setRoomsCount(r);
              syncToStorage({ roomsCount: r });
            }}
            travelStyle={travelStyle}
            setTravelStyle={(s) => {
              setTravelStyle(s);
              syncToStorage({ travelStyle: s });
            }}
          />

          {/* Destination Discovery Section with Trust Pillars */}
          <DestinationDiscovery />

          {/* Featured Hotel Finder Preview on Home Page (Full catalog at /hotels) */}
          <HotelFinder
            onSelectHotelAndRoom={handleSelectHotelAndRoom}
            selectedHotelId={selectedHotel?.id}
            selectedRoomId={selectedRoom?.id}
            preferredCategory={roomCategory}
            onChangePreferredCategory={handleSelectRoomCategory}
            nights={nights}
            travelers={travelers}
            customRoomsCount={roomsCount}
            maxItems={4}
          />

          {/* Featured Transport Comparison Preview on Home Page (Full catalog at /transport) */}
          <TransportComparison
            onSelectTransport={handleSelectTransport}
            selectedTransportId={selectedTransport?.id}
            travelers={travelers}
            maxItems={4}
          />
        </div>

        {/* AI Itinerary Timeline & Live Connected Budget Calculator */}
        <PlannerAndBudget
          destination={destination}
          setDestination={setDestination}
          travelers={travelers}
          setTravelers={handleSetTravelers}
          nights={nights}
          setNights={(n) => {
            setNights(n);
            syncToStorage({ nights: n });
          }}
          selectedHotel={selectedHotel}
          selectedRoom={selectedRoom}
          onSelectRoomCategory={handleSelectRoomCategory}
          selectedMealPlan={selectedMealPlan}
          onSelectMealPlan={(plan) => {
            setSelectedMealPlan(plan);
            syncToStorage({ selectedMealPlan: plan });
          }}
          selectedTransport={selectedTransport}
          travelStyle={travelStyle}
          setTravelStyle={setTravelStyle}
          customRoomsCount={roomsCount}
          setCustomRoomsCount={(r) => {
            setRoomsCount(r);
            syncToStorage({ roomsCount: r });
          }}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
