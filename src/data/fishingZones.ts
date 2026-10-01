import type { FishingZone } from '../types/index';

// Zone A — North Reef (Unguja)
export const ZONE_A: FishingZone = {
  id: 'zone-a',
  name: 'North Reef',
  island: 'Unguja',
  latitude: -6.2000,
  longitude: 39.2500,
  suitability: 'high',
  distanceKm: 8.4,
  species: ['Tuna', 'Snapper'],
  waterTemperature: 28.5,
  waveHeight: 1.1,
  windSpeed: 12,
  visibility: 8,
  description: 'Higher illustrative suitability fishing zone north of Unguja.',
  safetyChecklist: ['Check weather conditions', 'Carry life jackets', 'Carry drinking water', 'Check fuel', 'Tell someone your destination'],
};

// Zone B — East Bank (Unguja)
export const ZONE_B: FishingZone = {
  id: 'zone-b',
  name: 'East Bank',
  island: 'Unguja',
  latitude: -6.1500,
  longitude: 39.3000,
  suitability: 'moderate',
  distanceKm: 11.7,
  species: ['Snapper', 'Kingfish'],
  waterTemperature: 28.2,
  waveHeight: 1.4,
  windSpeed: 15,
  visibility: 7,
  description: 'Moderate illustrative suitability fishing zone east of Unguja.',
  safetyChecklist: ['Check weather conditions', 'Carry life jackets', 'Carry drinking water', 'Check fuel', 'Tell someone your destination'],
};

// Zone C — South Channel (Unguja)
export const ZONE_C: FishingZone = {
  id: 'zone-c',
  name: 'South Channel',
  island: 'Unguja',
  latitude: -6.0500,
  longitude: 39.2000,
  suitability: 'high',
  distanceKm: 15.2,
  species: ['Tuna', 'Grouper'],
  waterTemperature: 28.8,
  waveHeight: 1.0,
  windSpeed: 10,
  visibility: 9,
  description: 'Higher illustrative suitability fishing zone south of Unguja.',
  safetyChecklist: ['Check weather conditions', 'Carry life jackets', 'Carry drinking water', 'Check fuel', 'Tell someone your destination'],
};

// Zone D — Pemba Channel (Pemba)
export const ZONE_D: FishingZone = {
  id: 'zone-d',
  name: 'Pemba Channel',
  island: 'Pemba',
  latitude: -5.5000,
  longitude: 39.8000,
  suitability: 'moderate',
  distanceKm: 9.6,
  species: ['Tuna', 'Snapper'],
  waterTemperature: 27.9,
  waveHeight: 1.3,
  windSpeed: 14,
  visibility: 7,
  description: 'Moderate illustrative suitability fishing channel between Unguja and Pemba.',
  safetyChecklist: ['Check weather conditions', 'Carry life jackets', 'Carry drinking water', 'Check fuel', 'Tell someone your destination'],
};

export const ZONE_E: FishingZone = {
  id: 'zone-e',
  name: 'West Shoal',
  island: 'Unguja',
  latitude: -6.3100,
  longitude: 39.0500,
  suitability: 'low',
  distanceKm: 13.3,
  species: ['Grouper'],
  waterTemperature: 28.1,
  waveHeight: 1.8,
  windSpeed: 18,
  visibility: 5,
  description: 'Lower illustrative suitability in a fictional western demo zone.',
  safetyChecklist: ['Check weather conditions', 'Carry life jackets', 'Carry drinking water', 'Check fuel', 'Tell someone your destination'],
};

export const FISHING_ZONES: FishingZone[] = [ZONE_A, ZONE_B, ZONE_C, ZONE_D, ZONE_E];

export function getZonesByIsland(island: 'Unguja' | 'Pemba'): FishingZone[] {
  return FISHING_ZONES.filter(zone => zone.island === island);
}