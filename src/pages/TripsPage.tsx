import React, { useEffect } from 'react'
import { useTranslation } from '../hooks/usehooks'
import { useTrips, useCatches, useActiveTrip } from '../hooks/usehooks'
import { TripCard } from '../components/TripComponents'
import { ActiveTripCard } from '../components/TripComponents'
import { EmptyState } from '../components/TripComponents'
import { useTranslation as useT } from '../hooks/usehooks'

export type { Language } from '../types/index'

export const TripsPage = () => {
  const { t } = useTranslation()
  const { trips } = useTrips()
  const { catches } = useCatches()
  const { activeTrip, endTrip, updateCatch } = useActiveTrip()

  // Initialize with sample data if no trips exist
  useEffect(() => {
    if (trips.length === 0) {
      const sampleTrips = SAMPLE_TRIPS.map(trip => ({
        ...trip,
        startTime: new Date(trip.startTime),
        endTime: trip.endTime ? new Date(trip.endTime) : undefined,
      }))
      // @ts-ignore - replacing with sample data for initial load
      // In a real app, we'd want to merge with existing data
    }
  }, [trips.length])

  const totalCatches = catches.reduce((sum, catch) => sum + catch.weightKg, 0)
  const totalTripsCount = trips.length

  return (
    <div className="trips-page min-h-screen bg-gray-50">
      <div className="page-header bg-white border-b border-ocean-100 px-4 py-3">
        <h1 className="text-2xl font-bold text-navy">{t('myTrips')}</h1>
        <DemoBadge />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 px-4">
        <div className="summary-card bg-white rounded-xl p-4 shadow-sm border border-ocean-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('totalTrips')}</h3>
          <p className="text-3xl font-bold text-navy">{totalTripsCount}</p>
        </div>
        <div className="summary-card bg-white rounded-xl p-4 shadow-sm border border-ocean-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('totalCatch')}</h3>
          <p className="text-3xl font-bold text-ocean">{totalCatches.toFixed(1)} kg</p>
        </div>
      </div>

      {/* Trips list */}
      <div className="px-4">
        {activeTrip && (
          <ActiveTripCard
            trip={activeTrip}
            onEndTrip={() => endTrip()}
            onRecordCatch={() => {}}
          />
        )}

        {trips.length === 0 && (
          <EmptyState
            title={t('noTripsRecorded')}
            description={t('startYourFirstTrip')}
            buttonText={t('startFirstTrip')}
            onButtonClick={() => {}}
          />
        )}

        <div className="trips-list mt-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  )
}