import type { FishingZone, Language } from '../types/index'
import { getTranslation } from '../lib/translations'

export type { Language } from '../types/index'

interface SafetyChecklistProps {
  zone: FishingZone
  language: Language
  checkedItems: boolean[]
  onItemChange: (index: number) => void
  onStartTrip: () => void
  disabled: boolean
}

export const SafetyChecklist = ({ zone, language, checkedItems, onItemChange, onStartTrip, disabled }: SafetyChecklistProps) => {
  const items = [
    getTranslation('lifeJacket', language),
    getTranslation('fuelChecked', language),
    getTranslation('drinkingWaterPacked', language),
    getTranslation('weatherChecked', language),
    getTranslation('destinationShared', language),
  ]

  return (
    <section className="safety-checklist panel">
      <h2>{getTranslation('safetyChecklist', language)}</h2>
      <p className="muted">{zone.name} · {getTranslation('demoShort', language)}</p>
      <div className="checklist-items">
        {items.map((item, idx) => (
          <label key={item} className="checklist-item">
            <input
              type="checkbox"
              checked={checkedItems[idx] ?? false}
              onChange={() => onItemChange(idx)}
              aria-label={item.label}
            />
            <span>
              {item.label}
            </span>
          </label>
        ))}
      </div>
      <div className="checklist-footer">
        {disabled ? <p className="form-hint">{getTranslation('completeChecklist', language)}</p> : null}
        <button
          type="button"
          onClick={onStartTrip}
          disabled={disabled}
          className="button button-primary"
        >
          {getTranslation('startTrip', language)}
        </button>
      </div>
    </section>
  )
}