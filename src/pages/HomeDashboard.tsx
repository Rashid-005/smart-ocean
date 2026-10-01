import React from 'react'
import { useTranslation } from '../hooks/usehooks'
import { useIsland, useStation } from '../hooks/usehooks'
import { OceanSummaryCard } from '../components/OceanSummaryCard'
import { SafetyCard } from '../components/basic-components'
import { DemoBadge } from '../components/basic-components'
import { LanguageSelector } from '../components/basic-components'
import { BottomNavigation } from '../components/Navigation'

export type { Language } from '../types/index'

export const HomeDashboard = () => {
  const { t, switchLanguage } = useTranslation()
  const { island, updateIsland } = useIsland()
  const { station, updateStation } = useStation()

  // Update station when island changes
  useEffect(() => {
    if (island === 'Unguja') {
      updateStation(UNGUJA_STATIONS[0])
    } else {
      updateStation(PEMBA_STATIONS[0])
    }
  }, [island, updateStation])

  const islandStation = `${island} · ${station.name}`

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageSelector currentLanguage={{ code: 'sw', name: 'Kiswahili' }} onLanguageChange={switchLanguage} />
      
      <div className="dashboard-container min-h-screen">
        {/* Header */}
        <header className="dashboard-header bg-white border-b border-ocean-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-navy">{t('home')}</h1>
            <LanguageSelector currentLanguage={{ code: 'sw', name: 'Kiswahili' }} onLanguageChange={switchLanguage} />
          </div>
        </header>

        {/* Main content */}
        <main className="dashboard-main px-4 pb-6">
          {/* Greeting and island/station */}
          <div className="mb-6">
            <p className="text-ocean-500 text-lg font-medium">{t('greeting')}</p>
            <p className="text-3xl font-bold text-navy mt-1">{t('islandStation', { island: island, station: station.name })}</p>
            <DemoBadge />
          </div>

          {/* Ocean summary cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <OceanSummaryCard title={t('seaCondition')} value={t('moderate')} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7v6l4 2v6h6l-4 2v-6h4l-4-2V7z" /></svg> } />
            <OceanSummaryCard title={t('wind')} value={t('twelveKmH')} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17 2H5c-1.1 0-2 .9-2 2v4h10V4zm1 3h-4v15l4-1 4 1V5z" /></svg> } />
            <OceanSummaryCard title={t('visibility')} value={t('good')} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> } />
            <OceanSummaryCard title={t('distance')} value={t('eightPointFourKm')} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polyline points="3 6 5 6 21 6" /></svg> } />
          </div>

          {/* Safety card */}
          <SafetyCard
            title={t('safetyFirst')}
            items={[
              t('checkWeather'),
              t('lifeJackets'),
              t('drinkingWater'),
              t('checkFuel'),
              t('tellSomeone'),
            ]}
            onItemChange={() => {}}
            isComplete={false}
            disabledStart={true}
            onCompleteText={t('startTrip')}
          />

          {/* Quick actions */}
          <div className="quick-actions mt-6">
            <h3 className="text-ocean-600 font-medium mb-4">{t('quickActions')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="action-item bg-white rounded-xl p-4 shadow-sm border border-ocean-200 hover:bg-ocean-50 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-3"/>
                {t('fishingMap')}
                <span className="text-ocean-500 font-medium">Map</span>
              </button>
              <button className="action-item bg-white rounded-xl p-4 shadow-sm border border-ocean-200 hover:bg-ocean-50 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-3"/>
                {t('trips')}
                <span className="text-ocean-500 font-medium">Trips</span>
              </button>
            </div>
          </div>
        </main>

        {/* Bottom navigation */}
        <BottomNavigation currentRoute="home" setCurrentRoute={(route) => {}} />
      </div>
    </div>
  )
}