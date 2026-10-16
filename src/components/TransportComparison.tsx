"use client";

import { useState } from "react";
import { SAMPLE_TRANSPORTS, TransportOption } from "@/lib/data";
import { Bus, Train, Plane, Ship, ArrowRight, ShieldCheck, Clock, Check } from "lucide-react";

interface TransportComparisonProps {
  onSelectTransport?: (transport: TransportOption) => void;
  selectedTransportId?: string;
}

export default function TransportComparison({
  onSelectTransport,
  selectedTransportId
}: TransportComparisonProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredTransport = activeFilter === "all"
    ? SAMPLE_TRANSPORTS
    : SAMPLE_TRANSPORTS.filter(t => t.type === activeFilter);

  const getIcon = (type: TransportOption["type"]) => {
    switch (type) {
      case "bus": return <Bus className="w-5 h-5 text-emerald-600" />;
      case "train": return <Train className="w-5 h-5 text-indigo-600" />;
      case "flight": return <Plane className="w-5 h-5 text-sky-600" />;
      case "ferry": return <Ship className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <section id="transport" className="py-12 sm:py-16 bg-[#FAFAF7] border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005C55]/10 text-[#005C55] text-xs font-semibold uppercase tracking-wider mb-2">
              <Bus className="w-3.5 h-3.5" />
              Multi-Modal Mobility
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#121C2A] tracking-tight">
              Bangladesh Transport Comparison
            </h2>
            <p className="text-gray-600 mt-1 max-w-xl text-xs sm:text-sm md:text-base">
              Select your travel mode (AC Bus, Express Train, Flight, Launch) to automatically update round-trip fares in the budget engine.
            </p>
          </div>

          {/* Transport mode selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFF4FF] rounded-2xl self-start md:self-auto">
            {["all", "bus", "train", "flight", "ferry"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeFilter === type
                    ? "bg-[#005C55] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transport List */}
        <div className="space-y-4">
          {filteredTransport.map((t) => {
            const isSelected = selectedTransportId === t.id;

            return (
              <div
                key={t.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-white border-[#005C55] ring-2 ring-[#005C55]/30 shadow-md"
                    : "bg-white border-gray-200 hover:shadow-md"
                }`}
              >
                {/* Operator info */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#EFF4FF] border border-gray-200 flex items-center justify-center shrink-0 shadow-xs">
                    {getIcon(t.type)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">{t.operator}</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                        {t.type}
                      </span>
                      {t.isAC && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          AC
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{t.seatClass}</p>
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                      Source: {t.source} • Verified: {t.verifiedAt}
                    </p>
                  </div>
                </div>

                {/* Timing */}
                <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-8 border-y md:border-y-0 md:border-x border-gray-100 py-3 md:py-0 md:px-6 w-full md:w-auto">
                  <div className="text-left">
                    <span className="text-sm sm:text-base font-extrabold text-gray-900">{t.departureTime}</span>
                    <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1">{t.origin}</p>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.duration}
                    </span>
                    <div className="w-14 sm:w-24 h-0.5 bg-gray-200 my-1 relative">
                      <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-[#005C55]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#005C55]">Direct Route</span>
                  </div>

                  <div className="text-right sm:text-left">
                    <span className="text-sm sm:text-base font-extrabold text-gray-900">{t.arrivalTime}</span>
                    <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1">{t.destination}</p>
                  </div>
                </div>

                {/* Fare & Selection */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0 w-full md:w-auto">
                  <div className="text-left md:text-right">
                    <span className="text-xl sm:text-2xl font-black text-[#005C55]">
                      ৳{t.fare.toLocaleString()}
                    </span>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">per seat published tariff</p>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectTransport) {
                        onSelectTransport(t);
                      }
                      const budgetSec = document.getElementById("budget");
                      if (budgetSec) budgetSec.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#005F29] text-white"
                        : "bg-gray-900 hover:bg-[#005C55] text-white"
                    }`}
                  >
                    <span>{isSelected ? "✓ Transport Linked" : "Select in Budget"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
