"use client";

import { useState } from "react";
import { ADVANCED_HOTEL_INVENTORY, AdvancedHotel, RoomOption } from "@/lib/hotelData";

interface HotelFinderProps {
  onSelectHotelAndRoom?: (hotel: AdvancedHotel, room: RoomOption, mealPlan: "roomOnly" | "breakfastIncluded") => void;
  selectedHotelId?: string;
  selectedRoomId?: string;
  nights?: number;
  travelers?: number;
}

export default function HotelFinder({
  onSelectHotelAndRoom,
  selectedHotelId,
  selectedRoomId,
  nights = 2,
  travelers = 2
}: HotelFinderProps) {
  // Filter States
  const [destinationFilter, setDestinationFilter] = useState<string>("All");
  const [propertyType, setPropertyType] = useState<string>("All properties");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number>(0); // 0, 3, 4, 5
  const [breakfastFilter, setBreakfastFilter] = useState<string>("any"); // "any" | "included" | "none"
  const [requirePool, setRequirePool] = useState<boolean>(false);
  const [requireParking, setRequireParking] = useState<boolean>(false);
  const [requireWifi, setRequireWifi] = useState<boolean>(false);
  const [requireAC, setRequireAC] = useState<boolean>(false);
  const [requireSeaView, setRequireSeaView] = useState<boolean>(false);
  const [requireFreeCancellation, setRequireFreeCancellation] = useState<boolean>(false);

  // Active Meal Plan selection map for UI: { [hotelId]: "roomOnly" | "breakfastIncluded" }
  const [mealPlanSelection, setMealPlanSelection] = useState<Record<string, "roomOnly" | "breakfastIncluded">>({});

  // Side-by-Side Comparison Modal
  const [comparedHotels, setComparedHotels] = useState<string[]>(["hotel-sayeman", "hotel-longbeach", "hotel-beachway"]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Filter application
  const filteredHotels = ADVANCED_HOTEL_INVENTORY.filter((hotel) => {
    if (destinationFilter !== "All" && hotel.destinationSlug !== destinationFilter) return false;
    if (propertyType !== "All properties" && hotel.propertyType !== propertyType) return false;
    if (minRating > 0 && hotel.starRating < minRating) return false;
    if (requirePool && !hotel.hasPool) return false;
    if (requireParking && !hotel.hasParking) return false;
    if (requireWifi && !hotel.hasWifi) return false;
    if (requireFreeCancellation && !hotel.hasFreeCancellation) return false;

    // Check if at least one room fits price & criteria
    const matchingRooms = hotel.rooms.filter((room) => {
      if (room.roomOnlyPrice > maxPrice) return false;
      if (requireAC && !room.hasAC) return false;
      if (requireSeaView && room.viewType !== "Sea View") return false;
      return true;
    });

    return matchingRooms.length > 0;
  });

  const toggleCompare = (hotelId: string) => {
    if (comparedHotels.includes(hotelId)) {
      setComparedHotels(comparedHotels.filter(id => id !== hotelId));
    } else {
      if (comparedHotels.length >= 3) {
        alert("You can compare up to 3 hotels side by side at once.");
        return;
      }
      setComparedHotels([...comparedHotels, hotelId]);
    }
  };

  const getComparedHotelObjects = () => {
    return comparedHotels.map(id => ADVANCED_HOTEL_INVENTORY.find(h => h.id === id)).filter(Boolean) as AdvancedHotel[];
  };

  return (
    <section id="hotels" className="py-12 sm:py-16 bg-[#F8F9FF] border-y border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] text-[#005C55] uppercase font-bold tracking-widest bg-[#9CF2E8]/40 px-2.5 py-0.5 rounded-full">
                Accommodation Intelligence
              </span>
              <span className="text-xs text-[#005F29] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span>
                Verified Tariffs
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#121C2A] tracking-tight">
              Hotel Finder & Rate Inspector
            </h2>
            <p className="text-xs sm:text-sm text-[#3E4947] max-w-2xl mt-1">
              Select verified stays with granular breakdown of room-only vs. breakfast rates, pool privileges, and occupancy. Selected hotels instantly calibrate your complete travel budget.
            </p>
          </div>

          {/* Side by side compare launcher */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowCompareModal(true)}
              className="w-full sm:w-auto bg-[#FFFFFF] border border-[#005C55] text-[#005C55] hover:bg-[#005C55] hover:text-white transition-all px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">compare_arrows</span>
              <span>Compare Hotels Side-by-Side ({comparedHotels.length}/3)</span>
            </button>
          </div>
        </div>

        {/* Search & Comprehensive Filters Card */}
        <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 border border-[#E5E7EB] shadow-xs mb-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-[#121C2A] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005C55]">tune</span>
              Interactive Hotel Filters
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredHotels.length} of {ADVANCED_HOTEL_INVENTORY.length} verified Bangladesh properties
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Max Price Slider */}
            <div className="bg-[#EFF4FF] p-3.5 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  Max Room Rate
                </label>
                <span className="text-xs font-black text-[#005C55]">
                  ৳{maxPrice.toLocaleString()} / night
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#005C55] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>৳1,000</span>
                <span>৳10,000</span>
                <span>৳20,000</span>
              </div>
            </div>

            {/* Accommodation Type */}
            <div className="bg-[#EFF4FF] p-3.5 rounded-xl">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full text-xs font-bold text-[#121C2A] bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="All properties">All properties</option>
                <option value="Hotel">Hotel</option>
                <option value="Resort">Resort</option>
                <option value="Guesthouse">Guesthouse</option>
                <option value="Serviced Apartment">Serviced Apartment</option>
              </select>
            </div>

            {/* Star Rating */}
            <div className="bg-[#EFF4FF] p-3.5 rounded-xl">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                Hotel Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full text-xs font-bold text-[#121C2A] bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value={0}>Any rating</option>
                <option value={3}>3 stars and above</option>
                <option value={4}>4 stars and above</option>
                <option value={5}>5 stars luxury only</option>
              </select>
            </div>

            {/* Breakfast Options */}
            <div className="bg-[#EFF4FF] p-3.5 rounded-xl">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                Breakfast Preference
              </label>
              <select
                value={breakfastFilter}
                onChange={(e) => setBreakfastFilter(e.target.value)}
                className="w-full text-xs font-bold text-[#121C2A] bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="any">Any breakfast option</option>
                <option value="included">Breakfast included in room rate</option>
                <option value="extra">Breakfast available for extra fee</option>
                <option value="none">No breakfast needed (Room only)</option>
              </select>
            </div>
          </div>

          {/* Facilities and Amenities Toggles */}
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Facilities and Amenities
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "🏊 Swimming pool", state: requirePool, set: setRequirePool },
                { label: "🚗 Free parking", state: requireParking, set: setRequireParking },
                { label: "📶 Free Wi-Fi", state: requireWifi, set: setRequireWifi },
                { label: "❄️ Air-conditioned (AC)", state: requireAC, set: setRequireAC },
                { label: "🌊 Sea view or beachfront", state: requireSeaView, set: setRequireSeaView },
                { label: "✓ Free cancellation", state: requireFreeCancellation, set: setRequireFreeCancellation },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => item.set(!item.state)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    item.state
                      ? "bg-[#9CF2E8] text-[#00201D] border-[#005C55] shadow-xs"
                      : "bg-[#EFF4FF] text-[#3E4947] border-gray-200 hover:bg-[#DEE9FC]"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHotels.map((hotel) => {
            const currentMealPlan = mealPlanSelection[hotel.id] || "roomOnly";
            const primaryRoom = hotel.rooms[0];
            const nightlyPrice = currentMealPlan === "breakfastIncluded"
              ? primaryRoom.breakfastIncludedPrice
              : primaryRoom.roomOnlyPrice;
            const totalStayPrice = nightlyPrice * nights;
            const isCurrentlySelected = selectedHotelId === hotel.id;
            const isCompared = comparedHotels.includes(hotel.id);

            return (
              <div
                key={hotel.id}
                className={`bg-[#FFFFFF] rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isCurrentlySelected
                    ? "border-[#005C55] ring-2 ring-[#005C55]/30 shadow-lg"
                    : "border-[#E5E7EB] hover:shadow-md"
                }`}
              >
                <div>
                  {/* Hotel Header Image & Badges */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {hotel.badge && (
                        <span className="bg-[#FE932C] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {hotel.badge}
                        </span>
                      )}
                      <span className="bg-[#FFFFFF]/90 backdrop-blur-md text-[11px] font-bold text-[#121C2A] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <span className="material-symbols-outlined text-xs text-[#005F29]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span>{hotel.rateSource}</span>
                      </span>
                    </div>

                    {/* Compare Checkbox */}
                    <button
                      onClick={() => toggleCompare(hotel.id)}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
                        isCompared
                          ? "bg-[#005C55] text-white"
                          : "bg-white/90 text-gray-800 hover:bg-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {isCompared ? "check_box" : "check_box_outline_blank"}
                      </span>
                      <span>{isCompared ? "In Comparison" : "Compare"}</span>
                    </button>

                    {/* Bottom Caption on Image */}
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-[#9CF2E8] font-semibold mb-0.5">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span>{hotel.distanceFromBeach}</span>
                        </div>
                        <h3 className="text-xl font-bold leading-tight">{hotel.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold">
                          <span className="material-symbols-outlined text-amber-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span>{hotel.guestRating} / 10</span>
                        </div>
                        <span className="text-[10px] text-gray-300 block mt-0.5">({hotel.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5 space-y-4">
                    {/* Key Facilities Pills */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#3E4947]">
                      {hotel.hasPool && (
                        <span className="bg-[#EFF4FF] px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                          🏊 {hotel.poolDetails}
                        </span>
                      )}
                      {hotel.hasParking && (
                        <span className="bg-[#EFF4FF] px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                          🚗 {hotel.parkingDetails}
                        </span>
                      )}
                      {hotel.hasWifi && (
                        <span className="bg-[#EFF4FF] px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                          📶 High-speed Wi-Fi
                        </span>
                      )}
                      {hotel.hasFreeCancellation && (
                        <span className="bg-[#DCFCE7] text-[#005F29] px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                          ✓ Free Cancellation
                        </span>
                      )}
                    </div>

                    {/* Room & Meal Plan Selection */}
                    <div className="bg-[#EFF4FF] p-3 rounded-xl border border-gray-200/60 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#121C2A]">
                        <span>Room: {primaryRoom.name}</span>
                        <span className="text-[#005C55]">{primaryRoom.viewType}</span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {primaryRoom.bedType} • Max {primaryRoom.maxGuests} Guests • {primaryRoom.hasAC ? "AC" : "Non-AC"}
                      </p>

                      {/* Meal Plan Radio Options */}
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setMealPlanSelection({ ...mealPlanSelection, [hotel.id]: "roomOnly" })}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                            currentMealPlan === "roomOnly"
                              ? "bg-white border-[#005C55] shadow-xs ring-1 ring-[#005C55]"
                              : "bg-white/60 border-gray-200 hover:bg-white"
                          }`}
                        >
                          <span className="block font-bold text-gray-800">Room Only</span>
                          <span className="text-[11px] text-gray-500">৳{primaryRoom.roomOnlyPrice.toLocaleString()} / night</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMealPlanSelection({ ...mealPlanSelection, [hotel.id]: "breakfastIncluded" })}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                            currentMealPlan === "breakfastIncluded"
                              ? "bg-white border-[#005C55] shadow-xs ring-1 ring-[#005C55]"
                              : "bg-white/60 border-gray-200 hover:bg-white"
                          }`}
                        >
                          <span className="block font-bold text-[#005F29] flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">restaurant</span>
                            Breakfast Included
                          </span>
                          <span className="text-[11px] text-gray-500">৳{primaryRoom.breakfastIncludedPrice.toLocaleString()} / night</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Cost & Direct Budget Sync Row */}
                <div className="p-4 sm:p-5 pt-3 border-t border-gray-100 bg-[#F8F9FF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl font-black text-[#005C55]">
                        ৳{nightlyPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">/ room / night</span>
                    </div>
                    <div className="text-[11px] text-[#3E4947] font-semibold mt-0.5">
                      Total: ৳{totalStayPrice.toLocaleString()} for {nights} nights
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Taxes, Wi-Fi & service charges included
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectHotelAndRoom) {
                        onSelectHotelAndRoom(hotel, primaryRoom, currentMealPlan);
                      }
                      const budgetSection = document.getElementById("budget");
                      if (budgetSection) budgetSection.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isCurrentlySelected
                        ? "bg-[#005F29] text-white hover:bg-[#087A38]"
                        : "bg-[#005C55] text-white hover:bg-[#0F766E]"
                    }`}
                  >
                    <span>{isCurrentlySelected ? "✓ Linked to Budget" : "Connect to Trip Budget"}</span>
                    <span className="material-symbols-outlined text-sm">arrow_downward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* SIDE-BY-SIDE HOTEL COMPARISON MODAL */}
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div className="pr-2">
                  <h3 className="text-base sm:text-xl font-extrabold text-[#121C2A] flex items-center gap-1.5 sm:gap-2">
                    <span className="material-symbols-outlined text-[#005C55]">compare_arrows</span>
                    <span>Hotel Comparison Matrix</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Compare features, tariffs, included facilities, and transparent total stay costs.
                  </p>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Comparison Table */}
              <div className="mt-4 sm:mt-6 overflow-x-auto pb-2">
                <table className="w-full min-w-[550px] text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 font-bold text-gray-500 uppercase tracking-wider w-1/4">
                        Feature
                      </th>
                      {getComparedHotelObjects().map((h) => (
                        <th key={h.id} className="py-3 px-4 font-extrabold text-[#121C2A] text-sm w-1/4">
                          {h.name}
                          {h.badge && (
                            <span className="block text-[10px] text-[#FE932C] font-bold mt-0.5">
                              {h.badge}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Price per night</td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 font-black text-[#005C55] text-sm">
                          ৳{h.rooms[0].roomOnlyPrice.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Example Total ({nights} Nights)</td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 font-bold text-gray-900">
                          ৳{(h.rooms[0].roomOnlyPrice * nights).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Air Conditioned (AC)</td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 text-[#005F29] font-bold">
                          {h.rooms[0].hasAC ? "Yes (Included)" : "Non-AC"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Breakfast Options</td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 font-medium text-gray-800">
                          Available for +৳{(h.rooms[0].breakfastIncludedPrice - h.rooms[0].roomOnlyPrice).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Swimming Pool</td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 text-gray-700">
                          {h.hasPool ? h.poolDetails : "No pool"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Parking Facility</td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 text-gray-700">
                          {h.parkingDetails}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">View & Proximity</td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 text-gray-700">
                          {h.rooms[0].viewType} • {h.distanceFromBeach}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Station / Airport Pickup</td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 text-gray-700">
                          {h.transportPickup}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Action</td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4">
                          <button
                            onClick={() => {
                              if (onSelectHotelAndRoom) {
                                onSelectHotelAndRoom(h, h.rooms[0], "roomOnly");
                              }
                              setShowCompareModal(false);
                              const budgetSec = document.getElementById("budget");
                              if (budgetSec) budgetSec.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="w-full bg-[#005C55] hover:bg-[#0F766E] text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Select This Hotel
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Recommendation summary row */}
              <div className="mt-6 p-4 rounded-xl bg-[#EFF4FF] border border-[#DEE9FC] flex flex-wrap items-center justify-between gap-4 text-xs">
                <span className="font-bold text-[#121C2A]">
                  💡 Ghuri.ai Recommendation:
                </span>
                <span className="text-[#3E4947]">
                  <strong>Cheapest:</strong> Beach Way (৳1,800) • <strong>Best Value:</strong> Long Beach (৳4,200 with pool) • <strong>Luxury Pick:</strong> Sayeman Beach Resort (৳8,200 Oceanfront)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
