import type { Station } from '../types/index';

// Unguja stations
export const UNGUJA_STATIONS: Station[] = [
  { id: 'malindi', name: 'Malindi', island: 'Unguja' },
  { id: 'nungwi', name: 'Nungwi', island: 'Unguja' },
  { id: 'matemwe', name: 'Matemwe', island: 'Unguja' },
];

// Pemba stations
export const PEMBA_STATIONS: Station[] = [
  { id: 'chake-chake', name: 'Chake Chake', island: 'Pemba' },
  { id: 'wete', name: 'Wete', island: 'Pemba' },
  { id: 'mkoani', name: 'Mkoani', island: 'Pemba' },
];

export function getStationsByIsland(island: 'Unguja' | 'Pemba'): Station[] {
  if (island === 'Unguja') return UNGUJA_STATIONS;
  return PEMBA_STATIONS;
}