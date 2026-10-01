import React from 'react'
import { FishingZone } from '../types/index'
import { DemoBadge } from './basic-components'
import { useTranslation } from '../hooks/usehooks'

export type { Language } from '../types/index'

export const ZoneDetails = ({ zone }: { zone: FishingZone | null }) => {
  const { t } = useTranslation()

  if (!zone) return null

  return (
    <div className="zone-details min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Zone header */}
        <div className="zone-header bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-navy">{zone.name}</h2>
          <p className="text-ocean-500">{zone.island}</p>
          <p className="text-sm text-gray-500">{t('kmAway')}: {zone.distanceKm}</p>
          <DemoBadge />
        </div>

        {/* Fish species chips */}
        <div className="mb-6">
          <h3 className="text font-medium text-navy mb-3">{t('species')}</h3>
          <div className="flex flex-wrap gap-2">
            {zone.species.map((species, idx) => (
              <span key={idx} className="species-chip">
                {species}
              </span>
            ))}
          </div>
        </div>

        {/* Environmental summary cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Sea Condition */}
          <div className="ocean-summary-card">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('seaCondition')}</h3>
            <p className="text-2xl font-bold text-ocean-600">{getSeaCondition(zone.waveHeight)}</p>
            <DemoBadge demoText={t('demo')} />
          </div>
          
          {/* Wind */}
          <div className="ocean-summary-card">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('wind')}</h3>
            <p className="text-2xl font-bold text-ocean-600">{zone.windSpeed} km/h</p>
            <DemoBadge demoText={t('demo')} />
          </div>
          
          {/* Water Temperature */}
          <div className="ocean-summary-card">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Water Temperature</h3>
            <p className="text-2xl font-bold text-ocean-600">{zone.waterTemperature}°C</p>
            <DemoBadge demoText={t('demo')} />
          </div>
          
          {/* Visibility */}
          <div className="ocean-summary-card">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('visibilityLabel')}</h3>
            <p className="text-2xl font-bold text-ocean-600">{zone.visibility} km</p>
            <DemoBadge demoText={t('demo')} />
          </div>
        </div>

        {/* Distance card */}
        <div className="ocean-summary-card mt-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('distance')}</h3>
          <p className="text-2xl font-bold text-navy">{zone.distanceKm} km</p>
          <DemoBadge demoText={t('demo')} />
        </div>

        {/* Safety Checklist */}
        <div className="mt-8">
          <h3 className="text font-medium text-navy mb-4">{t('safetyChecklist')}</h3>
          <div className="space-y-2">
            {zone.safetyChecklist.map((item, idx) => (
              <div key={idx} className="flex items-start items-baseline gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                  aria-label={item}
                />
                <span className="text-ocean-800 flex-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="mt-8">
          <button
            className="w-full py-3 rounded-xl font-medium bg-ocean-600 text-white transition-colors hover:bg-ocean-500"
          >
            {t('startTrip')}
          </button>
        </div>
      </div>
    </div>
  )
}

const getSeaCondition = (waveHeight: number) => {
  if (waveHeight <= 1) return 'Calm'
  if (waveHeight <= 2) return 'Moderate'
  if (waveHeight <= 3) return 'Rough'
  return 'Very Rough'
}