import React from 'react'
import { ZoneDetails } from '../components/ZoneDetails'
import { FISHING_ZONES, getZonesByIsland } from '../data/fishingZones'
import { useTranslation } from '../hooks/usehooks'
import { useIsland } from '../hooks/usehooks'
import { DemoBadge } from '../components/basic-components'

export type { Language } from '../types/index'

export const ZoneDetailsPage = () => {
  const { t } = useTranslation()
  const { island } = useIsland()
  const zones = getZonesByIsland(island)
  const [selectedZone, setSelectedZone] = React.useState<any>(zones[0])

  return (
    <div className="zone-details-page min-h-screen bg-gray-50">
      <ZoneDetails zone={selectedZone} />
    </div>
  )
}