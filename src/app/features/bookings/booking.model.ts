export interface CreateBookingRequest {
  roomId: number;
  requestedBy: string;
  startTime: string;
  endTime: string;
}

export interface BookingResponse {
  id: number;
  roomId: number;
  requestedBy: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface AvailabilityResponse {
  roomId: number;
  available: boolean;
}

export const SEEDED_ROOMS = [
  { id: 1, name: 'Aurora', capacity: 4, pricePerHour: 12.5 },
  { id: 2, name: 'Borealis', capacity: 8, pricePerHour: 22.0 },
  { id: 3, name: 'Comet', capacity: 2, pricePerHour: 8.0 }
];
