export type RoomCategoryType =
  | "couple"
  | "four-person"
  | "connecting"
  | "big-single-4"
  | "two-bed-5";

export type PriceSegmentType = "Budget" | "Standard" | "Premium" | "Luxury";

export interface RoomOption {
  id: string;
  category: RoomCategoryType;
  categoryLabel: string;
  name: string;
  bedType: string;
  maxGuests: number;
  occupancyRule: string;
  hasAC: boolean;
  viewType: "Sea View" | "Hill View" | "Garden View" | "City View";
  roomOnlyPrice: number;
  breakfastIncludedPrice: number;
  extraPersonFee: number;
}

export const ROOM_CATEGORIES: {
  id: RoomCategoryType;
  shortLabel: string;
  fullLabel: string;
  maxGuests: number;
  description: string;
}[] = [
  {
    id: "couple",
    shortLabel: "Couple Room (2P)",
    fullLabel: "Couple Room (Only 2 People)",
    maxGuests: 2,
    description: "1 Couple Bed • Only 2 people can stay"
  },
  {
    id: "four-person",
    shortLabel: "4 Person Room",
    fullLabel: "4 Person Family Room",
    maxGuests: 4,
    description: "2 Double Beds • Up to 4 people"
  },
  {
    id: "connecting",
    shortLabel: "Connecting Room",
    fullLabel: "Connecting Room (Interconnected)",
    maxGuests: 4,
    description: "Interconnected Twin Rooms • Up to 4 people"
  },
  {
    id: "big-single-4",
    shortLabel: "Big Single Bed (4P)",
    fullLabel: "Big Single Bed (For 4 Person)",
    maxGuests: 4,
    description: "1 Extra-Large Master Bed • For 4 people"
  },
  {
    id: "two-bed-5",
    shortLabel: "2 Bed (5 Person)",
    fullLabel: "2 Bed Room (For 5 Person)",
    maxGuests: 5,
    description: "2 Large Beds (1 King + 1 Double) • For 5 people"
  }
];

export interface AdvancedHotel {
  id: string;
  name: string;
  destinationSlug: string;
  destinationName: string;
  propertyType: "Hotel" | "Resort" | "Guesthouse" | "Serviced Apartment";
  priceSegment: PriceSegmentType;
  starRating: number;
  guestRating: number;
  reviewCount: number;
  address: string;
  distanceFromBeach: string;
  imageUrl: string;
  images: string[];
  // Contact & Booking Metadata from Report
  contactPhone?: string;
  contactEmail?: string;
  officialWebsite?: string;
  bookingPlatforms: string[];
  // Amenities & Facilities
  hasPool: boolean;
  poolDetails: string;
  hasParking: boolean;
  parkingDetails: string;
  hasWifi: boolean;
  hasFreeCancellation: boolean;
  hasElevator: boolean;
  hasHotWater: boolean;
  diningOptions: string;
  transportPickup: string;
  facilitiesList: string[];
  // Room Inventory
  rooms: RoomOption[];
  rateSource: string;
  verifiedAt: string;
  badge?: "Cheapest Stay" | "Best Value" | "Family Friendly" | "Luxury Pick" | "New 2026" | "Beachfront";
}

export const COXS_BAZAR_SEASONAL_INFO = {
  currencyNote: "1 USD ≈ 120 BDT (Verified across Rakuten Travel, Trip.com, Travala, Google Hotels, Wego & Official Tariffs)",
  peakSeason: {
    period: "November – February",
    note: "30–50% above off-season rates. Highest demand during winter, weekends, and Eid holidays."
  },
  offSeason: {
    period: "June – September (Monsoon)",
    note: "Lowest hotel tariffs of the year (July is the cheapest month)."
  },
  segments: [
    { tier: "Budget", range: "৳1,800 – ৳3,600 / night", examples: "Hotel Sea World, Cox West Inn, Royal Pearl Suites" },
    { tier: "Standard", range: "৳3,600 – ৳7,500 / night", examples: "Hotel South Beach, Hotel Sea Cox, Long Beach Hotel" },
    { tier: "Premium", range: "৳5,500 – ৳10,500 / night", examples: "Hotel The Cox Today, Best Western Heritage, Seagull, Ocean Paradise" },
    { tier: "Luxury", range: "৳10,500 – ৳42,700 / night", examples: "Sayeman Beach Resort, Baywatch, Sea Pearl (Royal Tulip), Ramada by Wyndham" }
  ]
};

