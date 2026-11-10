"use client";

import { useState, useMemo } from "react";
import { SAMPLE_TRANSPORTS, TransportOption } from "@/lib/data";
import {
  Bus,
  Train,
  Plane,
  Ship,
  ArrowRight,
  ShieldCheck,
  Clock,
  Search,
  Sparkles,
  Utensils,
  Armchair,
  MapPin
} from "lucide-react";

interface TransportComparisonProps {
  onSelectTransport?: (transport: TransportOption) => void;
  selectedTransportId?: string;
  travelers?: number;
  isRoundTrip?: boolean;
  maxItems?: number;
}

export default function TransportComparison({
  onSelectTransport,
  selectedTransportId,
  travelers = 2,
  isRoundTrip = true,
  maxItems
}: TransportComparisonProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [routeFilter, setRouteFilter] = useState<string>("all");
  const [acFilter, setAcFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"default" | "fare-asc" | "savings" | "seats">("default");

  const filteredTransport = useMemo(() => {
    const filtered = SAMPLE_TRANSPORTS.filter((t) => {
      if (activeFilter !== "all" && t.type !== activeFilter) return false;
      if (routeFilter !== "all") {
        const destLower = t.destination.toLowerCase();
        const coachLower = (t.coachCode || "").toLowerCase();
        if (routeFilter === "Cox's Bazar") {
          const isCox =
            destLower.includes("cox") ||
            destLower.includes("kolatoli") ||
            destLower.includes("jhawtala") ||
            destLower.includes("dolphin") ||
            coachLower.includes("cox");
          if (!isCox) return false;
        } else if (!destLower.includes(routeFilter.toLowerCase())) {
          return false;
        }
      }
      if (acFilter === "ac" && !t.isAC) return false;
      if (acFilter === "non-ac" && t.isAC) return false;

      if (classFilter === "sleeper" && !t.seatClass.toLowerCase().includes("sleeper")) {
        return false;
      }
      if (
        classFilter === "b-class" &&
        !t.seatClass.toLowerCase().includes("b-class") &&
        !t.seatClass.toLowerCase().includes("suite") &&
        !t.seatClass.toLowerCase().includes("business")
      ) {
        return false;
      }
      if (classFilter === "e-class" && !t.seatClass.toLowerCase().includes("e-class")) {
        return false;
      }
      if (classFilter === "offers" && (!t.savings || t.savings <= 0)) {
        return false;
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchOp = t.operator.toLowerCase().includes(q);
        const matchCode = (t.coachCode || "").toLowerCase().includes(q);
        const matchOrig = t.origin.toLowerCase().includes(q);
        const matchDest = t.destination.toLowerCase().includes(q);
        const matchClass = t.seatClass.toLowerCase().includes(q);
        if (!matchOp && !matchCode && !matchOrig && !matchDest && !matchClass) {
          return false;
        }
      }

      return true;
    });

    if (sortBy === "fare-asc") {
      return [...filtered].sort((a, b) => a.fare - b.fare);
    }
    if (sortBy === "savings") {
      return [...filtered].sort((a, b) => (b.savings || 0) - (a.savings || 0));
    }
    if (sortBy === "seats") {
      return [...filtered].sort((a, b) => (b.seatsLeft || 0) - (a.seatsLeft || 0));
    }
    return filtered;
  }, [activeFilter, routeFilter, acFilter, classFilter, searchQuery, sortBy]);

  const getIcon = (type: TransportOption["type"]) => {
    switch (type) {
      case "bus":
        return <Bus className="w-5 h-5 text-emerald-600" />;
      case "train":
        return <Train className="w-5 h-5 text-indigo-600" />;
      case "flight":
        return <Plane className="w-5 h-5 text-sky-600" />;
      case "ferry":
        return <Ship className="w-5 h-5 text-teal-600" />;
    }
  };

  const multiplier = isRoundTrip ? 2 : 1;
  const displayedTransport = maxItems
    ? filteredTransport.slice(0, maxItems)
    : filteredTransport;

  return (
    <section
      id="transport"
      className="py-12 sm:py-16 bg-[#FAFAF7] border-b border-gray-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005C55]/10 text-[#005C55] text-xs font-semibold uppercase tracking-wider mb-2">
              <Bus className="w-3.5 h-3.5" />
              Multi-Modal Mobility ({SAMPLE_TRANSPORTS.length} Verified Schedules)
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#121C2A] tracking-tight">
              Bangladesh Transport Comparison
            </h2>
            <p className="text-gray-600 mt-1 max-w-2xl text-xs sm:text-sm md:text-base">
              Compare {SAMPLE_TRANSPORTS.length} live coach schedules (Soudia, Desh Travels, Green Saintmartin, Hanif, Shohagh, Shyamoli, Imperial Sleeper & more), trains, flights, and launches for{" "}
              <strong>
                {travelers} {travelers === 1 ? "traveler" : "travelers"}
              </strong>
              .
            </p>
          </div>

          {/* Transport mode selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFF4FF] rounded-2xl self-start md:self-auto">
            {[
              { id: "all", label: `All (${SAMPLE_TRANSPORTS.length})` },
              {
                id: "bus",
                label: `Bus (${SAMPLE_TRANSPORTS.filter((x) => x.type === "bus").length})`
              },
              { id: "train", label: "Train" },
              { id: "flight", label: "Flight" },
              { id: "ferry", label: "Ferry" }
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveFilter(mode.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === mode.id
                    ? "bg-[#005C55] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search, Route & Class Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs mb-6 space-y-3.5">
          {/* Top Row: Search Input & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bus operator (e.g. Desh Travels, Hanif, Shohagh, Imperial), boarding counter (Abdullahpur, Gabtoli, Kalabagan), or coach code..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F9FF] border border-gray-200 text-xs sm:text-sm font-medium text-[#121C2A] placeholder:text-gray-400 focus:outline-none focus:border-[#005C55]"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "default" | "fare-asc" | "savings" | "seats")
                }
                className="px-3 py-2 rounded-xl bg-[#EFF4FF] border border-gray-200 text-xs font-bold text-[#121C2A] focus:outline-none focus:border-[#005C55] cursor-pointer"
              >
                <option value="default">Departure Schedule</option>
                <option value="fare-asc">Lowest Fare First</option>
                <option value="savings">Highest Discount Savings</option>
                <option value="seats">Most Seats Available</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Route, Seat Class & AC Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">
                Route:
              </span>
              {[
                { id: "all", label: "All Routes" },
                { id: "Cox's Bazar", label: "Cox's Bazar (Kolatoli / Jhawtala / Dolphin)" },
                { id: "Saint Martin", label: "Saint Martin's" },
                { id: "Sreemangal", label: "Sreemangal" }
              ].map((rt) => (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => setRouteFilter(rt.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    routeFilter === rt.id
                      ? "bg-[#9CF2E8] text-[#00201D] border border-[#005C55]"
                      : "bg-[#EFF4FF] text-[#121C2A] hover:bg-[#DEE9FC]"
                  }`}
                >
                  {rt.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Seat Types" },
                { id: "sleeper", label: "🛏️ Sleeper" },
                { id: "b-class", label: "💺 B-Class / Suite" },
                { id: "e-class", label: "🚌 E-Class" },
                { id: "offers", label: "🔥 Discount Offers" }
              ].map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setClassFilter(cls.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    classFilter === cls.id
                      ? "bg-[#005C55] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cls.label}
                </button>
              ))}

              <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" />

              {[
                { id: "all", label: "All" },
                { id: "ac", label: "❄️ AC" },
                { id: "non-ac", label: "🌿 Non-AC" }
              ].map((ac) => (
                <button
                  key={ac.id}
                  type="button"
                  onClick={() => setAcFilter(ac.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    acFilter === ac.id
                      ? "bg-[#121C2A] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {ac.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Count Summary */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold text-gray-500">
            Showing{" "}
            <span className="text-[#121C2A] font-extrabold">
              {displayedTransport.length}
            </span>{" "}
            of{" "}
            <span className="text-[#005C55] font-extrabold">
              {filteredTransport.length}
            </span>{" "}
            matching schedules
          </p>
          {searchQuery || classFilter !== "all" || acFilter !== "all" || routeFilter !== "all" ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setClassFilter("all");
                setAcFilter("all");
                setRouteFilter("all");
                setActiveFilter("all");
              }}
              className="text-xs font-bold text-[#005C55] hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          ) : null}
        </div>

        {/* Transport List */}
        <div className="space-y-3.5">
          {displayedTransport.map((t) => {
            const isSelected = selectedTransportId === t.id;
            const totalForParty = t.fare * travelers * multiplier;

            return (
              <div
                key={t.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-white border-[#005C55] ring-2 ring-[#005C55]/30 shadow-md"
                    : t.isSoldOut
                    ? "bg-gray-50/80 border-gray-200 opacity-85"
                    : "bg-white border-gray-200 hover:border-[#005C55]/40 hover:shadow-md"
                }`}
              >
                {/* Operator & Coach Code Info */}
                <div className="flex items-start gap-3 sm:gap-4 lg:w-[34%]">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#EFF4FF] border border-gray-200 flex items-center justify-center shrink-0 shadow-xs">
                    {getIcon(t.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="font-extrabold text-[#121C2A] text-sm sm:text-base">
                        {t.operator}
                      </h3>
                      {t.isAC ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          AC
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Non AC
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EFF4FF] text-[#005C55] border border-[#005C55]/20">
                        {t.seatClass}
                      </span>
                      {t.mealIncluded && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Utensils className="w-2.5 h-2.5" /> Meal Included
                        </span>
                      )}
                    </div>

                    {t.coachCode && (
                      <p className="text-[11px] font-mono font-semibold text-gray-500 mt-0.5 break-all">
                        Coach: {t.coachCode}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {t.isSoldOut ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200">
                          Sold Out
                        </span>
                      ) : typeof t.seatsLeft === "number" ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            t.seatsLeft <= 10
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <Armchair className="w-3 h-3" /> Seats left: {t.seatsLeft}
                        </span>
                      ) : null}

                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                        {t.source}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timing & Boarding / Dropping Point */}
                <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-6 border-y lg:border-y-0 lg:border-x border-gray-100 py-3 lg:py-0 lg:px-6 w-full lg:w-[38%]">
                  <div className="text-left min-w-0 flex-1">
                    <span className="text-xs sm:text-base font-extrabold text-[#121C2A] block">
                      {t.departureTime}
                    </span>
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-600 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-[#005C55] shrink-0" />
                      <span className="truncate">{t.origin}</span>
                    </p>
                    <span className="text-[10px] text-gray-400">Boarding Point</span>
                  </div>

                  <div className="flex flex-col items-center px-1.5 sm:px-2 shrink-0">
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#005C55]" /> {t.duration}
                    </span>
                    <div className="w-10 sm:w-20 h-0.5 bg-gray-200 my-1.5 relative">
                      <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-gray-400" />
                      <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-[#005C55]" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#005C55]">
                      Direct Coach
                    </span>
                  </div>

                  <div className="text-right min-w-0 flex-1">
                    <span className="text-xs sm:text-base font-extrabold text-[#121C2A] block">
                      {t.arrivalTime}
                    </span>
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-600 flex items-center justify-end gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{t.destination}</span>
                    </p>
                    <span className="text-[10px] text-gray-400">Dropping Point</span>
                  </div>
                </div>

                {/* Fare, Discount Savings & Action */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0 w-full lg:w-[24%]">
                  <div className="flex sm:block items-baseline justify-between text-left lg:text-right">
                    <div>
                      {t.savings && t.originalFare ? (
                        <div className="flex items-center lg:justify-end gap-1.5 mb-0.5">
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                            <Sparkles className="w-2.5 h-2.5" /> Savings ৳{t.savings}
                          </span>
                          <span className="text-xs text-gray-400 line-through font-bold">
                            ৳{t.originalFare.toLocaleString()}
                          </span>
                        </div>
                      ) : null}

                      <div>
                        <span className="text-xl sm:text-2xl font-black text-[#005C55]">
                          ৳{t.fare.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 font-medium"> / seat</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#121C2A] font-bold mt-0.5">
                      Total: ৳{totalForParty.toLocaleString()} ({travelers}P{" "}
                      {isRoundTrip ? "Round Trip" : "One Way"})
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={t.isSoldOut}
                    onClick={() => {
                      if (t.isSoldOut) return;
                      if (onSelectTransport) {
                        onSelectTransport(t);
                      }
                      const budgetSec = document.getElementById("budget");
                      if (budgetSec) {
                        budgetSec.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      t.isSoldOut
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : isSelected
                        ? "bg-[#005F29] text-white cursor-pointer shadow-xs"
                        : "bg-[#121C2A] hover:bg-[#005C55] text-white cursor-pointer"
                    }`}
                  >
                    <span>
                      {t.isSoldOut
                        ? "Sold Out"
                        : isSelected
                        ? "✓ Transport Linked"
                        : "Select Seats & Link"}
                    </span>
                    {!t.isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {maxItems && filteredTransport.length > maxItems && (
          <div className="mt-8 text-center">
            <a
              href="/transport"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#005C55] hover:bg-[#0F766E] text-white font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-3.5 rounded-2xl shadow-md transition-all text-center"
            >
              <span>
                View All {SAMPLE_TRANSPORTS.length} Verified Bus, Train & Flight Schedules on Dedicated Transport Page
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
