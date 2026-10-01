import type { FishingZone, Language } from '../types/index'
import { getTranslation } from '../lib/translations'

export type { Language } from '../types/index'

interface ZoneBottomSheetProps {
  zone: FishingZone | null
  isOpen: boolean
  onClose: () => void
  onViewZone: () => void
  language: Language
}

export const ZoneBottomSheet = ({
  zone,
  isOpen,
  onClose,
  onViewZone,
  language,
}: ZoneBottomSheetProps) => {
  if (!zone || !isOpen) return null

  const suitabilityText = {
    high: getTranslation('higherSuitability', language),
    moderate: getTranslation('moderateSuitability', language),
    low: getTranslation('lowerSuitability', language),
  }[zone.suitability]

  return (
    <div className="zone-sheet-backdrop" onMouseDown={onClose}>
      <section className="zone-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="zone-sheet-title" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} className="icon-button sheet-close" aria-label={getTranslation('close', language)}>×</button>
        <span className="eyebrow">{getTranslation('demoDataBadge', language)}</span>
        <h3 id="zone-sheet-title">{zone.name}</h3>
        <p>{zone.distanceKm} km · {zone.island}</p>
        <span className={`suitability-chip suitability-${zone.suitability}`}>{suitabilityText}</span>
        <div className="species-list">{zone.species.map((species) => <span key={species} className="species-chip">{species}</span>)}</div>
        <p>{getTranslation('seaCondition', language)}: {getTranslation('moderate', language)} · {getTranslation('demoShort', language)}</p>
        <button
          type="button"
          onClick={onViewZone}
          className="button button-primary"
        >
          {getTranslation('viewZone', language)}
        </button>
      </section>
    </div>
  )
}