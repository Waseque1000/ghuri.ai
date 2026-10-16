export interface Destination {
  id: string;
  name: string;
  slug: string;
  division: string;
  tagline: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  bestMonths: string[];
  estimatedDailyBudget: {
    min: number;
    max: number;
  };
  highlights: string[];
  popularFor: string[];
  category: "Beach" | "Hills" | "Forest" | "Heritage" | "Rivers";
}

export interface Hotel {
  id: string;
  name: string;
  destinationSlug: string;
  destinationName: string;
  starRating: number;
  userRating: number;
  reviewCount: number;
  address: string;
  distanceFromCenter: string;
  imageUrl: string;
  nightlyPrice: number;
  hasAC: boolean;
  hasBreakfast: boolean;
  hasPool: boolean;
  hasParking: boolean;
  hasWifi: boolean;
  maxGuests: number;
  bedType: string;
  rateSource: "Agoda Partner API" | "Verified Direct Tariff" | "Estimated Market Rate";
  isVerified: boolean;
  verifiedAt: string;
}

export interface TransportOption {
  id: string;
  operator: string;
  type: "bus" | "train" | "flight" | "ferry";
  origin: string;
  destination: string;
  seatClass: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  isAC: boolean;
  source: "Shohoz API" | "Railway e-Ticket" | "Biman BD" | "Launch Portal";
  verifiedAt: string;
  isLive: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  highlights: string[];
  activities: {
    time: string;
    title: string;
    description: string;
    estimatedCost: number;
    location: string;
    category: "Sightseeing" | "Dining" | "Transit" | "Relaxation";
  }[];
}

export interface TripPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  nights: number;
  travelers: number;
  travelStyle: "Budget" | "Comfort" | "Luxury";
  days: ItineraryDay[];
  costs: {
    transport: number;
    accommodation: number;
    food: number;
    activities: number;
    localTransport: number;
    contingency: number;
    total: number;
    perPerson: number;
  };
}

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    id: "dest-1",
    name: "Cox's Bazar",
    slug: "coxs-bazar",
    division: "Chittagong",
    tagline: "World's longest natural sea beach & golden sunsets",
    description: "Cox's Bazar is a town on the southeast coast of Bangladesh known for its very long, sandy beachfront, stretching 120 km from sea cliffs to the estuary.",
    imageUrl: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 1420,
    bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
    estimatedDailyBudget: { min: 2500, max: 7000 },
    highlights: ["Inani Coral Beach", "Marine Drive Ride", "Himchari Waterfalls", "Fresh Seafood Dinners"],
    popularFor: ["Beach Walk", "Surfing", "Sunset Views", "Photography"],
    category: "Beach"
  },
  {
    id: "dest-2",
    name: "Sajek Valley",
    slug: "sajek-valley",
    division: "Chittagong (Rangamati)",
    tagline: "The queen of hills floating above white cloud blankets",
    description: "Sajek Valley is an all-weather tourist spot in the hill tracts of Bangladesh, renowned for misty clouds floating right beside traditional wooden cottages.",
    imageUrl: "https://images.unsplash.com/photo-1628178822606-599182315fa7?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 980,
    bestMonths: ["Sep", "Oct", "Nov", "Dec", "Jan"],
    estimatedDailyBudget: { min: 3000, max: 8000 },
    highlights: ["Konglak Peak", "Helipad Cloud View", "Chander Gari Safari", "Tribal Bamboo Chicken"],
    popularFor: ["Cloud Gazing", "Stargazing", "Trekking", "Off-road Driving"],
    category: "Hills"
  },
  {
    id: "dest-3",
    name: "Sreemangal",
    slug: "sreemangal",
    division: "Sylhet",
    tagline: "Tea capital surrounded by rainforests and bird havens",
    description: "Sreemangal is known as the tea capital of Bangladesh, boasting endless lush green undulating gardens, Lawachara rainforest, and 7-layer tea.",
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 820,
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb"],
    estimatedDailyBudget: { min: 2200, max: 6000 },
    highlights: ["Lawachara Rainforest", "Madhobpur Lake", "Finlay Tea Estates", "Baikka Beel Bird Sanctuary"],
    popularFor: ["Tea Tasting", "Bird Watching", "Cycling", "Nature Walks"],
    category: "Forest"
  },
  {
    id: "dest-4",
    name: "Saint Martin's Island",
    slug: "saint-martins",
    division: "Chittagong",
    tagline: "Bangladesh's only coral island with crystal turquoise waters",
    description: "A small tropical coral island in the northeastern part of the Bay of Bengal, famous for organic coconuts, pristine marine biodiversity, and starry nights.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 1100,
    bestMonths: ["Nov", "Dec", "Jan", "Feb"],
    estimatedDailyBudget: { min: 3500, max: 9000 },
    highlights: ["Chera Dwip", "Coral Reef Snorkeling", "Fresh King Lobster", "Bicycle Beach Tour"],
    popularFor: ["Snorkeling", "Barbecue", "Island Camping", "Biking"],
    category: "Beach"
  },
  {
    id: "dest-5",
    name: "Sundarbans",
    slug: "sundarbans",
    division: "Khulna",
    tagline: "The world's largest mangrove forest & Royal Bengal Tiger sanctuary",
    description: "UNESCO World Heritage mangrove forest crisscrossed by thousands of tidal streams, home to Bengal tigers, spotted deer, and saltwater crocodiles.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 750,
    bestMonths: ["Nov", "Dec", "Jan", "Feb"],
    estimatedDailyBudget: { min: 5000, max: 15000 },
    highlights: ["Kotka Wildlife Watchtower", "Harbaria Eco Tourism", "Karamjal Crocodile Center", "Canal Boat Cruise"],
    popularFor: ["Wildlife Safari", "Boat Living", "Birding", "Adventure"],
    category: "Forest"
  },
  {
    id: "dest-6",
    name: "Bandarban",
    slug: "bandarban",
    division: "Chittagong",
    tagline: "Highest peaks, dramatic waterfalls and tribal heritage",
    description: "A mystical district featuring Bangladesh's tallest mountain peaks (Keokradong, Saka Haphong), Nafakhum falls, and indigenous Marma and Bawm villages.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 890,
    bestMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    estimatedDailyBudget: { min: 2800, max: 7500 },
    highlights: ["Nilgiri Clouds Resort", "Nafakhum Waterfalls", "Boga Lake", "Golden Temple (Buddha Dhatu Jadi)"],
    popularFor: ["Mountain Trekking", "Waterfall Expeditions", "Cultural Tours", "Camping"],
    category: "Hills"
  }
];

