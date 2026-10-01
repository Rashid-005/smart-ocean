import type { AppState, CatchRecord, Station, TripRecord } from '../types/index';
import { DEFAULT_LANGUAGE } from '../types/index';
import { getStationsByIsland, UNGUJA_STATIONS } from '../data/stations';

function readValue<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeValue<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable in private browsing or when the quota is full.
  }
}

function restoreTrip(trip: TripRecord): TripRecord {
  return {
    ...trip,
    startTime: new Date(trip.startTime),
    endTime: trip.endTime ? new Date(trip.endTime) : undefined,
    catches: trip.catches ?? [],
  };
}

export function loadAppState(): AppState {
  const island = readValue<AppState['island']>('smartOcean.island', 'Unguja');
  const stations = getStationsByIsland(island);
  const station = readValue<Station>('smartOcean.station', UNGUJA_STATIONS[0]);
  const trips = readValue<TripRecord[]>('smartOcean.trips', []).map(restoreTrip);
  const activeTripValue = readValue<TripRecord | null>('smartOcean.activeTrip', null);

  return {
    language: readValue('smartOcean.language', DEFAULT_LANGUAGE),
    island,
    station: stations.find((item) => item.id === station.id) ?? stations[0],
    trips,
    catches: readValue<CatchRecord[]>('smartOcean.catches', []),
    activeTrip: activeTripValue ? restoreTrip(activeTripValue) : null,
  };
}

export function saveAppState(state: AppState): void {
  writeValue('smartOcean.language', state.language);
  writeValue('smartOcean.island', state.island);
  writeValue('smartOcean.station', state.station);
  writeValue('smartOcean.trips', state.trips);
  writeValue('smartOcean.catches', state.catches);
  writeValue('smartOcean.activeTrip', state.activeTrip);
}

export const INITIAL_STATE = loadAppState();