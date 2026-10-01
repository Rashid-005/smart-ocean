import React, { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { FishingZone } from '../types/index'
import { FISHING_ZONES, getZonesByIsland } from '../data/fishingZones'
import type { Language } from '../types/index'
import 'leaflet/dist/leaflet.css'

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const zoneIcon = (suitability: FishingZone['suitability']) => L.divIcon({
  className: `zone-marker zone-marker-${suitability}`,
  html: '<span aria-hidden="true"></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

function RecenterMap({ island }: { island: 'Unguja' | 'Pemba' }) {
  const map = useMap()

  useEffect(() => {
    map.setView(island === 'Unguja' ? [6.16, 39.25] : [5.5, 39.8], island === 'Unguja' ? 10 : 9)
  }, [island, map])

  return null
}

export const FishingMap = ({ island, onZoneSelect, selectedZone, language }: { island: 'Unguja' | 'Pemba'; onZoneSelect: (zone: FishingZone) => void; selectedZone?: FishingZone; language: Language }) => {
  const zones = getZonesByIsland(island)

  return (
    <div className="fishing-map">
      <MapContainer
        center={island === 'Unguja' ? [6.16, 39.25] : [5.5, 39.8]}
        zoom={island === 'Unguja' ? 10 : 9}
        className="w-full h-full"
        scrollWheelZoom={false}
      >
        <RecenterMap island={island} />
        <TileLayer
          attribution={attribution}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {zones.map((zone) => (
          <Marker
            key={zone.id}
            position={[zone.latitude, zone.longitude]}
            icon={zoneIcon(zone.suitability)}
            riseOnHover
            eventHandlers={{ click: () => onZoneSelect(zone) }}
          >
            <Popup>
              <strong>{zone.name}</strong>
              <p>{zone.distanceKm} km · {getTranslation('suitability', language)}: {getTranslation(`suitability-${zone.suitability}`, language)}</p>
              <button type="button" onClick={() => onZoneSelect(zone)}>{getTranslation('viewZone', language)}</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-square suitability-high" aria-hidden="true" />
          <span>{getTranslation('higherSuitability', language)}</span>
        </div>
        <div className="legend-item">
          <span className="legend-square suitability-moderate" aria-hidden="true" />
          <span>{getTranslation('moderateSuitability', language)}</span>
        </div>
        <div className="legend-item">
          <span className="legend-square suitability-low" aria-hidden="true" />
          <span>{getTranslation('lowerSuitability', language)}</span>
        </div>
      </div>
      <div className="map-note">
        <span className="demo-badge">{getTranslation('demoDataBadge', language)}</span>
        {getTranslation('demoDataNote', language)}
      </div>
    </div>
  )
}