export const SAMPLE_HOTELS: Hotel[] = [
  {
    id: "h-1",
    name: "Sayeman Beach Resort",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    starRating: 5,
    userRating: 4.8,
    reviewCount: 654,
    address: "Marine Drive Road, Kolatoli, Cox's Bazar",
    distanceFromCenter: "0.2 km from Beach",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    nightlyPrice: 8500,
    hasAC: true,
    hasBreakfast: true,
    hasPool: true,
    hasParking: true,
    hasWifi: true,
    maxGuests: 3,
    bedType: "1 King Bed + Sea View",
    rateSource: "Agoda Partner API",
    isVerified: true,
    verifiedAt: "2 hrs ago"
  },
  {
    id: "h-2",
    name: "Long Beach Hotel",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    starRating: 4,
    userRating: 4.5,
    reviewCount: 420,
    address: "14 Kalatoli Road, Cox's Bazar",
    distanceFromCenter: "0.8 km from Beach",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
    nightlyPrice: 5200,
    hasAC: true,
    hasBreakfast: true,
    hasPool: true,
    hasParking: true,
    hasWifi: true,
    maxGuests: 4,
    bedType: "2 Queen Beds",
    rateSource: "Verified Direct Tariff",
    isVerified: true,
    verifiedAt: "Yesterday"
  },
  {
    id: "h-3",
    name: "Sajek Hill View Cottage",
    destinationSlug: "sajek-valley",
    destinationName: "Sajek Valley",
    starRating: 3,
    userRating: 4.7,
    reviewCount: 312,
    address: "Ruiluipara, Sajek Valley",
    distanceFromCenter: "Heart of Ruilui",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
    nightlyPrice: 3800,
    hasAC: false,
    hasBreakfast: true,
    hasPool: false,
    hasParking: false,
    hasWifi: true,
    maxGuests: 2,
    bedType: "1 Double Bed + Valley Balcony",
    rateSource: "Verified Direct Tariff",
    isVerified: true,
    verifiedAt: "3 hrs ago"
  },
  {
    id: "h-4",
    name: "Grand Sultan Tea Resort & Golf",
    destinationSlug: "sreemangal",
    destinationName: "Sreemangal",
    starRating: 5,
    userRating: 4.9,
    reviewCount: 890,
    address: "Radhanagar, Sreemangal, Moulvibazar",
    distanceFromCenter: "3.5 km from Town",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
    nightlyPrice: 11500,
    hasAC: true,
    hasBreakfast: true,
    hasPool: true,
    hasParking: true,
    hasWifi: true,
    maxGuests: 3,
    bedType: "King Bed + Golf View",
    rateSource: "Agoda Partner API",
    isVerified: true,
    verifiedAt: "Today, 10:00 AM"
  },
  {
    id: "h-5",
    name: "Hotel Seagull Cox's Bazar",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    starRating: 4,
    userRating: 4.3,
    reviewCount: 520,
    address: "Hotel Motel Zone, Cox's Bazar",
    distanceFromCenter: "0.3 km from Beach",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
    nightlyPrice: 4200,
    hasAC: true,
    hasBreakfast: true,
    hasPool: true,
    hasParking: true,
    hasWifi: true,
    maxGuests: 2,
    bedType: "1 Deluxe King",
    rateSource: "Estimated Market Rate",
    isVerified: false,
    verifiedAt: "Needs Refresh"
  },
  {
    id: "h-6",
    name: "Blue Marine Resort",
    destinationSlug: "saint-martins",
    destinationName: "Saint Martin's Island",
    starRating: 3,
    userRating: 4.4,
    reviewCount: 280,
    address: "Delpara, Saint Martin Island",
    distanceFromCenter: "Beachfront",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
    nightlyPrice: 4500,
    hasAC: false,
    hasBreakfast: false,
    hasPool: false,
    hasParking: false,
    hasWifi: false,
    maxGuests: 4,
    bedType: "2 Double Beds Oceanfront",
    rateSource: "Verified Direct Tariff",
    isVerified: true,
    verifiedAt: "1 day ago"
  }
];

