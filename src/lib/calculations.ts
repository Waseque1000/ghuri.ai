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
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  localTransport: number;
  subtotal: number;
  contingency: number;
  total: number;
  perPerson: number;
  breakdown: {
    transportNote: string;
    foodNote: string;
    accommodationNote: string;
  };
}

export function calculateTripBudget(input: BudgetInput): BudgetResult {
  const travelers = Math.max(1, input.travelers);
  const nights = Math.max(1, input.nights);
  const days = nights + 1;
  const rooms = Math.max(1, input.rooms);

  // Round trip multiplier
  const transportMultiplier = input.isRoundTripTransport !== false ? 2 : 1;
  const transport = travelers * input.transportPerPerson * transportMultiplier;

  const accommodation = nights * rooms * input.roomPricePerNight;

  // If breakfast is included in room tariff, reduce daily food expense by approx 20%
  const effectiveFoodPerDay = input.breakfastIncluded
    ? Math.max(200, input.foodPerPersonPerDay * 0.8)
    : input.foodPerPersonPerDay;

  const food = travelers * days * effectiveFoodPerDay;
  const activities = travelers * input.activityPerPerson;
  const localTransport = input.localTransportTotal;

  const subtotal = transport + accommodation + food + localTransport + activities;
  const contingencyPercent = input.contingencyPercent ?? 10;
  const contingency = (subtotal * contingencyPercent) / 100;
  const total = subtotal + contingency;

  return {
    transport,
    accommodation,
    food,
    activities,
    localTransport,
    subtotal,
    contingency,
    total,
    perPerson: Math.round(total / travelers),
    breakdown: {
      transportNote: `${travelers} traveler(s) × ৳${input.transportPerPerson.toLocaleString()} ${transportMultiplier === 2 ? '(Round Trip)' : '(One Way)'}`,
      foodNote: `${travelers} traveler(s) × ${days} days ${input.breakfastIncluded ? '(Breakfast included in hotel)' : ''}`,
      accommodationNote: `${rooms} room(s) × ${nights} night(s) @ ৳${input.roomPricePerNight.toLocaleString()}/night`
    }
  };
}
