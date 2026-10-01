import type { TripRecord, CatchRecord } from '../types/index';

// Sample historical trips for initial load
export const SAMPLE_TRIPS: TripRecord[] = [
  {
    id: 'trip-1',
    destination: 'North Reef',
    departure: 'Malindi',
    island: 'Unguja',
    startTime: new Date('2026-08-15'),
    endTime: new Date('2026-08-15'),
    distanceKm: 8.4,
    status: 'completed',
    catches: [
      { id: 'c-1', tripId: 'trip-1', species: 'Tuna', weightKg: 6.5, date: '2026-08-15', zoneId: 'zone-a', zoneName: 'North Reef', notes: 'Good catch with net' },
      { id: 'c-2', tripId: 'trip-1', species: 'Snapper', weightKg: 3.2, date: '2026-08-15', zoneId: 'zone-a', zoneName: 'North Reef' },
    ],
  },
  {
    id: 'trip-2',
    destination: 'East Bank',
    departure: 'Nungwi',
    island: 'Unguja',
    startTime: new Date('2026-07-22'),
    endTime: new Date('2026-07-22'),
    distanceKm: 11.7,
    status: 'completed',
    catches: [
      { id: 'c-3', tripId: 'trip-2', species: 'Snapper', weightKg: 4.8, date: '2026-07-22', zoneId: 'zone-b', zoneName: 'East Bank' },
      { id: 'c-4', tripId: 'trip-2', species: 'Kingfish', weightKg: 2.1, date: '2026-07-22', zoneId: 'zone-b', zoneName: 'East Bank' },
    ],
  },
  {
    id: 'trip-3',
    destination: 'Pemba Channel',
    departure: 'Chake Chake',
    island: 'Pemba',
    startTime: new Date('2026-06-10'),
    endTime: new Date('2026-06-10'),
    distanceKm: 9.6,
    status: 'completed',
    catches: [
      { id: 'c-5', tripId: 'trip-3', species: 'Tuna', weightKg: 5.0, date: '2026-06-10', zoneId: 'zone-d', zoneName: 'Pemba Channel' },
      { id: 'c-6', tripId: 'trip-3', species: 'Snapper', weightKg: 2.9, date: '2026-06-10', zoneId: 'zone-d', zoneName: 'Pemba Channel' },
    ],
  },
];

export const SAMPLE_CATCHES: CatchRecord[] = SAMPLE_TRIPS.flatMap(trip => trip.catches);