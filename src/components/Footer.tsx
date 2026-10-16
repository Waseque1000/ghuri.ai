import Link from "next/link";
import { Compass, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#005C55] flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Ghuri<span className="text-[#9CF2E8]">.ai</span></span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Discover more. Plan smarter. Travel better. Bangladesh’s first transparent travel planning and price verification platform.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#F4E8D5]">
              <ShieldCheck className="w-4 h-4 text-[#95F8A7]" />
              <span>Zero-hallucination fare policy</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Destinations</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><a href="#discover" className="hover:text-white transition-colors">Cox's Bazar</a></li>
              <li><a href="#discover" className="hover:text-white transition-colors">Sajek Valley</a></li>
              <li><a href="#discover" className="hover:text-white transition-colors">Sreemangal</a></li>
              <li><a href="#discover" className="hover:text-white transition-colors">Saint Martin's Island</a></li>
              <li><a href="#discover" className="hover:text-white transition-colors">Sundarbans Mangrove</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><a href="#hotels" className="hover:text-white transition-colors">Hotel Tariff Inspector</a></li>
              <li><a href="#transport" className="hover:text-white transition-colors">Shohoz & Railway Schedules</a></li>
              <li><a href="#planner" className="hover:text-white transition-colors">AI Itinerary Generator</a></li>
              <li><a href="#budget" className="hover:text-white transition-colors">Deterministic Group Split</a></li>
            </ul>
          </div>

          {/* Principle */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Product Principle</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              We clearly distinguish estimated prices, verified published rates, and live partner availability. No false booking claims.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-gray-800/80 border border-gray-700 text-[11px] text-gray-300">
              🇧🇩 Built for Bangladesh Travelers & Explorers
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 Ghuri.ai. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with Next.js 16, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
