"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ADVANCED_HOTEL_INVENTORY,
  AdvancedHotel,
  RoomOption,
  RoomCategoryType,
  ROOM_CATEGORIES
} from "@/lib/hotelData";
import { SAMPLE_TRANSPORTS, TransportOption } from "@/lib/data";
import { calculateTripBudget } from "@/lib/calculations";
import {
  CheckCircle2,
  Circle,
  MapPin,
  Calendar,
  Users,
  Hotel as HotelIcon,
  Bus,
  Utensils,
  Compass,
  Calculator,
  Printer,
  ArrowRight,
  Clock,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Synchronized Trip State
  const [destination, setDestination] = useState<string>("Cox's Bazar");
  const [checkInDate, setCheckInDate] = useState<string>("2026-11-14");
  const [travelers, setTravelers] = useState<number>(2);
  const [nights, setNights] = useState<number>(2);
  const [travelStyle, setTravelStyle] = useState<"Budget" | "Comfort" | "Luxury">("Comfort");
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
  const [selectedTransport, setSelectedTransport] = useState<TransportOption>(
    SAMPLE_TRANSPORTS[3]
  );
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true);
  const [contingencyPercent, setContingencyPercent] = useState<number>(0);

  // Interactive step completion state
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    "step-transport-book": true,
    "step-hotel-select": true
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load saved trip state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ghuri_trip_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.destination) setDestination(parsed.destination);
        if (parsed.checkInDate) setCheckInDate(parsed.checkInDate);
        if (parsed.travelStyle) setTravelStyle(parsed.travelStyle);
        if (parsed.travelers) setTravelers(parsed.travelers);
        if (parsed.nights) setNights(parsed.nights);
        if (parsed.roomCategory) setRoomCategory(parsed.roomCategory);
        if (parsed.roomsCount) setRoomsCount(parsed.roomsCount);
        if (parsed.selectedMealPlan) setSelectedMealPlan(parsed.selectedMealPlan);
        if (typeof parsed.isRoundTrip === "boolean") setIsRoundTrip(parsed.isRoundTrip);
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
          isRoundTrip,
          ...updates
        })
      );
    } catch {
      // ignore storage errors
    }
  };

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  // Budget calculation parameters
  const defaultFoodPerDay =
    travelStyle === "Budget" ? 500 : travelStyle === "Comfort" ? 800 : 1600;
  const defaultActivityPerPerson =
    travelStyle === "Budget" ? 300 : travelStyle === "Comfort" ? 600 : 1200;
  const daysCount = Math.max(1, nights) + 1;
  const vehiclesNeeded = Math.max(1, Math.ceil(travelers / 6));
  const dailyLocalTransitRate =
    travelStyle === "Budget" ? 400 : travelStyle === "Comfort" ? 700 : 1400;
  const defaultLocalTransitTotal = daysCount * dailyLocalTransitRate * vehiclesNeeded;

  const hotelNightly =
    selectedMealPlan === "breakfastIncluded"
      ? selectedRoom.breakfastIncludedPrice
      : selectedRoom.roomOnlyPrice;
  const hasIncludedBreakfast = selectedMealPlan === "breakfastIncluded";
  const roomCapacity = selectedRoom?.maxGuests || 2;
  const minRoomsNeeded = Math.max(1, Math.ceil(travelers / roomCapacity));
  const effectiveRooms = Math.max(minRoomsNeeded, roomsCount);

  const budget = calculateTripBudget({
    travelers,
    nights,
    transportPerPerson: selectedTransport.fare,
    roomPricePerNight: hotelNightly,
    rooms: effectiveRooms,
    foodPerPersonPerDay: defaultFoodPerDay,
    localTransportTotal: defaultLocalTransitTotal,
    activityPerPerson: defaultActivityPerPerson,
    contingencyPercent,
    isRoundTripTransport: isRoundTrip,
    breakfastIncluded: hasIncludedBreakfast
  });

  // Generate step-by-step daily itinerary
  const generateDailySteps = () => {
    const totalDays = nights + 1;
    const days = [];
    for (let d = 1; d <= totalDays; d++) {
      if (d === 1) {
        days.push({
          day: 1,
          title: `Day 1: Arrival in ${destination}, Hotel Check-In & Sunset Tour`,
          subtitle: "Transit Arrival • Room Allocation • Coastal/Hill Exploration",
          steps: [
            {
              id: `day-1-1`,
              time: selectedTransport.departureTime,
              phase: "Departure",
              title: `Board ${selectedTransport.operator} (${selectedTransport.seatClass})`,
              detail: `Boarding at ${selectedTransport.origin} → Dropping at ${selectedTransport.destination} (${selectedTransport.duration}). ${
                selectedTransport.coachCode ? `Coach: ${selectedTransport.coachCode}` : ""
              }`
            },
            {
              id: `day-1-2`,
              time: "12:30 PM",
              phase: "Hotel Check-In",
              title: `Check in at ${selectedHotel.name} (${selectedHotel.starRating}★ ${selectedHotel.priceSegment})`,
              detail: `Settle into ${effectiveRooms} × ${selectedRoom.categoryLabel} (${selectedRoom.bedType}, Max ${selectedRoom.maxGuests}P/room) for ${travelers} guests.`
            },
            {
              id: `day-1-3`,
              time: "02:00 PM",
              phase: "Lunch",
              title: `Fresh Regional Welcome Lunch`,
              detail: `Budgeted at ৳${budget.effectiveFoodPerDay}/person/day (${travelStyle} dining tier).`
            },
            {
              id: `day-1-4`,
              time: "04:00 PM",
              phase: "Sightseeing",
              title:
                destination === "Sajek Valley"
                  ? "Chander Gari Ride to Helipad & Ruilui Para Viewpoint"
                  : destination === "Sreemangal"
                  ? "Finlay Tea Garden Walk & Seven-Layer Tea Cabin"
                  : "Scenic Marine Drive Tour & Inani Coral Beach Sunset",
              detail: `Local transport (${vehiclesNeeded} shared vehicle) & entry tickets included in ৳${budget.localAndActivities.toLocaleString()} local transit & activity budget.`
            },
            {
              id: `day-1-5`,
              time: "08:30 PM",
              phase: "Dinner & Rest",
              title: `Group Dinner & Overnight Stay at ${selectedHotel.name}`,
              detail: `Evening stroll near ${selectedHotel.distanceFromBeach}.`
            }
          ]
        });
      } else if (d === totalDays) {
        days.push({
          day: d,
          title: `Day ${d}: Morning Promenade, Souvenirs & Return Journey`,
          subtitle: "Final Breakfast • Hotel Check-Out • Return Coach/Transit",
          steps: [
            {
              id: `day-${d}-1`,
              time: "08:00 AM",
              phase: "Breakfast",
              title: hasIncludedBreakfast
                ? `Complimentary Buffet Breakfast at ${selectedHotel.name}`
                : `Morning Breakfast & Local Tea`,
              detail: hasIncludedBreakfast
                ? "Included in your Breakfast-Included room tariff (20% daily meal savings applied)."
                : "Fresh local breakfast before packing."
            },
            {
              id: `day-${d}-2`,
              time: "09:30 AM",
              phase: "Souvenirs",
              title: `Local Craft & Burmese Market Shopping`,
              detail: `Pick up regional specialties, dry fish, pickles, or handicrafts.`
            },
            {
              id: `day-${d}-3`,
              time: "11:30 AM",
              phase: "Check-Out",
              title: `Check out from ${effectiveRooms} room(s) at ${selectedHotel.name}`,
              detail: `Verify all luggage and room keys at reception (${selectedHotel.contactPhone || "Front Desk"}).`
            },
            {
              id: `day-${d}-4`,
              time: "04:00 PM",
              phase: "Return Transit",
              title: isRoundTrip
                ? `Board Return ${selectedTransport.operator} (${selectedTransport.seatClass})`
                : `End of Planned Stay in ${destination}`,
              detail: isRoundTrip
                ? `Return fare included in Round-Trip (×2) transport budget (৳${budget.transport.toLocaleString()} total).`
                : `One-way transport selected.`
            }
          ]
        });
      } else {
        days.push({
          day: d,
          title:
            d === 2
              ? `Day 2: Iconic Landmarks, Waterfalls & Adventure Trail`
              : `Day ${d}: Island / Hill Excursion & Cultural Discovery`,
          subtitle: "Full-Day Guided Exploration • Local Cuisine • Sunset Relaxation",
          steps: [
            {
              id: `day-${d}-1`,
              time: "08:00 AM",
              phase: "Breakfast",
              title: hasIncludedBreakfast
                ? `Complimentary Hotel Breakfast at ${selectedHotel.name}`
                : `Morning Breakfast at Local Café`,
              detail: `Fuel up for Day ${d} full-day excursion.`
            },
            {
              id: `day-${d}-2`,
              time: "09:30 AM",
              phase: "Morning Excursion",
              title:
                destination === "Sajek Valley"
                  ? "Konglak Para Highest Peak Hike & Lushai Heritage Village"
                  : destination === "Sreemangal"
                  ? "Lawachara National Park Rainforest Trail & Madhabpur Lake"
                  : d === 2
                  ? "Himchari National Park Waterfalls & Hilltop Sea Viewpoint"
                  : "Maheshkhali Adinath Temple & Sonadia Island Boat Tour",
              detail: `Guided group exploration with local Chander Gari / boat transfer.`
            },
            {
              id: `day-${d}-3`,
              time: "01:30 PM",
              phase: "Midday Meal",
              title: `Traditional Bangladeshi Lunch (${travelStyle} Tier)`,
              detail: `Fresh fish/seafood bhuna, bhortas, and seasonal dishes.`
            },
            {
              id: `day-${d}-4`,
              time: "04:30 PM",
              phase: "Afternoon Leisure",
              title: `Beach / Resort Pool Session & Golden Hour Photography`,
              detail: `Relax at ${selectedHotel.name} (${selectedHotel.facilitiesList.slice(0, 3).join(", ")}).`
            },
            {
              id: `day-${d}-5`,
              time: "08:30 PM",
              phase: "Dinner",
              title: `Evening Barbecue & Group Dinner`,
              detail: `Included in your ৳${budget.food.toLocaleString()} total food budget.`
            }
          ]
        });
      }
    }
    return days;
  };

  const dailyItinerary = generateDailySteps();

  const handleSelectRoomCategory = (newCat: RoomCategoryType) => {
    setRoomCategory(newCat);
    const catInfo =
      ROOM_CATEGORIES.find((c) => c.id === newCat) || ROOM_CATEGORIES[0];
    const matchingRoom =
      selectedHotel.rooms.find((r) => r.category === newCat) ||
      selectedHotel.rooms[0];
    setSelectedRoom(matchingRoom);
    const needed = Math.max(1, Math.ceil(travelers / catInfo.maxGuests));
    setRoomsCount(needed);
    syncToStorage({
      roomCategory: newCat,
      selectedRoomId: matchingRoom.id,
      roomsCount: needed
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar activeTab="Dashboard" />

      <main className="flex-1 pt-20 pb-16">
        {/* Top Hero Banner */}
        <section className="bg-gradient-to-br from-[#005C55] via-[#0B6B63] to-[#003E39] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-[#9CF2E8] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step-by-Step Tour Plan Dashboard</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {currentUser?.displayName
                    ? `${currentUser.displayName}'s ${destination} Tour Plan`
                    : `Your Step-by-Step ${destination} Tour Plan`}
                </h1>
                <p className="text-xs sm:text-sm text-white/85 max-w-2xl mt-2 leading-relaxed">
                  Follow your complete tour roadmap step by step — from boarding{" "}
                  <strong>{selectedTransport.operator}</strong> to checking in at{" "}
                  <strong>{selectedHotel.name}</strong> ({selectedRoom.categoryLabel}) and tracking your daily itinerary & exact group budget.
                </p>
              </div>

              {/* Top Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5">
                  <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block">
                    Total Trip Cost
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">
                    ৳{budget.total.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-white/80">
                    {travelers} Guests • {nights} Nights
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5">
                  <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block">
                    Per Person Split
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#9CF2E8] block mt-0.5">
                    ৳{budget.perPerson.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-white/80">
                    ৳{budget.total.toLocaleString()} ÷ {travelers}P
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block">
                    Export / Print
                  </span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="mt-1.5 w-full bg-[#9CF2E8] hover:bg-white text-[#00201D] font-extrabold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Tour Plan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Interactive Trip Adjuster Bar */}
            <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/15">
                <label className="text-[10px] uppercase font-bold text-[#9CF2E8] block mb-1">
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    syncToStorage({ destination: e.target.value });
                  }}
                  className="w-full bg-transparent text-white font-extrabold text-xs focus:outline-hidden cursor-pointer [&>option]:text-[#121C2A]"
                >
                  <option value="Cox's Bazar">Cox&apos;s Bazar</option>
                  <option value="Sajek Valley">Sajek Valley</option>
                  <option value="Sreemangal">Sreemangal</option>
                  <option value="Saint Martin's">Saint Martin&apos;s</option>
                  <option value="Bandarban">Bandarban</option>
                  <option value="Sundarbans">Sundarbans</option>
                </select>
              </div>

              <div className="bg-white/10 rounded-xl p-2.5 border border-white/15">
                <label className="text-[10px] uppercase font-bold text-[#9CF2E8] block mb-1">
                  Check-In Date
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      setCheckInDate(e.target.value);
                      syncToStorage({ checkInDate: e.target.value });
                    }
                  }}
                  className="w-full bg-transparent text-white font-extrabold text-xs focus:outline-hidden cursor-pointer"
                />
              </div>

              <div className="bg-white/10 rounded-xl p-2.5 border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block">
                    Travelers
                  </span>
                  <span className="font-extrabold text-xs">{travelers} Guests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const nextT = Math.max(1, travelers - 1);
                      const nextR = Math.max(1, Math.ceil(nextT / roomCapacity));
                      setTravelers(nextT);
                      setRoomsCount(nextR);
                      syncToStorage({ travelers: nextT, roomsCount: nextR });
                    }}
                    className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextT = Math.min(20, travelers + 1);
                      const nextR = Math.max(1, Math.ceil(nextT / roomCapacity));
                      setTravelers(nextT);
                      setRoomsCount(nextR);
                      syncToStorage({ travelers: nextT, roomsCount: nextR });
                    }}
                    className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-2.5 border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block">
                    Duration
                  </span>
                  <span className="font-extrabold text-xs">
                    {nights} Nights ({nights + 1} Days)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const nextN = Math.max(1, nights - 1);
                      setNights(nextN);
                      syncToStorage({ nights: nextN });
                    }}
                    className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextN = Math.min(14, nights + 1);
                      setNights(nextN);
                      syncToStorage({ nights: nextN });
                    }}
                    className="w-6 h-6 rounded bg-white/20 hover:bg-white/30 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-2.5 border border-white/15">
                <label className="text-[10px] uppercase font-bold text-[#9CF2E8] block mb-1">
                  Room Category
                </label>
                <select
                  value={roomCategory}
                  onChange={(e) =>
                    handleSelectRoomCategory(e.target.value as RoomCategoryType)
                  }
                  className="w-full bg-transparent text-white font-extrabold text-xs focus:outline-hidden cursor-pointer [&>option]:text-[#121C2A]"
                >
                  {ROOM_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.shortLabel} (Max {c.maxGuests}P)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Main Step-by-Step Tour Plan Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-8 space-y-8">
          {/* 4-Pillar Step Overview Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "STEP 1",
                title: "Intercity Transport",
                subtitle: `${selectedTransport.operator} (${selectedTransport.seatClass})`,
                meta: `৳${budget.transport.toLocaleString()} (${isRoundTrip ? "Round Trip" : "One Way"})`,
                href: "#step-1",
                color: "bg-[#005C55] text-white"
              },
              {
                step: "STEP 2",
                title: "Hotel & Room Stay",
                subtitle: `${selectedHotel.name}`,
                meta: `${effectiveRooms} × ${selectedRoom.categoryLabel} • ৳${budget.accommodation.toLocaleString()}`,
                href: "#step-2",
                color: "bg-[#0F766E] text-white"
              },
              {
                step: "STEP 3",
                title: `Day-by-Day Itinerary`,
                subtitle: `${budget.days} Days / ${nights} Nights Schedule`,
                meta: `${dailyItinerary.reduce((acc, d) => acc + d.steps.length, 0)} Guided Milestones`,
                href: "#step-3",
                color: "bg-[#005F29] text-white"
              },
              {
                step: "STEP 4",
                title: "Total Budget & Split",
                subtitle: `৳${budget.total.toLocaleString()} Grand Total`,
                meta: `৳${budget.perPerson.toLocaleString()} per person (${travelers}P)`,
                href: "#step-4",
                color: "bg-[#121C2A] text-white"
              }
            ].map((item) => (
              <a
                key={item.step}
                href={item.href}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${item.color}`}
                    >
                      {item.step}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#005C55] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#121C2A]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] font-bold text-[#005C55]">
                  {item.meta}
                </div>
              </a>
            ))}
          </div>

          {/* STEP 1: INTERCITY TRANSPORT PLAN */}
          <section
            id="step-1"
            className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-200 shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#005C55] text-white font-black text-sm flex items-center justify-center shrink-0">
                  01
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#005C55] block">
                    Step 1 of 4 • Departure & Return Mobility
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#121C2A]">
                    Transport & Boarding Schedule
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRoundTrip(!isRoundTrip);
                    syncToStorage({ isRoundTrip: !isRoundTrip });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#EFF4FF] text-[#005C55] font-bold text-xs cursor-pointer hover:bg-[#DEE9FC]"
                >
                  Mode: {isRoundTrip ? "Round Trip (×2)" : "One Way (×1)"}
                </button>
                <Link
                  href="/transport"
                  className="px-3.5 py-1.5 rounded-xl bg-[#005C55] text-white font-bold text-xs hover:bg-[#0F766E] flex items-center gap-1"
                >
                  <span>Change Bus / Transit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-[#F8F9FF] p-4 sm:p-5 rounded-2xl border border-gray-200/80">
              <div className="lg:col-span-4 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Bus className="w-5 h-5 text-[#005C55]" />
                  <h3 className="text-base font-extrabold text-[#121C2A]">
                    {selectedTransport.operator}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#9CF2E8]/60 text-[#00201D]">
                    {selectedTransport.isAC ? "AC" : "Non-AC"} • {selectedTransport.seatClass}
                  </span>
                </div>
                {selectedTransport.coachCode && (
                  <p className="text-xs font-mono font-semibold text-gray-500">
                    Coach Code: {selectedTransport.coachCode}
                  </p>
                )}
                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#005F29]" />
                  Verified Rate • {selectedTransport.source}
                </p>
              </div>

              <div className="lg:col-span-5 flex items-center justify-between gap-3 border-y lg:border-y-0 lg:border-x border-gray-200 py-3 lg:py-0 lg:px-6">
                <div>
                  <span className="text-xs text-gray-400 block">Boarding Point</span>
                  <span className="text-sm sm:text-base font-black text-[#121C2A]">
                    {selectedTransport.departureTime}
                  </span>
                  <span className="text-xs font-bold text-[#005C55] block">
                    {selectedTransport.origin}
                  </span>
                </div>

                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#005C55]" />{" "}
                    {selectedTransport.duration}
                  </span>
                  <div className="w-14 sm:w-20 h-0.5 bg-[#005C55]/40 my-1.5" />
                  <span className="text-[10px] font-bold text-[#005C55]">
                    {isRoundTrip ? "Round Trip" : "One Way"}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Dropping Point</span>
                  <span className="text-sm sm:text-base font-black text-[#121C2A]">
                    {selectedTransport.arrivalTime}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 block">
                    {selectedTransport.destination}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-3 text-left lg:text-right">
                <span className="text-xs text-gray-500 block">
                  ৳{selectedTransport.fare.toLocaleString()}/seat × {travelers}P{" "}
                  {isRoundTrip ? "× 2" : "× 1"}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#005C55] block">
                  ৳{budget.transport.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-[#005F29]">
                  ✓ Synced to Step 4 Budget
                </span>
              </div>
            </div>
          </section>

          {/* STEP 2: HOTEL & ROOM CATEGORY ALLOCATION */}
          <section
            id="step-2"
            className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-200 shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white font-black text-sm flex items-center justify-center shrink-0">
                  02
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E] block">
                    Step 2 of 4 • Verified Accommodation & Room Setup
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#121C2A]">
                    Hotel Check-In & Room Category Plan
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextPlan =
                      selectedMealPlan === "roomOnly"
                        ? "breakfastIncluded"
                        : "roomOnly";
                    setSelectedMealPlan(nextPlan);
                    syncToStorage({ selectedMealPlan: nextPlan });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#EFF4FF] text-[#005C55] font-bold text-xs cursor-pointer hover:bg-[#DEE9FC]"
                >
                  Meal Plan:{" "}
                  {selectedMealPlan === "breakfastIncluded"
                    ? "Breakfast Included"
                    : "Room Only"}
                </button>
                <Link
                  href="/hotels"
                  className="px-3.5 py-1.5 rounded-xl bg-[#005C55] text-white font-bold text-xs hover:bg-[#0F766E] flex items-center gap-1"
                >
                  <span>Change Hotel / Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#F8F9FF] p-4 sm:p-5 rounded-2xl border border-gray-200/80">
              <div className="lg:col-span-3">
                <div className="h-40 w-full rounded-xl overflow-hidden bg-gray-200 relative">
                  <img
                    src={selectedHotel.imageUrl}
                    alt={selectedHotel.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {selectedHotel.priceSegment} • {selectedHotel.starRating}★
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#121C2A]">
                  {selectedHotel.name}
                </h3>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#005C55] shrink-0" />
                  <span>
                    {selectedHotel.address} ({selectedHotel.distanceFromBeach})
                  </span>
                </p>
                {selectedHotel.contactPhone && (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#005C55] shrink-0" />
                    <span>Hotel Desk: {selectedHotel.contactPhone}</span>
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#9CF2E8]/50 text-[#00201D] text-xs font-extrabold">
                    Category: {selectedRoom.categoryLabel}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-[#904D00] border border-amber-200 text-xs font-bold">
                    Max {selectedRoom.maxGuests} Guests/Room → {effectiveRooms}{" "}
                    {effectiveRooms === 1 ? "Room" : "Rooms"} Needed
                  </span>
                </div>
              </div>

              <div className="lg:col-span-3 text-left lg:text-right border-t lg:border-t-0 lg:border-l border-gray-200 pt-3 lg:pt-0 lg:pl-5">
                <span className="text-xs text-gray-500 block">
                  {effectiveRooms} rm × {nights} nt × ৳
                  {hotelNightly.toLocaleString()}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#005C55] block mt-0.5">
                  ৳{budget.accommodation.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-[#005F29] block mt-0.5">
                  {hasIncludedBreakfast
                    ? "✓ Breakfast Included (20% Food Discount)"
                    : "• Room Only Tariff"}
                </span>
              </div>
            </div>
          </section>

          {/* STEP 3: DAY-BY-DAY GUIDED TOUR ITINERARY */}
          <section
            id="step-3"
            className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-200 shadow-xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#005F29] text-white font-black text-sm flex items-center justify-center shrink-0">
                  03
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#005F29] block">
                    Step 3 of 4 • Interactive Day-by-Day & Hour-by-Hour Schedule
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#121C2A]">
                    Your Step-by-Step Tour Timeline ({budget.days} Days / {nights} Nights)
                  </h2>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-500">
                Click any step below to mark it completed during your trip
              </span>
            </div>

            <div className="space-y-6">
              {dailyItinerary.map((dayObj) => (
                <div
                  key={dayObj.day}
                  className="rounded-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="bg-[#EFF4FF] px-4 sm:px-6 py-3.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#121C2A]">
                        {dayObj.title}
                      </h3>
                      <p className="text-[11px] text-gray-600">{dayObj.subtitle}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#005C55] text-white text-[11px] font-bold">
                      Day {dayObj.day} of {budget.days}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {dayObj.steps.map((st, idx) => {
                      const isDone = !!completedSteps[st.id];
                      return (
                        <div
                          key={st.id}
                          onClick={() => toggleStep(st.id)}
                          className={`p-4 sm:px-6 flex items-start gap-3.5 transition-colors cursor-pointer ${
                            isDone ? "bg-emerald-50/40" : "hover:bg-gray-50"
                          }`}
                        >
                          <button
                            type="button"
                            className="mt-0.5 text-[#005C55] shrink-0 cursor-pointer"
                            aria-label="Toggle step completion"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-[#005F29]" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                Step {dayObj.day}.{idx + 1}
                              </span>
                              <span className="text-xs font-extrabold text-[#005C55]">
                                {st.time}
                              </span>
                              <span className="text-[10px] font-bold text-[#904D00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                {st.phase}
                              </span>
                            </div>
                            <h4
                              className={`text-xs sm:text-sm font-bold mt-1 ${
                                isDone
                                  ? "line-through text-gray-400"
                                  : "text-[#121C2A]"
                              }`}
                            >
                              {st.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                              {st.detail}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* STEP 4: COMPLETE DETERMINISTIC BUDGET LEDGER */}
          <section
            id="step-4"
            className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-200 shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#121C2A] text-white font-black text-sm flex items-center justify-center shrink-0">
                  04
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">
                    Step 4 of 4 • Transparent Cost Breakdown & Group Split
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#121C2A]">
                    Deterministic Tour Budget Summary
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-500 mr-1">
                  Contingency Buffer:
                </span>
                {[0, 5, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setContingencyPercent(pct)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      contingencyPercent === pct
                        ? "bg-[#904D00] text-white"
                        : "bg-amber-50 text-[#904D00] border border-amber-200"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#EFF4FF] border border-[#DEE9FC] flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-[#005C55] block text-sm">
                    1. Hotel Stay ({selectedHotel.name})
                  </span>
                  <span className="text-gray-600">
                    {budget.breakdown.accommodationNote}
                  </span>
                </div>
                <span className="text-base font-black text-[#121C2A]">
                  ৳{budget.accommodation.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF4FF] border border-[#DEE9FC] flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-[#005C55] block text-sm">
                    2. Transport ({selectedTransport.operator})
                  </span>
                  <span className="text-gray-600">
                    {budget.breakdown.transportNote}
                  </span>
                </div>
                <span className="text-base font-black text-[#121C2A]">
                  ৳{budget.transport.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF4FF] border border-[#DEE9FC] flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-[#005C55] block text-sm">
                    3. Food & Daily Meals ({travelStyle})
                  </span>
                  <span className="text-gray-600">{budget.breakdown.foodNote}</span>
                </div>
                <span className="text-base font-black text-[#121C2A]">
                  ৳{budget.food.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF4FF] border border-[#DEE9FC] flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-[#005C55] block text-sm">
                    4. Local Transit & Sightseeing Tickets
                  </span>
                  <span className="text-gray-600">
                    {budget.breakdown.localActivitiesNote}
                  </span>
                </div>
                <span className="text-base font-black text-[#121C2A]">
                  ৳{budget.localAndActivities.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-[#005C55] text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#9CF2E8] block">
                  Final Verified Tour Total (Subtotal ৳{budget.subtotal.toLocaleString()} + {contingencyPercent}% Buffer ৳{budget.contingency.toLocaleString()})
                </span>
                <div className="text-2xl sm:text-3xl font-black mt-1">
                  ৳{budget.total.toLocaleString()} BDT{" "}
                  <span className="text-sm font-bold text-[#9CF2E8]">
                    (৳{budget.perPerson.toLocaleString()} / person)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/#planner"
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all"
                >
                  Edit on Home Planner
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-[#9CF2E8] hover:bg-white text-[#00201D] font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