export const SAMPLE_TRANSPORTS: TransportOption[] = [
  {
    id: "t-1",
    operator: "Green Line Paribahan",
    type: "bus",
    origin: "Dhaka (Arambagh)",
    destination: "Cox's Bazar",
    seatClass: "Scania Multi-Axle Sleeper AC",
    departureTime: "22:30",
    arrivalTime: "07:30",
    duration: "9h 00m",
    fare: 2500,
    isAC: true,
    source: "Shohoz API",
    verifiedAt: "15 mins ago",
    isLive: true
  },
  {
    id: "t-2",
    operator: "Bangladesh Railway (Cox's Bazar Express)",
    type: "train",
    origin: "Dhaka (Kamalapur)",
    destination: "Cox's Bazar (Iconic Station)",
    seatClass: "Snigdha (AC Chair)",
    departureTime: "06:15",
    arrivalTime: "14:40",
    duration: "8h 25m",
    fare: 1325,
    isAC: true,
    source: "Railway e-Ticket",
    verifiedAt: "30 mins ago",
    isLive: true
  },
  {
    id: "t-3",
    operator: "Biman Bangladesh Airlines",
    type: "flight",
    origin: "Dhaka (DAC)",
    destination: "Cox's Bazar (CXB)",
    seatClass: "Economy Super",
    departureTime: "11:20",
    arrivalTime: "12:25",
    duration: "1h 05m",
    fare: 4850,
    isAC: true,
    source: "Biman BD",
    verifiedAt: "5 mins ago",
    isLive: true
  },
  {
    id: "t-4",
    operator: "Hanif Enterprise",
    type: "bus",
    origin: "Dhaka (Sayedabad)",
    destination: "Cox's Bazar",
    seatClass: "Hino 1J Non-AC",
    departureTime: "21:00",
    arrivalTime: "06:30",
    duration: "9h 30m",
    fare: 950,
    isAC: false,
    source: "Shohoz API",
    verifiedAt: "1 hour ago",
    isLive: true
  },
  {
    id: "t-5",
    operator: "MV Bay One (Luxury Cruise)",
    type: "ferry",
    origin: "Chattogram Water Bus Terminal",
    destination: "Saint Martin's Island",
    seatClass: "Bunker Class Bed",
    departureTime: "22:00",
    arrivalTime: "08:00",
    duration: "10h 00m",
    fare: 3200,
    isAC: true,
    source: "Launch Portal",
    verifiedAt: "4 hours ago",
    isLive: false
  },
  {
    id: "t-6",
    operator: "Upaban Express",
    type: "train",
    origin: "Dhaka (Kamalapur)",
    destination: "Sreemangal",
    seatClass: "Shovon Chair",
    departureTime: "20:30",
    arrivalTime: "00:45",
    duration: "4h 15m",
    fare: 310,
    isAC: false,
    source: "Railway e-Ticket",
    verifiedAt: "2 hours ago",
    isLive: true
  }
];
