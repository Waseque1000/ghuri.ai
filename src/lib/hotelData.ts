export interface RoomOption {
  id: string;
  name: string; // e.g. "Deluxe Double Sea View", "Family Suite"
  bedType: string; // "1 King Bed", "2 Queen Beds"
  maxGuests: number;
  hasAC: boolean;
  viewType: "Sea View" | "Hill View" | "Garden View" | "City View";
  roomOnlyPrice: number;
  breakfastIncludedPrice: number;
  extraPersonFee: number;
}

export interface AdvancedHotel {
  id: string;
  name: string;
  destinationSlug: string;
  destinationName: string;
  propertyType: "Hotel" | "Resort" | "Guesthouse" | "Serviced Apartment";
  starRating: number;
  guestRating: number;
  reviewCount: number;
  address: string;
  distanceFromBeach: string;
  imageUrl: string;
  images: string[];
  // Amenities & Facilities
  hasPool: boolean;
  poolDetails: "Outdoor Infinity Pool (Complimentary)" | "Indoor Heated Pool" | "Children's Splash Pool" | "Children's Splash Pool & Adult Pool" | "None";
  hasParking: boolean;
  parkingDetails: "Free Private Secure Parking" | "Paid Valet Parking (৳300/day)" | "Street Parking Only";
  hasWifi: boolean;
  hasFreeCancellation: boolean;
  hasElevator: boolean;
  hasHotWater: boolean;
  diningOptions: "Buffet & 2 Multi-cuisine Restaurants" | "Complimentary Breakfast Buffet" | "In-room Dining Only";
  transportPickup: "Free Airport & Station Shuttle" | "Shuttle on Request (Paid)" | "Not Available";
  // Room Inventory
  rooms: RoomOption[];
  rateSource: "Verified Direct Tariff" | "Agoda Partner API" | "Hotel Association Rate";
  verifiedAt: string;
  badge?: "Cheapest Stay" | "Best Value" | "Family Friendly" | "Luxury Pick";
}

