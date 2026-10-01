import React from 'react'
import { FishingMap } from '../components/FishingMap'
import { useTranslation } from '../hooks/usehooks'
import { useIsland } from '../hooks/usehooks'
import { DemoBadge } from '../components/basic-components'

export type { Language } from '../types/index'

export const FishingMapPage = () => {
  const { t } = useTranslation()
  const { island } = useIsland()
  const [selectedZone, setSelectedZone] = React.useState<any>(undefined)

  return (
    <div className="fishing-map-page min-h-screen bg-gray-50">
      <div className="page-header bg-white border-b border-ocean-100 px-4 py-3">
        <h1 className="text-2xl font-bold text-navy">{t('fishingZones')}</h1>
        <DemoBadge />
      </div>
      
      <div className="p-4">
        <FishingMap 
          island={island} 
          onZoneSelect={(zone) => setSelectedZone(zone)}
          selectedZone={selectedZone}
        />
      </div>
      
      {selectedZone && (
        <div className="zone-bottom-sheet">
          {/* Simplified bottom sheet */}
          <h3 className="text-xl font-bold text-navy mb-2">{selectedZone.name}</h3>
          <p className="text-ocean-600 mb-2">{t('kmAway')}: {selectedZone.distanceKm}</p>
          <p className="text-sm text-gray-500">{selectedZone.island}</p>
          <button className="mt-4 w-full py-2 rounded-xl font-medium bg-ocean-600 text-white transition-colors">
            {t('viewZone')}
          </button>
        </div>
      )}
    </div>
  )
}