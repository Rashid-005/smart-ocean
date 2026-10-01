export interface Language {
  code: 'en' | 'sw';
  name: string;
}

export interface Station {
  id: string;
  name: string;
  island: 'Unguja' | 'Pemba';
}

export interface FishingZone {
  id: string;
  name: string;
  island: 'Unguja' | 'Pemba';
  latitude: number;
  longitude: number;
  suitability: 'high' | 'moderate' | 'low';
  distanceKm: number;
  species: string[];
  waterTemperature: number;
  waveHeight: number;
  windSpeed: number;
  visibility: number;
  description: string;
  safetyChecklist: string[];
}

export interface CatchRecord {
  id: string;
  tripId: string;
  species: string;
  weightKg: number;
  date: string;
  zoneId: string;
  zoneName: string;
  notes?: string;
  photoUrl?: string;
}

export interface TripRecord {
  id: string;
  destination: string;
  departure: string;
  island: 'Unguja' | 'Pemba';
  startTime: Date;
  endTime?: Date;
  distanceKm: number;
  status: 'active' | 'completed';
  catches: CatchRecord[];
}

export interface AppState {
  language: Language;
  island: 'Unguja' | 'Pemba';
  station: Station;
  trips: TripRecord[];
  catches: CatchRecord[];
  activeTrip: TripRecord | null;
}

export const DEFAULT_LANGUAGE: Language = { code: 'sw', name: 'Kiswahili' };
export const DEFAULT_ISLAND: 'Unguja' | 'Pemba' = 'Unguja';