export const ADVANCED_HOTEL_INVENTORY: AdvancedHotel[] = [
  {
    id: "hotel-sayeman",
    name: "Sayeman Beach Resort",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Resort",
    starRating: 5,
    guestRating: 9.1,
    reviewCount: 1240,
    address: "Marine Drive Road, Kolatoli, Cox's Bazar",
    distanceFromBeach: "Beachfront (0m)",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop"
    ],
    hasPool: true,
    poolDetails: "Outdoor Infinity Pool (Complimentary)",
    hasParking: true,
    parkingDetails: "Free Private Secure Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Buffet & 2 Multi-cuisine Restaurants",
    transportPickup: "Free Airport & Station Shuttle",
    badge: "Luxury Pick",
    rateSource: "Agoda Partner API",
    verifiedAt: "12 mins ago",
    rooms: [
      {
        id: "sayeman-r1",
        name: "Super Deluxe Sea View Room",
        bedType: "1 King Bed + Oceanfront Balcony",
        maxGuests: 2,
        hasAC: true,
        viewType: "Sea View",
        roomOnlyPrice: 8200,
        breakfastIncludedPrice: 9400,
        extraPersonFee: 1500
      },
      {
        id: "sayeman-r2",
        name: "Executive Ocean Suite",
        bedType: "1 King Bed + 1 Sofa Bed",
        maxGuests: 4,
        hasAC: true,
        viewType: "Sea View",
        roomOnlyPrice: 14500,
        breakfastIncludedPrice: 16200,
        extraPersonFee: 2000
      }
    ]
  },
  {
    id: "hotel-longbeach",
    name: "Long Beach Hotel",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    starRating: 4,
    guestRating: 8.6,
    reviewCount: 880,
    address: "14 Kalatoli Road, Hotel Motel Zone, Cox's Bazar",
    distanceFromBeach: "450m from Beach",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop"],
    hasPool: true,
    poolDetails: "Indoor Heated Pool",
    hasParking: true,
    parkingDetails: "Free Private Secure Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Complimentary Breakfast Buffet",
    transportPickup: "Shuttle on Request (Paid)",
    badge: "Best Value",
    rateSource: "Verified Direct Tariff",
    verifiedAt: "1 hour ago",
    rooms: [
      {
        id: "longbeach-r1",
        name: "Premier Twin Comfort",
        bedType: "2 Queen Beds",
        maxGuests: 4,
        hasAC: true,
        viewType: "City View",
        roomOnlyPrice: 4200,
        breakfastIncludedPrice: 5000,
        extraPersonFee: 800
      },
      {
        id: "longbeach-r2",
        name: "Deluxe King Hill View",
        bedType: "1 King Bed",
        maxGuests: 2,
        hasAC: true,
        viewType: "Hill View",
        roomOnlyPrice: 3800,
        breakfastIncludedPrice: 4500,
        extraPersonFee: 800
      }
    ]
  },
  {
    id: "hotel-seagull",
    name: "Hotel Seagull Cox's Bazar",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Hotel",
    starRating: 4,
    guestRating: 8.2,
    reviewCount: 950,
    address: "Hotel Motel Zone, Cox's Bazar",
    distanceFromBeach: "300m from Beach",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop"],
    hasPool: true,
    poolDetails: "Outdoor Infinity Pool (Complimentary)",
    hasParking: true,
    parkingDetails: "Free Private Secure Parking",
    hasWifi: true,
    hasFreeCancellation: false,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Buffet & 2 Multi-cuisine Restaurants",
    transportPickup: "Free Airport & Station Shuttle",
    badge: "Family Friendly",
    rateSource: "Verified Direct Tariff",
    verifiedAt: "3 hours ago",
    rooms: [
      {
        id: "seagull-r1",
        name: "Regular Deluxe Room",
        bedType: "2 Twin Beds",
        maxGuests: 2,
        hasAC: true,
        viewType: "Garden View",
        roomOnlyPrice: 3200,
        breakfastIncludedPrice: 3800,
        extraPersonFee: 600
      },
      {
        id: "seagull-r2",
        name: "Family Suite Interconnected",
        bedType: "1 King + 2 Singles",
        maxGuests: 5,
        hasAC: true,
        viewType: "Sea View",
        roomOnlyPrice: 6500,
        breakfastIncludedPrice: 7600,
        extraPersonFee: 1000
      }
    ]
  },
  {
    id: "hotel-oceanparadise",
    name: "Ocean Paradise Hotel & Resort",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Resort",
    starRating: 5,
    guestRating: 8.8,
    reviewCount: 1100,
    address: "28-29 Hotel Motel Zone, Kolatoli, Cox's Bazar",
    distanceFromBeach: "200m from Beach",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop"],
    hasPool: true,
    poolDetails: "Children's Splash Pool & Adult Pool",
    hasParking: true,
    parkingDetails: "Free Private Secure Parking",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: true,
    hasHotWater: true,
    diningOptions: "Buffet & 2 Multi-cuisine Restaurants",
    transportPickup: "Free Airport & Station Shuttle",
    badge: "Luxury Pick",
    rateSource: "Agoda Partner API",
    verifiedAt: "25 mins ago",
    rooms: [
      {
        id: "ocean-r1",
        name: "Deluxe Ocean Crest",
        bedType: "1 King Bed",
        maxGuests: 2,
        hasAC: true,
        viewType: "Sea View",
        roomOnlyPrice: 6800,
        breakfastIncludedPrice: 7800,
        extraPersonFee: 1200
      }
    ]
  },
  {
    id: "hotel-beachway",
    name: "Beach Way Guesthouse & Inn",
    destinationSlug: "coxs-bazar",
    destinationName: "Cox's Bazar",
    propertyType: "Guesthouse",
    starRating: 3,
    guestRating: 7.9,
    reviewCount: 340,
    address: "Plot 32, Kolatoli Main Road, Cox's Bazar",
    distanceFromBeach: "600m from Beach",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop"],
    hasPool: false,
    poolDetails: "None",
    hasParking: true,
    parkingDetails: "Paid Valet Parking (৳300/day)",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: false,
    hasHotWater: true,
    diningOptions: "In-room Dining Only",
    transportPickup: "Not Available",
    badge: "Cheapest Stay",
    rateSource: "Verified Direct Tariff",
    verifiedAt: "Yesterday",
    rooms: [
      {
        id: "beachway-r1",
        name: "Standard AC Double",
        bedType: "1 Double Bed",
        maxGuests: 2,
        hasAC: true,
        viewType: "City View",
        roomOnlyPrice: 1800,
        breakfastIncludedPrice: 2200,
        extraPersonFee: 400
      },
      {
        id: "beachway-r2",
        name: "Economy Non-AC Room",
        bedType: "2 Single Beds",
        maxGuests: 2,
        hasAC: false,
        viewType: "City View",
        roomOnlyPrice: 1200,
        breakfastIncludedPrice: 1550,
        extraPersonFee: 300
      }
    ]
  },
  {
    id: "hotel-sajek-cloud",
    name: "Sajek Valley Cloud Eco Cottage",
    destinationSlug: "sajek-valley",
    destinationName: "Sajek Valley",
    propertyType: "Guesthouse",
    starRating: 3,
    guestRating: 9.3,
    reviewCount: 410,
    address: "Ruilui Para, Sajek Valley, Rangamati",
    distanceFromBeach: "Hilltop (Mizoram View)",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop"],
    hasPool: false,
    poolDetails: "None",
    hasParking: false,
    parkingDetails: "Street Parking Only",
    hasWifi: true,
    hasFreeCancellation: true,
    hasElevator: false,
    hasHotWater: true,
    diningOptions: "In-room Dining Only",
    transportPickup: "Shuttle on Request (Paid)",
    badge: "Best Value",
    rateSource: "Verified Direct Tariff",
    verifiedAt: "4 hours ago",
    rooms: [
      {
        id: "sajek-r1",
        name: "Cloud Edge Balcony Cottage",
        bedType: "1 King Bed + Hammock",
        maxGuests: 2,
        hasAC: false,
        viewType: "Hill View",
        roomOnlyPrice: 3500,
        breakfastIncludedPrice: 4000,
        extraPersonFee: 600
      }
    ]
  }
];
