"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TransportComparison from "@/components/TransportComparison";
import Footer from "@/components/Footer";
import { SAMPLE_TRANSPORTS, TransportOption } from "@/lib/data";

export default function TransportPage() {
  const router = useRouter();
  const [travelers, setTravelers] = useState<number>(2);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true);
  const [selectedTransport, setSelectedTransport] = useState<TransportOption>(
    SAMPLE_TRANSPORTS[1]
  );

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ghuri_trip_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.travelers) setTravelers(parsed.travelers);
        if (typeof parsed.isRoundTrip === "boolean")
          setIsRoundTrip(parsed.isRoundTrip);
        if (parsed.selectedTransportId) {
          const found = SAMPLE_TRANSPORTS.find(
            (t) => t.id === parsed.selectedTransportId
          );
          if (found) setSelectedTransport(found);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const saveTransportToStorage = (
    transport: TransportOption,
    tCount = travelers,
    roundTrip = isRoundTrip
  ) => {
    try {
      const existingRaw = localStorage.getItem("ghuri_trip_state");
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      localStorage.setItem(
        "ghuri_trip_state",
        JSON.stringify({
          ...existing,
          travelers: tCount,
          isRoundTrip: roundTrip,
          selectedTransportId: transport.id
        })
      );
    } catch {
      // ignore storage errors
    }
  };

  const handleSelectTransport = (transport: TransportOption) => {
    setSelectedTransport(transport);
    saveTransportToStorage(transport, travelers, isRoundTrip);
    router.push("/#budget");
  };

  const totalFare =
    selectedTransport.fare * travelers * (isRoundTrip ? 2 : 1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Navbar activeTab="Transport" />

      <main className="flex-1 pt-20">
        {/* Top Hero Strip for Dedicated Transport Page */}
        <section className="bg-gradient-to-b from-[#005C55] to-[#003E39] text-white py-10 sm:py-12 px-4 sm:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-[#9CF2E8] mb-3">
                <span className="material-symbols-outlined text-sm">
                  directions_bus
                </span>
                <span>
                  Multi-Modal Transit Directory • Verified Published Fares
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Bangladesh Transport & Fare Inspector
              </h1>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl mt-2">
                Compare AC Sleeper & Non-AC Buses, Bangladesh Railway Express Trains, Domestic Flights, and Sea Cruise Launches across Cox&apos;s Bazar, Sajek Valley, Saint Martin&apos;s, and Sreemangal.
              </p>
            </div>

            {/* Quick Transit Configurator Pill */}
            <div className="w-full lg:w-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block">
                  Passengers
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const nextT = Math.max(1, travelers - 1);
                      setTravelers(nextT);
                      saveTransportToStorage(
                        selectedTransport,
                        nextT,
                        isRoundTrip
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
                      setTravelers(nextT);
                      saveTransportToStorage(
                        selectedTransport,
                        nextT,
                        isRoundTrip
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
                  Trip Type
                </span>
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRoundTrip(true);
                      saveTransportToStorage(selectedTransport, travelers, true);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                      isRoundTrip
                        ? "bg-[#9CF2E8] text-[#00201D]"
                        : "bg-white/15 text-white"
                    }`}
                  >
                    Round Trip (×2)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRoundTrip(false);
                      saveTransportToStorage(
                        selectedTransport,
                        travelers,
                        false
                      );
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                      !isRoundTrip
                        ? "bg-[#9CF2E8] text-[#00201D]"
                        : "bg-white/15 text-white"
                    }`}
                  >
                    One Way (×1)
                  </button>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-white/20 pt-2.5 sm:pt-0 sm:pl-4">
                <span className="text-[10px] uppercase font-bold text-[#9CF2E8] block truncate">
                  Active Transit ({selectedTransport.operator})
                </span>
                <div className="font-extrabold text-sm mt-0.5">
                  ৳{totalFare.toLocaleString()} ({travelers}P{" "}
                  {isRoundTrip ? "Round Trip" : "One Way"})
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

        {/* Full Transport Comparison Component */}
        <TransportComparison
          onSelectTransport={handleSelectTransport}
          selectedTransportId={selectedTransport?.id}
          travelers={travelers}
          isRoundTrip={isRoundTrip}
        />
      </main>

      <Footer />
    </div>
  );
}

