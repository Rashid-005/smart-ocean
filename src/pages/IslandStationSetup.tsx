import React, { useState } from 'react'
import { useTranslation } from '../hooks/usehooks'
import { IslandSelector } from '../components/basic-components'
import { StationSelector } from '../components/basic-components'
import { DemoBadge } from '../components/basic-components'

export type { Language } from '../types/index'

export const IslandStationSetup = () => {
  const { t } = useTranslation()
  const [island, setIsland] = useState<'Unguja' | 'Pemba'>('Unguja')
  const [station, setStation] = useState<any>(UNGUJA_STATIONS[0])

  const handleIslandChange = (newIsland: 'Unguja' | 'Pemba') => {
    setIsland(newIsland)
  }

  return (
    <div className="island-setup-screen min-h-screen bg-gradient-to-b from-ocean-900 via-turquoise-50 to-ocean-100 flex items-center justify-center p-4">
      <div className="setup-card bg-white rounded-2xl p-8 w-full max-w-md shadow-lg text-center">
        <h2 className="text-3xl font-bold text-navy mb-6">{t('selectIsland')}</h2>
        
        <IslandSelector island={island} onIslandChange={handleIslandChange} />
        
        {island === 'Unguja' && (
          <StationSelector station={station} onStationChange={setStation} island="Unguja" />
        )}
        {island === 'Pemba' && (
          <StationSelector station={station} onStationChange={setStation} island="Pemba" />
        )}
        
        <DemoBadge />
        <button
          onClick={() => {}}
          className="mt-6 w-full py-3 rounded-xl font-medium bg-ocean-600 text-white transition-colors hover:bg-ocean-500"
        >
          {t('continue')}
        </button>
      </div>
    </div>
  )
}