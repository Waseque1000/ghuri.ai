"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DestinationDiscovery from "@/components/DestinationDiscovery";
import HotelFinder from "@/components/HotelFinder";
import TransportComparison from "@/components/TransportComparison";
import PlannerAndBudget from "@/components/PlannerAndBudget";
import Footer from "@/components/Footer";
import { ADVANCED_HOTEL_INVENTORY, AdvancedHotel, RoomOption } from "@/lib/hotelData";
import { SAMPLE_TRANSPORTS, TransportOption } from "@/lib/data";

export default function HomePage() {
  // Global synchronized travel trip state
  const [destination, setDestination] = useState<string>("Cox's Bazar");
  const [travelers, setTravelers] = useState<number>(4);
  const [nights, setNights] = useState<number>(2);

  // Selected hotel and room
  const [selectedHotel, setSelectedHotel] = useState<AdvancedHotel>(ADVANCED_HOTEL_INVENTORY[1]); // Long Beach Hotel
  const [selectedRoom, setSelectedRoom] = useState<RoomOption>(ADVANCED_HOTEL_INVENTORY[1].rooms[0]);
  const [selectedMealPlan, setSelectedMealPlan] = useState<"roomOnly" | "breakfastIncluded">("roomOnly");

  // Selected transport
  const [selectedTransport, setSelectedTransport] = useState<TransportOption>(SAMPLE_TRANSPORTS[1]); // Cox's Bazar Express AC Train

  const handleSelectHotelAndRoom = (
    hotel: AdvancedHotel,
    room: RoomOption,
    mealPlan: "roomOnly" | "breakfastIncluded"
  ) => {
    setSelectedHotel(hotel);
    setSelectedRoom(room);
    setSelectedMealPlan(mealPlan);
  };

  const handleSelectTransport = (transport: TransportOption) => {
    setSelectedTransport(transport);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Stitch-style Hero with Quick Search */}
        <HeroSection />

        {/* Destination Discovery Section with Trust Pillars */}
        <DestinationDiscovery />

        {/* Full Hotel Finder, Filters & Side-by-Side Comparison Matrix */}
        <HotelFinder
          onSelectHotelAndRoom={handleSelectHotelAndRoom}
          selectedHotelId={selectedHotel?.id}
          selectedRoomId={selectedRoom?.id}
          nights={nights}
          travelers={travelers}
        />

        {/* Multimodal Transport Comparison with Direct Budget Link */}
        <TransportComparison
          onSelectTransport={handleSelectTransport}
          selectedTransportId={selectedTransport?.id}
        />

        {/* AI Itinerary Timeline & Live Connected Budget Calculator */}
        <PlannerAndBudget
          destination={destination}
          setDestination={setDestination}
          travelers={travelers}
          setTravelers={setTravelers}
          nights={nights}
          setNights={setNights}
          selectedHotel={selectedHotel}
          selectedRoom={selectedRoom}
          selectedMealPlan={selectedMealPlan}
          selectedTransport={selectedTransport}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
