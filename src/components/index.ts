export type { Language, Station, FishingZone, CatchRecord, TripRecord, AppState } from '../types/index'

export { getStationsByIsland } from '../data/stations'
export { DEFAULT_LANGUAGE } from '../types/index'
export { FISHING_ZONES, getZonesByIsland as getZones } from '../data/fishingZones'
export { SAMPLE_TRIPS, SAMPLE_CATCHES } from '../data/demoTrips'