function buildFiveRoomCategories(
  prefix: string,
  baseCoupleRoomOnly: number,
  baseCoupleBreakfast: number,
  viewType: "Sea View" | "Hill View" | "Garden View" | "City View",
  hasAC: boolean = true,
  coupleRoomName: string = "Deluxe Couple Room"
): RoomOption[] {
  const breakfastDiff = Math.max(400, baseCoupleBreakfast - baseCoupleRoomOnly);
  const r4pOnly = Math.round((baseCoupleRoomOnly * 1.45) / 100) * 100;
  const rConnOnly = Math.round((baseCoupleRoomOnly * 1.8) / 100) * 100;
  const rBigSingleOnly = Math.round((baseCoupleRoomOnly * 1.3) / 100) * 100;
  const r2Bed5pOnly = Math.round((baseCoupleRoomOnly * 1.65) / 100) * 100;

  return [
    {
      id: `${prefix}-couple`,
      category: "couple",
      categoryLabel: "Couple Room",
      name: coupleRoomName,
      bedType: "1 Couple Bed (King/Queen)",
      maxGuests: 2,
      occupancyRule: "Only 2 people can stay in this room",
      hasAC,
      viewType,
      roomOnlyPrice: baseCoupleRoomOnly,
      breakfastIncludedPrice: baseCoupleBreakfast,
      extraPersonFee: 0
    },
    {
      id: `${prefix}-4p`,
      category: "four-person",
      categoryLabel: "4 Person Room",
      name: "Family Quad Room (4 Person)",
      bedType: "2 Double Beds (For 4 Persons)",
      maxGuests: 4,
      occupancyRule: "Up to 4 people per room",
      hasAC,
      viewType,
      roomOnlyPrice: r4pOnly,
      breakfastIncludedPrice: r4pOnly + breakfastDiff * 2,
      extraPersonFee: Math.round(baseCoupleRoomOnly * 0.2)
    },
    {
      id: `${prefix}-connecting`,
      category: "connecting",
      categoryLabel: "Connecting Room",
      name: "Interconnected Family Suite",
      bedType: "2 Connecting Rooms (Shared Door)",
      maxGuests: 4,
      occupancyRule: "Up to 4 people across connected rooms",
      hasAC,
      viewType,
      roomOnlyPrice: rConnOnly,
      breakfastIncludedPrice: rConnOnly + breakfastDiff * 2,
      extraPersonFee: Math.round(baseCoupleRoomOnly * 0.25)
    },
    {
      id: `${prefix}-bigsingle`,
      category: "big-single-4",
      categoryLabel: "Big Single Bed (4P)",
      name: "Grand Single Master Bed (4 Person)",
      bedType: "1 Extra-Large Master Bed (For 4 Persons)",
      maxGuests: 4,
      occupancyRule: "1 large bed suitable for 4 people",
      hasAC,
      viewType,
      roomOnlyPrice: rBigSingleOnly,
      breakfastIncludedPrice: rBigSingleOnly + Math.round(breakfastDiff * 1.5),
      extraPersonFee: Math.round(baseCoupleRoomOnly * 0.18)
    },
    {
      id: `${prefix}-2bed5p`,
      category: "two-bed-5",
      categoryLabel: "2 Bed (5 Person)",
      name: "Deluxe 2-Bed 5-Person Suite",
      bedType: "2 Large Beds (1 King + 1 Double • For 5 Persons)",
      maxGuests: 5,
      occupancyRule: "2 beds accommodating up to 5 people",
      hasAC,
      viewType,
      roomOnlyPrice: r2Bed5pOnly,
      breakfastIncludedPrice: r2Bed5pOnly + breakfastDiff * 2,
      extraPersonFee: Math.round(baseCoupleRoomOnly * 0.22)
    }
  ];
}

