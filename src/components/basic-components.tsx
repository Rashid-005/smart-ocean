import type { Language, Station } from '../types/index'
import { getStationsByIsland } from '../data/stations'

export type { Language, Station, FishingZone, CatchRecord, TripRecord, AppState } from '../types/index'

// Language selector component
export const LanguageSelector = ({ currentLanguage, onLanguageChange }: { currentLanguage: Language; onLanguageChange: () => void }) => {
  return (
    <div className="language-selector flex items-center gap-2">
      <button 
        onClick={onLanguageChange}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
          currentLanguage.code === 'sw' 
            ? 'bg-ocean-500 text-white' 
            : 'bg-white text-ocean-700 border border-ocean-200'
        }`}
        aria-label="Switch to Kiswahili"
      >
        {currentLanguage.code === 'sw' ? 'KiSwahili' : 'English'}
        <svg className="inline ml-1 w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 18h.01M8 6h8l.4 2h3l.4-2H8l.5-2zM12 2v2l3 3h1l-3 3v-2c0-1.1-.9-2-2-2s-2 .9-2 2v2L8 2v2l3 3H5l3 3v-2C3 12 2 13 2 15v2l3 3h2l3-3v-2c0-1.1-.9-2-2-2s-2 .9-2 2v2l3 3H5l3 3v-2c0-1.1-.9-2-2-2s-2 .9-2 2v2l3 3 3-3v-2c0-1.1-.9-2-2-2s2-.9 2-2v-2l3-3h2l3 3v-2c0-1.1.9-2 2-2s2 .9 2 2v-2l3-3h2.01z"/>
        </svg>
      </button>
    </div>
  )
}

// Island selector component
export const IslandSelector = ({ island, onIslandChange }: { island: 'Unguja' | 'Pemba'; onIslandChange: (island: 'Unguja' | 'Pemba') => void }) => {
  return (
    <div className="island-selector bg-white rounded-2xl p-6 shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-navy mb-6">Select your island</h2>
      <div className="grid grid-cols-2 gap-3">
        {(['Unguja', 'Pemba'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onIslandChange(option)}
            aria-pressed={island === option}
            className={`w-full py-3 rounded-xl font-medium transition-all ${island === option ? 'bg-ocean-600 text-white' : 'bg-white text-ocean-800 border border-ocean-200'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

// Station selector component
export const StationSelector = ({ station, onStationChange, island }: { station: Station; onStationChange: (station: Station) => void; island: 'Unguja' | 'Pemba' }) => {
  const stations = getStationsByIsland(island)
  const stationName = station.island === 'Unguja' 
    ? station.id === 'malindi' ? 'Malindi' : station.id === 'nungwi' ? 'Nungwi' : 'Matemwe'
    : station.id === 'chake-chake' ? 'Chake Chake' : station.id === 'wete' ? 'Wete' : 'Mkoani'
  
  return (
    <div className="station-selector bg-white rounded-2xl p-6 shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-navy mb-4">{island === 'Unguja' ? 'Select Departure Station' : 'Chagua kituo cha kuanzia'}</h2>
      <p className="text-sm text-gray-600 mb-4">{stationName}</p>
      <div className="space-y-2">
        {stations.map((s) => (
          <button
            key={s.id}
            onClick={() => onStationChange(s)}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              s.id === station.id
                ? 'bg-ocean-50 text-ocean-700 border border-ocean-200'
                : 'bg-white text-ocean-800 border border-ocean-200 hover:bg-ocean-50 hover:text-ocean-700'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// Demo badge component
export const DemoBadge = () => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
      DEMO DATA
    </span>
  )
}