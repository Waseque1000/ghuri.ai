export type BudgetInput = {
  travelers: number;
  nights: number;
  transportPerPerson: number;
  roomPricePerNight: number;
  rooms: number;
  foodPerPersonPerDay: number;
  localTransportTotal: number;
  activityPerPerson: number;
  contingencyPercent?: number;
  isRoundTripTransport?: boolean;
  breakfastIncluded?: boolean;
};

export interface BudgetResult {
  days: number;
  rooms: number;
  transport: number;
  accommodation: number;
  food: number;
  effectiveFoodPerDay: number;
  activities: number;
  localTransport: number;
  localAndActivities: number;
  subtotal: number;
  contingencyPercent: number;
  contingency: number;
  total: number;
  perPerson: number;
  breakdown: {
    transportNote: string;
    foodNote: string;
    accommodationNote: string;
    localActivitiesNote: string;
    contingencyNote: string;
  };
}

export function calculateTripBudget(input: BudgetInput): BudgetResult {
  const travelers = Math.max(1, Math.round(input.travelers || 1));
  const nights = Math.max(1, Math.round(input.nights || 1));
  const days = nights + 1;
  const rooms = Math.max(1, Math.round(input.rooms || 1));

  // Round trip multiplier (2 for round trip, 1 for one way)
  const transportMultiplier = input.isRoundTripTransport !== false ? 2 : 1;
  const transport = Math.round(travelers * input.transportPerPerson * transportMultiplier);

  // Accommodation: rooms * nights * nightly rate
  const accommodation = Math.round(nights * rooms * input.roomPricePerNight);

  // If breakfast is included in room tariff, reduce daily food expense by 20%
  const effectiveFoodPerDay = input.breakfastIncluded
    ? Math.round(Math.max(200, input.foodPerPersonPerDay * 0.8))
    : Math.round(input.foodPerPersonPerDay);

  const food = Math.round(travelers * days * effectiveFoodPerDay);
  const activities = Math.round(travelers * input.activityPerPerson);
  const localTransport = Math.round(input.localTransportTotal);
  const localAndActivities = localTransport + activities;

  const subtotal = transport + accommodation + food + localAndActivities;
  const contingencyPercent = input.contingencyPercent ?? 0;
  const contingency = Math.round((subtotal * contingencyPercent) / 100);
  const total = subtotal + contingency;
  const perPerson = Math.round(total / travelers);

  return {
    days,
    rooms,
    transport,
    accommodation,
    food,
    effectiveFoodPerDay,
    activities,
    localTransport,
    localAndActivities,
    subtotal,
    contingencyPercent,
    contingency,
    total,
    perPerson,
    breakdown: {
      transportNote: `${travelers} traveler(s) × ৳${input.transportPerPerson.toLocaleString()} × ${transportMultiplier} (${transportMultiplier === 2 ? "Round Trip" : "One Way"})`,
      foodNote: `${travelers} traveler(s) × ${days} days × ৳${effectiveFoodPerDay.toLocaleString()}/day${input.breakfastIncluded ? " (Breakfast in hotel)" : ""}`,
      accommodationNote: `${rooms} room(s) × ${nights} night(s) × ৳${input.roomPricePerNight.toLocaleString()}/night`,
      localActivitiesNote: `Transit ৳${localTransport.toLocaleString()} + Sightseeing (${travelers} × ৳${input.activityPerPerson.toLocaleString()})`,
      contingencyNote: `${contingencyPercent}% of ৳${subtotal.toLocaleString()} subtotal`
    }
  };
}
