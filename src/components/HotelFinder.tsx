"use client";

import { useState } from "react";
import {
  ADVANCED_HOTEL_INVENTORY,
  AdvancedHotel,
  RoomOption,
  ROOM_CATEGORIES,
  RoomCategoryType,
  PriceSegmentType,
  COXS_BAZAR_SEASONAL_INFO
} from "@/lib/hotelData";

interface HotelFinderProps {
  onSelectHotelAndRoom?: (
    hotel: AdvancedHotel,
    room: RoomOption,
    mealPlan: "roomOnly" | "breakfastIncluded"
  ) => void;
  selectedHotelId?: string;
  selectedRoomId?: string;
  preferredCategory?: RoomCategoryType;
  onChangePreferredCategory?: (cat: RoomCategoryType) => void;
  nights?: number;
  travelers?: number;
  customRoomsCount?: number;
  maxItems?: number;
}

export default function HotelFinder({
  onSelectHotelAndRoom,
  selectedHotelId,
  selectedRoomId,
  preferredCategory = "couple",
  onChangePreferredCategory,
  nights = 2,
  travelers = 2,
  customRoomsCount,
  maxItems
}: HotelFinderProps) {
  // Filter States
  const [destinationFilter, setDestinationFilter] = useState<string>("coxs-bazar");
  const [segmentFilter, setSegmentFilter] = useState<string>("All");
  const [propertyType, setPropertyType] = useState<string>("All properties");
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [minRating, setMinRating] = useState<number>(0); // 0, 3, 4, 5
  const [requirePool, setRequirePool] = useState<boolean>(false);
  const [requireParking, setRequireParking] = useState<boolean>(false);
  const [requireWifi, setRequireWifi] = useState<boolean>(false);
  const [requireAC, setRequireAC] = useState<boolean>(false);
  const [requireSeaView, setRequireSeaView] = useState<boolean>(false);
  const [requireFreeCancellation, setRequireFreeCancellation] = useState<boolean>(false);
  const [showSeasonalGuide, setShowSeasonalGuide] = useState<boolean>(true);

  // Per-hotel selected room category override: { [hotelId]: RoomCategoryType }
  const [hotelRoomCategoryMap, setHotelRoomCategoryMap] = useState<
    Record<string, RoomCategoryType>
  >({});

  // Active Meal Plan selection map for UI: { [hotelId]: "roomOnly" | "breakfastIncluded" }
  const [mealPlanSelection, setMealPlanSelection] = useState<
    Record<string, "roomOnly" | "breakfastIncluded">
  >({});

  // Side-by-Side Comparison Modal
  const [comparedHotels, setComparedHotels] = useState<string[]>([
    "hotel-sayeman",
    "hotel-longbeach",
    "hotel-cox-west-inn"
  ]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  const getActiveRoomForHotel = (hotel: AdvancedHotel): RoomOption => {
    const cardCategory = hotelRoomCategoryMap[hotel.id] || preferredCategory;

    if (
      selectedHotelId === hotel.id &&
      selectedRoomId &&
      !hotelRoomCategoryMap[hotel.id]
    ) {
      const matchedById = hotel.rooms.find((r) => r.id === selectedRoomId);
      if (matchedById) return matchedById;
    }

    return (
      hotel.rooms.find((r) => r.category === cardCategory) || hotel.rooms[0]
    );
  };

  // Filter application
  const filteredHotels = ADVANCED_HOTEL_INVENTORY.filter((hotel) => {
    if (destinationFilter !== "All" && hotel.destinationSlug !== destinationFilter)
      return false;
    if (segmentFilter !== "All" && hotel.priceSegment !== segmentFilter)
      return false;
    if (propertyType !== "All properties" && hotel.propertyType !== propertyType)
      return false;
    if (minRating > 0 && hotel.starRating < minRating) return false;
    if (requirePool && !hotel.hasPool) return false;
    if (requireParking && !hotel.hasParking) return false;
    if (requireWifi && !hotel.hasWifi) return false;
    if (requireFreeCancellation && !hotel.hasFreeCancellation) return false;

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
      setComparedHotels(comparedHotels.filter((id) => id !== hotelId));
    } else {
      if (comparedHotels.length >= 3) {
        alert("You can compare up to 3 hotels side by side at once.");
        return;
      }
      setComparedHotels([...comparedHotels, hotelId]);
    }
  };

  const getComparedHotelObjects = () => {
    return comparedHotels
      .map((id) => ADVANCED_HOTEL_INVENTORY.find((h) => h.id === id))
      .filter(Boolean) as AdvancedHotel[];
  };

  const getSegmentBadgeColor = (segment: PriceSegmentType) => {
    switch (segment) {
      case "Budget":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "Standard":
        return "bg-sky-100 text-sky-900 border-sky-300";
      case "Premium":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "Luxury":
        return "bg-amber-100 text-amber-900 border-amber-300";
    }
  };

  return (
    <section
      id="hotels"
      className="py-12 sm:py-16 bg-[#F8F9FF] border-y border-[#E5E7EB]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] text-[#005C55] uppercase font-bold tracking-widest bg-[#9CF2E8]/40 px-2.5 py-0.5 rounded-full">
                Cox&apos;s Bazar Verified Hotel Report (2026)
              </span>
              <span className="text-xs text-[#005F29] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span>
                16 Verified Cox&apos;s Bazar Properties
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#121C2A] tracking-tight">
              Hotel Finder & Room Category Selector
            </h2>
            <p className="text-xs sm:text-sm text-[#3E4947] max-w-2xl mt-1">
              Cross-verified tariffs from Rakuten Travel, Trip.com, Travala, Google Hotels, Wego & Official Hotel Desks. Choose from <strong>Couple Room (2P)</strong>, <strong>4 Person Room</strong>, <strong>Connecting Room</strong>, <strong>Big Single Bed (4P)</strong>, or <strong>2 Bed (5P)</strong>.
            </p>
          </div>

          {/* Side by side compare & Seasonal Guide launcher */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setShowSeasonalGuide(!showSeasonalGuide)}
              className="flex-1 sm:flex-initial justify-center bg-[#EFF4FF] border border-[#005C55]/30 text-[#005C55] hover:bg-[#DEE9FC] transition-all px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">insights</span>
              <span>{showSeasonalGuide ? "Hide" : "Show"} Seasonal Rate Report</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCompareModal(true)}
              className="flex-1 sm:flex-initial justify-center bg-[#FFFFFF] border border-[#005C55] text-[#005C55] hover:bg-[#005C55] hover:text-white transition-all px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                compare_arrows
              </span>
              <span>Compare Side-by-Side ({comparedHotels.length}/3)</span>
            </button>
          </div>
        </div>

        {/* Cox's Bazar Market & Seasonal Pricing Report Panel */}
        {showSeasonalGuide && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DEE9FC] shadow-xs mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005C55]">
                  analytics
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#121C2A]">
                  Cox&apos;s Bazar Price Segments & Seasonal Tariff Intelligence
                </h3>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">
                {COXS_BAZAR_SEASONAL_INFO.currencyNote}
              </span>
            </div>

            {/* 4 Price Segments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {COXS_BAZAR_SEASONAL_INFO.segments.map((seg) => {
                const isSelected = segmentFilter === seg.tier;
                return (
                  <button
                    key={seg.tier}
                    type="button"
                    onClick={() =>
                      setSegmentFilter(isSelected ? "All" : seg.tier)
                    }
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#005C55] text-white border-[#005C55] shadow-sm"
                        : "bg-[#F8F9FF] hover:bg-[#EFF4FF] border-gray-200 text-[#121C2A]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider">
                        {seg.tier} Segment
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[#9CF2E8]/60 text-[#005C55]"
                        }`}
                      >
                        {isSelected ? "Filtered ✓" : "Click to Filter"}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-black mt-1 ${
                        isSelected ? "text-[#9CF2E8]" : "text-[#005C55]"
                      }`}
                    >
                      {seg.range}
                    </div>
                    <p
                      className={`text-[10px] mt-1 line-clamp-1 ${
                        isSelected ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      e.g. {seg.examples}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Peak vs Off-Season Notice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-amber-50/80 border border-amber-200/70 p-2.5 rounded-xl">
                <span className="font-extrabold text-[#904D00] block">
                  🔥 Peak Season ({COXS_BAZAR_SEASONAL_INFO.peakSeason.period})
                </span>
                <span className="text-[11px] text-amber-900">
                  {COXS_BAZAR_SEASONAL_INFO.peakSeason.note}
                </span>
              </div>
              <div className="bg-emerald-50/80 border border-emerald-200/70 p-2.5 rounded-xl">
                <span className="font-extrabold text-[#005F29] block">
                  🌧️ Off-Season ({COXS_BAZAR_SEASONAL_INFO.offSeason.period})
                </span>
                <span className="text-[11px] text-emerald-900">
                  {COXS_BAZAR_SEASONAL_INFO.offSeason.note}
                </span>
              </div>
              <div className="bg-[#EFF4FF] border border-[#DEE9FC] p-2.5 rounded-xl">
                <span className="font-extrabold text-[#005C55] block">
                  📞 Direct & OTA Booking Tips
                </span>
                <span className="text-[11px] text-gray-600">
                  Compare official hotel websites (Seagull, Sayeman, Cox Today, Baywatch, Sea Pearl) with Rakuten Travel, Trip.com & Travala.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search & Comprehensive Filters Card */}
        <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-6 border border-[#E5E7EB] shadow-xs mb-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-[#121C2A] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005C55]">
                tune
              </span>
              Interactive Hotel & Room Category Filters
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              Showing <strong>{filteredHotels.length}</strong> of{" "}
              {ADVANCED_HOTEL_INVENTORY.length} verified properties • Party:{" "}
              <strong>{travelers} Guests</strong> ({nights} Nights)
            </span>
          </div>

          {/* Quick Room Category Filter Pills */}
          <div className="bg-[#EFF4FF] p-3.5 rounded-xl border border-[#DEE9FC]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-extrabold text-[#005C55] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">bed</span>
                Select Room Category Across All Hotels:
              </span>
              <span className="text-[11px] text-gray-600 font-medium">
                Click any category below or inside each hotel card
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {ROOM_CATEGORIES.map((cat) => {
                const isActive = preferredCategory === cat.id;
                const neededForCat = Math.max(
                  1,
                  Math.ceil(travelers / cat.maxGuests)
                );
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (onChangePreferredCategory)
                        onChangePreferredCategory(cat.id);
                      setHotelRoomCategoryMap({});
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-[#005C55] text-white border-[#005C55] shadow-sm"
                        : "bg-white text-[#121C2A] border-gray-200 hover:border-[#005C55]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-extrabold">
                        {cat.shortLabel}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#EFF4FF] text-[#005C55]"
                        }`}
                      >
                        Max {cat.maxGuests}P
                      </span>
                    </div>
                    <p
                      className={`text-[10px] mt-1 ${
                        isActive ? "text-[#9CF2E8]" : "text-gray-500"
                      }`}
                    >
                      {cat.description}
                    </p>
                    <div
                      className={`text-[10px] font-bold mt-1.5 pt-1 border-t ${
                        isActive
                          ? "border-white/20 text-white"
                          : "border-gray-100 text-[#005F29]"
                      }`}
                    >
                      For {travelers} guests: {neededForCat}{" "}
                      {neededForCat === 1 ? "room" : "rooms"}
                    </div>
                  </button>
                );
              })}
            </div>
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
                min="1800"
                max="35000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#005C55] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>৳1,800</span>
                <span>৳15,000</span>
                <span>৳35,000</span>
              </div>
            </div>

            {/* Price Segment Filter */}
            <div className="bg-[#EFF4FF] p-3.5 rounded-xl">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                Price Segment
              </label>
              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="w-full text-xs font-bold text-[#121C2A] bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="All">All Segments (Budget to Luxury)</option>
                <option value="Budget">Budget (৳1,800 – ৳3,500)</option>
                <option value="Standard">Standard (৳3,600 – ৳6,000)</option>
                <option value="Premium">Premium (৳4,700 – ৳9,600)</option>
                <option value="Luxury">Luxury (৳10,800+)</option>
              </select>
            </div>

            {/* Destination Filter */}
            <div className="bg-[#EFF4FF] p-3.5 rounded-xl">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                Destination
              </label>
              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="w-full text-xs font-bold text-[#121C2A] bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="coxs-bazar">Cox&apos;s Bazar (16 Hotels)</option>
                <option value="All">All Destinations (17 Hotels)</option>
                <option value="sajek-valley">Sajek Valley</option>
              </select>
            </div>

            {/* Star Rating */}
            <div className="bg-[#EFF4FF] p-3.5 rounded-xl">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                Star Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full text-xs font-bold text-[#121C2A] bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value={0}>Any star rating (2★ – 5★)</option>
                <option value={3}>3 stars and above</option>
                <option value={4}>4 stars and above</option>
                <option value={5}>5 stars luxury only</option>
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
                { label: "✓ Free cancellation", state: requireFreeCancellation, set: setRequireFreeCancellation }
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
          {(maxItems ? filteredHotels.slice(0, maxItems) : filteredHotels).map((hotel) => {
            const currentMealPlan = mealPlanSelection[hotel.id] || "roomOnly";
            const activeRoom = getActiveRoomForHotel(hotel);
            const nightlyPrice =
              currentMealPlan === "breakfastIncluded"
                ? activeRoom.breakfastIncludedPrice
                : activeRoom.roomOnlyPrice;

            const minRoomsForCard = Math.max(
              1,
              Math.ceil(travelers / activeRoom.maxGuests)
            );
            const roomsNeeded =
              customRoomsCount && customRoomsCount >= minRoomsForCard
                ? customRoomsCount
                : minRoomsForCard;
            const totalStayPrice = nightlyPrice * roomsNeeded * nights;
            const isCurrentlySelected = selectedHotelId === hotel.id;
            const isCompared = comparedHotels.includes(hotel.id);

            const handleRoomSelectOnCard = (room: RoomOption) => {
              setHotelRoomCategoryMap((prev) => ({
                ...prev,
                [hotel.id]: room.category
              }));
              if (isCurrentlySelected && onSelectHotelAndRoom) {
                onSelectHotelAndRoom(hotel, room, currentMealPlan);
              }
            };

            const handleMealPlanChangeOnCard = (
              plan: "roomOnly" | "breakfastIncluded"
            ) => {
              setMealPlanSelection((prev) => ({
                ...prev,
                [hotel.id]: plan
              }));
              if (isCurrentlySelected && onSelectHotelAndRoom) {
                onSelectHotelAndRoom(hotel, activeRoom, plan);
              }
            };

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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pr-24">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${getSegmentBadgeColor(
                          hotel.priceSegment
                        )}`}
                      >
                        {hotel.priceSegment} • {hotel.starRating}★
                      </span>
                      {hotel.badge && (
                        <span className="bg-[#FE932C] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          {hotel.badge}
                        </span>
                      )}
                      <span className="bg-[#FFFFFF]/90 backdrop-blur-md text-[10px] font-bold text-[#121C2A] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <span
                          className="material-symbols-outlined text-xs text-[#005F29]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                        <span>{hotel.rateSource}</span>
                      </span>
                    </div>

                    {/* Compare Checkbox */}
                    <button
                      type="button"
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
                      <span>{isCompared ? "Comparing" : "Compare"}</span>
                    </button>

                    {/* Bottom Caption on Image */}
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white gap-2">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-[#9CF2E8] font-semibold mb-0.5">
                          <span className="material-symbols-outlined text-sm">
                            location_on
                          </span>
                          <span className="line-clamp-1">{hotel.distanceFromBeach}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold leading-tight">
                          {hotel.name}
                        </h3>
                        <p className="text-[11px] text-gray-300 line-clamp-1">
                          {hotel.address}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold">
                          <span
                            className="material-symbols-outlined text-amber-300 text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span>{hotel.guestRating} / 10</span>
                        </div>
                        <span className="text-[10px] text-gray-300 block mt-0.5">
                          ({hotel.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5 space-y-3.5">
                    {/* Key Facilities Pills from Report */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#3E4947]">
                      {hotel.facilitiesList.slice(0, 6).map((fac, idx) => (
                        <span
                          key={idx}
                          className="bg-[#EFF4FF] px-2.5 py-0.5 rounded-md font-medium"
                        >
                          ✓ {fac}
                        </span>
                      ))}
                    </div>

                    {/* Contact, Official Site & Booking Platforms Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                      <div className="flex flex-wrap items-center gap-3 text-gray-600">
                        {hotel.contactPhone && (
                          <span className="font-semibold text-[#121C2A]">
                            📞 {hotel.contactPhone}
                          </span>
                        )}
                        <span>
                          Platforms:{" "}
                          <strong className="text-[#005C55]">
                            {hotel.bookingPlatforms.join(", ")}
                          </strong>
                        </span>
                      </div>
                      {hotel.officialWebsite && (
                        <a
                          href={hotel.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#005C55] font-bold hover:underline flex items-center gap-0.5"
                        >
                          <span>Official Site</span>
                          <span className="material-symbols-outlined text-xs">
                            open_in_new
                          </span>
                        </a>
                      )}
                    </div>

                    {/* 5 Room Categories Selector & Meal Plan Box */}
                    <div className="bg-[#EFF4FF] p-3.5 rounded-xl border border-gray-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-[#005C55] uppercase tracking-wider">
                          Select Room Category:
                        </span>
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full text-[#121C2A] border border-gray-200">
                          {roomsNeeded} {roomsNeeded === 1 ? "Room" : "Rooms"} for{" "}
                          {travelers} {travelers === 1 ? "Guest" : "Guests"}
                        </span>
                      </div>

                      {/* 5 Clickable Room Category Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {hotel.rooms.map((rm) => {
                          const isSelectedRoom = rm.id === activeRoom.id;
                          return (
                            <button
                              key={rm.id}
                              type="button"
                              onClick={() => handleRoomSelectOnCard(rm)}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                                isSelectedRoom
                                  ? "bg-[#005C55] text-white border-[#005C55] shadow-xs"
                                  : "bg-white text-[#121C2A] border-gray-200 hover:border-[#005C55]/50"
                              }`}
                            >
                              <span>{rm.categoryLabel}</span>
                              <span
                                className={`text-[9px] px-1 py-0.2 rounded ${
                                  isSelectedRoom
                                    ? "bg-white/20 text-white"
                                    : "bg-[#EFF4FF] text-[#005C55]"
                                }`}
                              >
                                {rm.maxGuests}P
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Room Details Banner */}
                      <div className="bg-white/80 p-2.5 rounded-lg border border-gray-200/60 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold text-[#121C2A]">
                          <span>Room: {activeRoom.name}</span>
                          <span className="text-[#005C55]">
                            {activeRoom.viewType}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-medium">
                          🛏️ {activeRoom.bedType} •{" "}
                          {activeRoom.hasAC ? "❄️ AC" : "🌿 Non-AC"}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-[#904D00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 leading-snug">
                            👥 Max {activeRoom.maxGuests} Guests/Room —{" "}
                            {activeRoom.occupancyRule}
                          </span>
                          <span className="text-[10px] font-extrabold text-[#005F29] shrink-0">
                            → {roomsNeeded} {roomsNeeded === 1 ? "room" : "rooms"}{" "}
                            ({travelers} guests)
                          </span>
                        </div>
                      </div>

                      {/* Meal Plan Radio Options */}
                      <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleMealPlanChangeOnCard("roomOnly")}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                            currentMealPlan === "roomOnly"
                              ? "bg-white border-[#005C55] shadow-xs ring-1 ring-[#005C55]"
                              : "bg-white/60 border-gray-200 hover:bg-white"
                          }`}
                        >
                          <span className="block font-bold text-gray-800">
                            Room Only
                          </span>
                          <span className="text-[11px] text-gray-500">
                            ৳{activeRoom.roomOnlyPrice.toLocaleString()} / night
                            / room
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleMealPlanChangeOnCard("breakfastIncluded")
                          }
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                            currentMealPlan === "breakfastIncluded"
                              ? "bg-white border-[#005C55] shadow-xs ring-1 ring-[#005C55]"
                              : "bg-white/60 border-gray-200 hover:bg-white"
                          }`}
                        >
                          <span className="block font-bold text-[#005F29] flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                              restaurant
                            </span>
                            Breakfast Included
                          </span>
                          <span className="text-[11px] text-gray-500">
                            ৳
                            {activeRoom.breakfastIncludedPrice.toLocaleString()}{" "}
                            / night / room
                          </span>
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
                      <span className="text-xs text-gray-500">
                        / room / night
                      </span>
                    </div>
                    <div className="text-[11px] text-[#121C2A] font-bold mt-0.5">
                      Total: ৳{totalStayPrice.toLocaleString()} ({roomsNeeded}{" "}
                      {roomsNeeded === 1 ? "room" : "rooms"} × {nights}{" "}
                      {nights === 1 ? "night" : "nights"})
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {activeRoom.categoryLabel} • {hotel.priceSegment} Segment
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectHotelAndRoom) {
                        onSelectHotelAndRoom(
                          hotel,
                          activeRoom,
                          currentMealPlan
                        );
                      }
                      const budgetSection = document.getElementById("budget");
                      if (budgetSection)
                        budgetSection.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isCurrentlySelected
                        ? "bg-[#005F29] text-white hover:bg-[#087A38]"
                        : "bg-[#005C55] text-white hover:bg-[#0F766E]"
                    }`}
                  >
                    <span>
                      {isCurrentlySelected
                        ? "✓ Linked to Budget"
                        : "Connect to Trip Budget"}
                    </span>
                    <span className="material-symbols-outlined text-sm">
                      arrow_downward
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {maxItems && filteredHotels.length > maxItems && (
          <div className="mt-8 text-center">
            <a
              href="/hotels"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#005C55] hover:bg-[#0F766E] text-white font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-3.5 rounded-2xl shadow-md transition-all text-center"
            >
              <span>View All {ADVANCED_HOTEL_INVENTORY.length} Verified Hotels on Dedicated Hotels Page</span>
              <span className="material-symbols-outlined text-base shrink-0">arrow_forward</span>
            </a>
          </div>
        )}

        {/* SIDE-BY-SIDE HOTEL COMPARISON MODAL */}
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div className="pr-2">
                  <h3 className="text-base sm:text-xl font-extrabold text-[#121C2A] flex items-center gap-1.5 sm:gap-2">
                    <span className="material-symbols-outlined text-[#005C55]">
                      compare_arrows
                    </span>
                    <span>Hotel & Room Category Comparison Matrix</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Compare verified Cox&apos;s Bazar hotels, room categories, contacts, and total stay costs for {travelers} guests ({nights} nights).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCompareModal(false)}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
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
                        <th
                          key={h.id}
                          className="py-3 px-4 font-extrabold text-[#121C2A] text-sm w-1/4"
                        >
                          {h.name}
                          <span className="block text-[10px] text-[#005C55] font-bold mt-0.5">
                            {h.priceSegment} • {h.starRating}★
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">
                        Active Room Category
                      </td>
                      {getComparedHotelObjects().map((h) => {
                        const rm = getActiveRoomForHotel(h);
                        return (
                          <td
                            key={h.id}
                            className="py-3 px-4 font-bold text-[#121C2A]"
                          >
                            {rm.categoryLabel} (Max {rm.maxGuests}P)
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">
                        Rate per Room / Night
                      </td>
                      {getComparedHotelObjects().map((h) => {
                        const rm = getActiveRoomForHotel(h);
                        return (
                          <td
                            key={h.id}
                            className="py-3 px-4 font-black text-[#005C55] text-sm"
                          >
                            ৳{rm.roomOnlyPrice.toLocaleString()} (Room Only)
                            <span className="block text-[10px] font-semibold text-[#005F29]">
                              ৳{rm.breakfastIncludedPrice.toLocaleString()} (w/ Breakfast)
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">
                        Total Stay ({travelers} Guests, {nights} Nights)
                      </td>
                      {getComparedHotelObjects().map((h) => {
                        const rm = getActiveRoomForHotel(h);
                        const rNeeded = Math.max(
                          1,
                          Math.ceil(travelers / rm.maxGuests)
                        );
                        return (
                          <td
                            key={h.id}
                            className="py-3 px-4 font-bold text-gray-900"
                          >
                            ৳{(rm.roomOnlyPrice * rNeeded * nights).toLocaleString()}{" "}
                            <span className="text-[10px] text-gray-500 font-normal">
                              ({rNeeded} rm × {nights} nt)
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">
                        Location & Beach Proximity
                      </td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 text-gray-700">
                          {h.distanceFromBeach}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">
                        Contact & Booking Platforms
                      </td>
                      {getComparedHotelObjects().map((h) => (
                        <td key={h.id} className="py-3 px-4 text-gray-700">
                          {h.contactPhone && (
                            <span className="block font-semibold text-[#121C2A]">
                              {h.contactPhone}
                            </span>
                          )}
                          <span>{h.bookingPlatforms.join(", ")}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50/50">
                        Action
                      </td>
                      {getComparedHotelObjects().map((h) => {
                        const rm = getActiveRoomForHotel(h);
                        return (
                          <td key={h.id} className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => {
                                if (onSelectHotelAndRoom) {
                                  onSelectHotelAndRoom(h, rm, "roomOnly");
                                }
                                setShowCompareModal(false);
                                const budgetSec =
                                  document.getElementById("budget");
                                if (budgetSec)
                                  budgetSec.scrollIntoView({
                                    behavior: "smooth"
                                  });
                              }}
                              className="w-full bg-[#005C55] hover:bg-[#0F766E] text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              Select This Hotel
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
