export interface FishingArea {
  id: string
  name: string
  island: 'Unguja' | 'Pemba'
  latitude: number
  longitude: number
}

export const FISHING_AREAS: FishingArea[] = [
  { id: 'nungwi', name: 'Nungwi', island: 'Unguja', latitude: -5.726, longitude: 39.298 },
  { id: 'matemwe', name: 'Matemwe', island: 'Unguja', latitude: -5.878, longitude: 39.359 },
  { id: 'mkokotoni', name: 'Mkokotoni', island: 'Unguja', latitude: -5.852, longitude: 39.252 },
  { id: 'tumbatu', name: 'Tumbatu', island: 'Unguja', latitude: -5.815, longitude: 39.190 },
  { id: 'pwani-mchangani', name: 'Pwani Mchangani', island: 'Unguja', latitude: -5.927, longitude: 39.359 },
  { id: 'kiwengwa', name: 'Kiwengwa', island: 'Unguja', latitude: -5.984, longitude: 39.372 },
  { id: 'chwaka', name: 'Chwaka', island: 'Unguja', latitude: -6.114, longitude: 39.425 },
  { id: 'uroa', name: 'Uroa', island: 'Unguja', latitude: -6.120, longitude: 39.440 },
  { id: 'bwejuu', name: 'Bwejuu', island: 'Unguja', latitude: -6.218, longitude: 39.530 },
  { id: 'paje', name: 'Paje', island: 'Unguja', latitude: -6.266, longitude: 39.535 },
  { id: 'jambiani', name: 'Jambiani', island: 'Unguja', latitude: -6.315, longitude: 39.551 },
  { id: 'kizimkazi', name: 'Kizimkazi', island: 'Unguja', latitude: -6.455, longitude: 39.469 },
  { id: 'uzi', name: 'Uzi', island: 'Unguja', latitude: -6.390, longitude: 39.360 },
  { id: 'unguja-kuu', name: 'Unguja Ukuu', island: 'Unguja', latitude: -6.314, longitude: 39.383 },
  { id: 'malindi', name: 'Malindi', island: 'Unguja', latitude: -6.159, longitude: 39.187 },
  { id: 'fumba', name: 'Fumba', island: 'Unguja', latitude: -6.310, longitude: 39.263 },
  { id: 'michamvi', name: 'Michamvi', island: 'Unguja', latitude: -6.136, longitude: 39.493 },
  { id: 'wete', name: 'Wete', island: 'Pemba', latitude: -5.055, longitude: 39.729 },
  { id: 'mkoani', name: 'Mkoani', island: 'Pemba', latitude: -5.360, longitude: 39.650 },
  { id: 'chake-chake-wesha', name: 'Chake Chake/Wesha', island: 'Pemba', latitude: -5.245, longitude: 39.767 },
  { id: 'makangale', name: 'Makangale', island: 'Pemba', latitude: -4.954, longitude: 39.750 },
  { id: 'mtangani', name: 'Mtangani', island: 'Pemba', latitude: -5.058, longitude: 39.730 },
  { id: 'wambaa', name: 'Wambaa', island: 'Pemba', latitude: -5.180, longitude: 39.760 },
  { id: 'kisiwa-panza', name: 'Kisiwa Panza', island: 'Pemba', latitude: -5.550, longitude: 39.860 },
  { id: 'kojani', name: 'Kojani', island: 'Pemba', latitude: -5.130, longitude: 39.780 },
  { id: 'kengeja', name: 'Kengeja', island: 'Pemba', latitude: -5.120, longitude: 39.840 },
  { id: 'kangani', name: 'Kangani', island: 'Pemba', latitude: -5.150, longitude: 39.800 },
  { id: 'tumbe', name: 'Tumbe', island: 'Pemba', latitude: -4.990, longitude: 39.770 },
  { id: 'mtambwe', name: 'Mtambwe', island: 'Pemba', latitude: -4.990, longitude: 39.730 },
]

export function getFishingAreas(island: FishingArea['island']): FishingArea[] {
  return FISHING_AREAS.filter((area) => area.island === island)
}