export const ADVANCED_HOTEL_INVENTORY: AdvancedHotel[] = [
  // 1. Cox West Inn (Budget - starts from US$17 ≈ BDT 2,000)
  {
    id: "hotel-cox-west-inn",
    name: "Cox West Inn",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Budget",
    starRating: 2,
    guestRating: 7.8,
    reviewCount: 310,
    address: "Plot 12, Block A, Kolatali, Cox's Bazar 4700",
    distanceFromBeach: "330m from Sugandha Point (620m to Beach)",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop"],
    bookingPlatforms: ["Trip.com", "Travala"],
    hasPool: false,
    poolDetails: "None",
    hasParking: true,
    parkingDetails: "Free Private Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "In-house Restaurant & Room Service",
    transportPickup: "Not Available",
    facilitiesList: ["Free parking", "Free Wi-Fi", "Restaurant", "Room service", "Air conditioning", "LCD TV"],
    badge: "Cheapest Stay",
    rateSource: "Trip.com / Travala (US$17)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("coxwest", 2000, 2500, "City View", true, "Deluxe Couple Suite")
  },

  // 2. Hotel Sea World (Budget - C$20 / US$15 ≈ BDT 1,800)
  {
    id: "hotel-sea-world",
    name: "Hotel Sea World",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Budget",
    starRating: 3,
    guestRating: 7.7,
    reviewCount: 245,
    address: "Hotel Motel Zone, Sea Beach Road, Cox's Bazar",
    distanceFromBeach: "400m from Beach (Hotel Motel Zone)",
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop"],
    bookingPlatforms: ["HotelsCombined"],
    hasPool: false,
    poolDetails: "None",
    hasParking: true,
    parkingDetails: "On-site Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Standard Dining",
    transportPickup: "Not Available",
    facilitiesList: ["Hotel Motel Zone location", "Wi-Fi", "AC Rooms", "24h Front Desk"],
    badge: "Cheapest Stay",
    rateSource: "HotelsCombined (US$15–34)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("seaworld", 1800, 2300, "City View", true, "Standard Couple Room")
  },

  // 3. Royal Pearl Suites (Budget / Standard - US$28 ≈ BDT 3,400)
  {
    id: "hotel-royal-pearl-suites",
    name: "Royal Pearl Suites",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Serviced Apartment",
    priceSegment: "Budget",
    starRating: 3,
    guestRating: 8.0,
    reviewCount: 290,
    address: "Kolatoli Beach Road, Cox's Bazar",
    distanceFromBeach: "500m from Kolatoli Beach",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop"],
    bookingPlatforms: ["Trip.com"],
    hasPool: false,
    poolDetails: "None",
    hasParking: true,
    parkingDetails: "Free Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "In-room Dining & Cafe",
    transportPickup: "Shuttle on Request (Paid)",
    facilitiesList: ["Spacious Suites", "Air Conditioning", "Free Wi-Fi", "Family Friendly"],
    rateSource: "Trip.com (US$28–29)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("royalpearl", 3400, 3900, "City View", true, "Standard Suite Couple")
  },

  // 4. Hotel South Beach (Budget / Standard - US$35.37 ≈ BDT 4,200 w/ Breakfast)
  {
    id: "hotel-south-beach",
    name: "Hotel South Beach",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Standard",
    starRating: 3,
    guestRating: 8.1,
    reviewCount: 410,
    address: "Plot 60, Block B (PWD), Kolatoli, Cox's Bazar",
    distanceFromBeach: "1.8 km from Kolatoli Beach",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop"],
    bookingPlatforms: ["Travala"],
    hasPool: false,
    poolDetails: "None",
    hasParking: true,
    parkingDetails: "Free Self-Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Complimentary Breakfast Included",
    transportPickup: "Not Available",
    facilitiesList: ["Free breakfast", "Free Wi-Fi", "Free self-parking", "Air conditioning", "Daily housekeeping"],
    badge: "Best Value",
    rateSource: "Travala (US$35.37–57.45)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("southbeach", 3600, 4200, "Hill View", true, "Standard Ocean/Mountain Couple Room")
  },

  // 5. Hotel Sea Cox (Standard / Mid-Range - US$38 ≈ BDT 4,600 w/ Breakfast)
  {
    id: "hotel-sea-cox",
    name: "Hotel Sea Cox",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Standard",
    starRating: 3,
    guestRating: 8.2,
    reviewCount: 380,
    address: "Hotel Motel Zone, Kolatoli, Cox's Bazar",
    distanceFromBeach: "400m from Sea Beach",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop"],
    bookingPlatforms: ["Rakuten Travel"],
    hasPool: false,
    poolDetails: "None",
    hasParking: true,
    parkingDetails: "Private Parking Lot",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Restaurant & Room Service",
    transportPickup: "Shuttle on Request (Paid)",
    facilitiesList: ["Parking lot", "Restaurant", "Laundry", "Meeting room", "Room service", "Private Balcony"],
    rateSource: "Rakuten Travel (US$38)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("seacox", 4000, 4600, "City View", true, "Deluxe Double Room with Balcony")
  },

  // 6. Long Beach Hotel (4-Star Mid-Range / Premium - US$38–64 ≈ BDT 4,600–7,700)
  {
    id: "hotel-longbeach",
    name: "Long Beach Hotel",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Standard",
    starRating: 4,
    guestRating: 8.6,
    reviewCount: 880,
    address: "14, Kalatoli Road, Hotel-Motel Zone, Cox's Bazar 4700",
    distanceFromBeach: "14-min walk from Beach (3 km from Airport)",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop"],
    contactPhone: "+880 1755-660051, +880 173 033 8905",
    bookingPlatforms: ["Trip.com", "Wego", "KAYAK", "Google Hotels"],
    hasPool: true,
    poolDetails: "Outdoor & Indoor Pool",
    hasParking: true,
    parkingDetails: "Free Private Secure Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "International Restaurant & Buffet Breakfast",
    transportPickup: "Shuttle on Request (Paid)",
    facilitiesList: ["Outdoor pool", "Gym", "International restaurant", "Wi-Fi", "Conference Room"],
    badge: "Best Value",
    rateSource: "Wego / Trip.com (US$38–64)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("longbeach", 4600, 5400, "City View", true, "Premier King Couple Room")
  },

  // 7. Hotel Grand Pacific (Premium - Newly opened 2026, US$39–162 ≈ BDT 4,700+)
  {
    id: "hotel-grand-pacific",
    name: "Hotel Grand Pacific",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Premium",
    starRating: 4,
    guestRating: 8.7,
    reviewCount: 195,
    address: "Kolatoli Marine Drive Link, Cox's Bazar",
    distanceFromBeach: "350m from Kolatoli Beach",
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=800&auto=format&fit=crop"],
    bookingPlatforms: ["Trip.com"],
    hasPool: true,
    poolDetails: "Rooftop Swimming Pool",
    hasParking: true,
    parkingDetails: "Free Secure Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Multi-cuisine Restaurant",
    transportPickup: "Shuttle on Request (Paid)",
    facilitiesList: ["Newly Opened 2026", "Swimming Pool", "High-speed Wi-Fi", "Modern Rooms"],
    badge: "New 2026",
    rateSource: "Trip.com (US$39–162)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("grandpacific", 4700, 5500, "Sea View", true, "Standard Modern Couple Room")
  },

  // 8. Ocean Paradise Hotel & Resort (5-Star, US$35–80 ≈ BDT 5,200–9,600)
  {
    id: "hotel-oceanparadise",
    name: "Ocean Paradise Hotel & Resort",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Resort",
    priceSegment: "Premium",
    starRating: 5,
    guestRating: 8.8,
    reviewCount: 1100,
    address: "28-29, Hotel Motel Zone, Kolatoli Road, Cox's Bazar 4700",
    distanceFromBeach: "200m from Kolatoli Sea Beach",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop"],
    contactPhone: "+880 1938-846761",
    bookingPlatforms: ["Trip.com", "Google Hotels", "Booking.com"],
    hasPool: true,
    poolDetails: "Outdoor Swimming Pool & Kids Splash Pool",
    hasParking: true,
    parkingDetails: "Free Private Secure Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Buffet & Rooftop Sea View Restaurant",
    transportPickup: "Free Airport & Station Shuttle",
    facilitiesList: ["Swimming pool", "Dining options", "Fitness facilities", "Spa", "Balcony Sea View"],
    badge: "Family Friendly",
    rateSource: "Google Travel / Trip.com (US$35–80)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("ocean", 5200, 6200, "Sea View", true, "Premier Double Room with Sea View Balcony")
  },

  // 9. Hotel The Cox Today (4-Star Premium - US$39–68 / Eid BDT 8,000)
  {
    id: "hotel-cox-today",
    name: "Hotel The Cox Today",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Premium",
    starRating: 4,
    guestRating: 8.5,
    reviewCount: 920,
    address: "Plot 07, Road 02, Hotel Motel Zone, Kolatoly Road, Cox's Bazar 4700",
    distanceFromBeach: "Near Sugandha Point on Kolatoli Road",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop"],
    contactPhone: "+880 1755-598446, +880 1844-114817",
    officialWebsite: "https://hotelthecoxtoday.com/",
    bookingPlatforms: ["Official Website", "Trip.com", "HotelsCombined"],
    hasPool: true,
    poolDetails: "Outdoor Swimming Pool",
    hasParking: true,
    parkingDetails: "Free Private Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Buffet Breakfast, Barbecue Restaurant & Pastry Shop",
    transportPickup: "Travel Desk & Airport Transfer",
    facilitiesList: ["Swimming pool", "Gym", "Spa & Thai massage", "Barbecue restaurant", "Coffee shop", "Doctor access"],
    badge: "Family Friendly",
    rateSource: "Trip.com / Official (BDT 5,600–8,200)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("coxtoday", 5600, 6600, "Hill View", true, "Cox Deluxe Hill Side Room")
  },

  // 10. Best Western Heritage (4-Star Premium - US$50–57 ≈ BDT 6,000–6,800)
  {
    id: "hotel-best-western-heritage",
    name: "Best Western Heritage",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Premium",
    starRating: 4,
    guestRating: 8.7,
    reviewCount: 740,
    address: "173-1, Bypass Road, Kolatoli Circle, Cox's Bazar 4700",
    distanceFromBeach: "Prime Location Close to Kolatoli Beach",
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop"],
    contactPhone: "+88 01339-913200, WhatsApp: +880 1992-222450",
    bookingPlatforms: ["Trip.com", "Travala", "Tiket.com", "Hotels.com"],
    hasPool: true,
    poolDetails: "Outdoor Swimming Pool & Sauna",
    hasParking: true,
    parkingDetails: "Free Private Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Complimentary Breakfast Buffet & Restaurant",
    transportPickup: "Shuttle on Request",
    facilitiesList: ["Outdoor swimming pool", "Sauna", "Fitness room", "Free parking", "Minibar", "Table tennis", "Garden"],
    badge: "Best Value",
    rateSource: "Trip.com / Travala (US$50–57)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("bwheritage", 6000, 6800, "Sea View", true, "Deluxe Sea/Hill View Room")
  },

  // 11. Seagull Hotels Ltd. (5-Star Luxury/Premium - US$65 ≈ BDT 7,800 w/ Breakfast)
  {
    id: "hotel-seagull",
    name: "Seagull Hotels Ltd.",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Premium",
    starRating: 5,
    guestRating: 8.6,
    reviewCount: 950,
    address: "Plot 6, 7 & 8, Hotel Motel Zone, Sea Beach, Cox's Bazar 4700",
    distanceFromBeach: "Beachfront Property (1-min walk through trees to Beach)",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop"],
    contactPhone: "+880 1766-666530, Hotline: 09614444440",
    officialWebsite: "https://seagullhotelbd.com/",
    bookingPlatforms: ["Rakuten Travel", "Agoda", "Expedia", "Official Website"],
    hasPool: true,
    poolDetails: "Outdoor Swimming Pool & Private Beach Area",
    hasParking: true,
    parkingDetails: "Free Private Secure Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Free Breakfast, Multi-cuisine Restaurants & Coffee Shop",
    transportPickup: "Free Airport Shuttle",
    facilitiesList: ["Private beach area", "Swimming pool", "SPA", "Free breakfast", "Kids' club", "Free airport shuttle"],
    badge: "Beachfront",
    rateSource: "Rakuten Travel (US$65 / BDT 7,800)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("seagull", 6800, 7800, "Sea View", true, "Deluxe Double Room, Bay View")
  },

  // 12. Praasad Paradise Hotel & Resort (Mid-Range / Premium - US$78 ≈ BDT 9,400)
  {
    id: "hotel-praasad-paradise",
    name: "Praasad Paradise Hotel & Resort",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Resort",
    priceSegment: "Premium",
    starRating: 4,
    guestRating: 8.4,
    reviewCount: 510,
    address: "Plot 9, New Beach Road, Hotel Motel Zone, Cox's Bazar",
    distanceFromBeach: "250m from Laboni & Sugandha Beach",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop"],
    bookingPlatforms: ["Trivago", "Wego"],
    hasPool: true,
    poolDetails: "Outdoor Swimming Pool",
    hasParking: true,
    parkingDetails: "Free Private Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Buffet Breakfast & Rooftop Dining",
    transportPickup: "Airport Pickup Available",
    facilitiesList: ["Swimming Pool", "Sea View Balconies", "Free Wi-Fi", "Restaurant"],
    rateSource: "Trivago / Wego (US$78)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("praasad", 8200, 9400, "Sea View", true, "Deluxe Premier Couple Room")
  },

  // 13. Sayeman Beach Resort (5-Star Luxury Resort - US$62–154 / Promo BDT 12,400)
  {
    id: "hotel-sayeman",
    name: "Sayeman Beach Resort",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Resort",
    priceSegment: "Luxury",
    starRating: 5,
    guestRating: 9.1,
    reviewCount: 1240,
    address: "Marine Drive Road, Kolatoli, Cox's Bazar 4700",
    distanceFromBeach: "Beachfront (Direct Seaside at Kolatoli)",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"],
    contactPhone: "+880 1401-777888, +880 1755-691917",
    contactEmail: "reservation.beachresort@sayeman.com",
    officialWebsite: "https://sayemanresort.com",
    bookingPlatforms: ["Official Website", "Google Hotels", "HotelsCombined"],
    hasPool: true,
    poolDetails: "Outdoor Infinity Pool (Overlooking Bay of Bengal)",
    hasParking: true,
    parkingDetails: "Free Private Secure Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Buffet Breakfast & Multiple Fine Dining Restaurants",
    transportPickup: "Complimentary Airport Transfer",
    facilitiesList: ["Infinity pool", "Sea views", "Spa", "Modern gym", "Children's area", "Conference halls", "Seaside location"],
    badge: "Luxury Pick",
    rateSource: "Google Travel / Official (BDT 10,800–12,400)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("sayeman", 10800, 12400, "Sea View", true, "Super Deluxe Ocean/Hill Couple Room")
  },

  // 14. Baywatch Hotel & Resort (5-Star Luxury Resort, Inani Beach)
  {
    id: "hotel-baywatch",
    name: "Baywatch Hotel & Resort",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Resort",
    priceSegment: "Luxury",
    starRating: 5,
    guestRating: 9.0,
    reviewCount: 615,
    address: "Inani Beach, Marine Drive Road, Cox's Bazar",
    distanceFromBeach: "Beachfront on Scenic Inani Coral Beach",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop"],
    contactPhone: "+880 9666 800 100",
    officialWebsite: "https://www.baywatch.com.bd",
    bookingPlatforms: ["Official Website", "Major OTAs"],
    hasPool: true,
    poolDetails: "Rooftop & Indoor Infinity Pools",
    hasParking: true,
    parkingDetails: "Free Private Resort Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Oceanfront Multi-cuisine & Seafood Grill",
    transportPickup: "Airport Shuttle Service",
    facilitiesList: ["Rooftop infinity pool", "Indoor pool", "Inani Beachfront", "Luxury Spa", "Marine Drive view"],
    badge: "Beachfront",
    rateSource: "Official Tariff (baywatch.com.bd)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("baywatch", 11500, 13000, "Sea View", true, "Deluxe Inani Oceanfront Couple Suite")
  },

  // 15. Sea Pearl Beach Resort & Spa (Royal Tulip) - 5-Star Luxury (HK$1,091 ≈ US$140 ≈ BDT 16,800)
  {
    id: "hotel-sea-pearl",
    name: "Sea Pearl Beach Resort & Spa (Royal Tulip)",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Resort",
    priceSegment: "Luxury",
    starRating: 5,
    guestRating: 9.2,
    reviewCount: 1580,
    address: "Jaliapalong, Inani, Ukhiya, Cox's Bazar 4750",
    distanceFromBeach: "Private Inani Beachfront & Hill Estate",
    imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop"],
    officialWebsite: "https://seapearlcoxsbazar.com",
    bookingPlatforms: ["Rakuten Travel", "Trivago", "Official Website"],
    hasPool: true,
    poolDetails: "2 Swimming Pools + Private Water Park",
    hasParking: true,
    parkingDetails: "Free Resort Parking Lot",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "5 Restaurants, Bar & Buffet Breakfast",
    transportPickup: "Airport Shuttle & Chauffeur",
    facilitiesList: ["Water park", "Swimming pool", "Spa / Beauty salon", "Gym", "Tennis & badminton courts", "Kids' club", "Bar"],
    badge: "Luxury Pick",
    rateSource: "Rakuten Travel (HK$1,091 / US$140)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("seapearl", 16800, 17600, "Sea View", true, "Superior Sea/Hill Couple Room")
  },

  // 16. Ramada by Wyndham Cox's Bazar Kolatoli Beach (5-Star International Luxury)
  {
    id: "hotel-ramada-wyndham",
    name: "Ramada by Wyndham Cox's Bazar Kolatoli Beach",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    priceSegment: "Luxury",
    starRating: 5,
    guestRating: 9.4,
    reviewCount: 430,
    address: "Kolatoli Beach Road, Cox's Bazar 4700",
    distanceFromBeach: "Direct Kolatoli Beachfront",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"],
    officialWebsite: "https://www.wyndhamhotels.com",
    bookingPlatforms: ["Trip.com", "Hotels.com", "Wyndham Official"],
    hasPool: true,
    poolDetails: "Heated Infinity Pool & Rooftop Lounge",
    hasParking: true,
    parkingDetails: "Complimentary Valet Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "International Buffet & Executive Lounge",
    transportPickup: "Complimentary VIP Airport Transfer",
    facilitiesList: ["International 5-Star Wyndham Brand", "Kolatoli Beachfront", "Infinity Pool", "Luxury Spa", "Fine Dining"],
    badge: "Luxury Pick",
    rateSource: "Trip.com (Peak/Suite up to US$356)",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("ramada", 18500, 20500, "Sea View", true, "Wyndham King Oceanfront Couple Room")
  },

  // 17. Sajek Valley Cloud Eco Cottage (For Sajek Valley destination)
  {
    id: "hotel-sajek-cloud",
    name: "Sajek Valley Cloud Eco Cottage",
    destinationSlug: "sajek-valley",
    destinationName: "Sajek Valley",
    propertyType: "Guesthouse",
    priceSegment: "Standard",
    starRating: 3,
    guestRating: 9.3,
    reviewCount: 410,
    address: "Ruilui Para, Sajek Valley, Rangamati",
    distanceFromBeach: "Hilltop (Lushai & Mizoram Cloud View)",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop"],
    bookingPlatforms: ["Verified Direct Tariff"],
    hasPool: false,
    poolDetails: "None",
    hasParking: false,
    parkingDetails: "Helipad / Street Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: false,
    hasHotWater: true,
    diningOptions: "Bamboo Chicken & Tribal Dining",
    transportPickup: "Chander Gari Pickup on Request",
    facilitiesList: ["Cloud Balcony", "Mountain View", "Wi-Fi", "Hot Water"],
    badge: "Best Value",
    rateSource: "Verified Direct Tariff",
    verifiedAt: "2026-11-10",
    rooms: buildFiveRoomCategories("sajek", 3500, 4000, "Hill View", false, "Cloud Edge Couple Cottage")
  }
];
