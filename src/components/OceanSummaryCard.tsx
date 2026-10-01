import type { ReactNode } from 'react'
import { DemoBadge } from './basic-components'

export type { Language } from '../types/index'

// Ocean summary card
export const OceanSummaryCard = ({ title, value, icon, demoText }: { title: string; value: string; icon: ReactNode; demoText?: string }) => {
  return (
    <div className="ocean-summary-card bg-white rounded-2xl p-5 shadow-sm border-t-4 border-ocean">
      <div className="flex items-start justify-between">
        <div className="summary-card-copy">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
          <p className="text-2xl font-bold text-navy mt-1">{value}</p>
        </div>
        <span className="summary-card-icon" aria-hidden="true">{icon}</span>
        {demoText ? <DemoBadge /> : null}
      </div>
      {demoText ? <p className="summary-card-note">{demoText}</p> : null}
    </div>
  )
}

// Safety card
export const SafetyCard = ({ 
  title, 
  items,
  checkedItems,
  onItemChange,
  disabledStart,
  onCompleteText,
  onComplete,
}: {
  title: string;
  items: string[];
  checkedItems: boolean[];
  onItemChange: (index: number) => void;
  disabledStart: boolean;
  onCompleteText: string;
  onComplete: () => void;
}) => {
  return (
    <div className="safety-card bg-white rounded-2xl p-6 shadow-lg border-2 border-ocean-200">
      <h2 className="text-xl font-bold text-navy mb-6">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start items-baseline gap-3">
            <input
              type="checkbox"
              checked={checkedItems[index] ?? false}
              onChange={() => onItemChange(index)}
              className="w-5 h-5 rounded border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
              aria-label={`${item}`}
            />
            <span className="text-ocean-800 flex-1">
              {item}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-ocean-100">
        <button
          onClick={onComplete}
          disabled={disabledStart}
          className={`w-full py-3 rounded-xl font-medium transition-colors ${
            disabledStart ? 'opacity-50 cursor-not-allowed' : 'bg-ocean-600 text-white'
          }`}
        >
          {disabledStart ? onCompleteText : onCompleteText}
        </button>
      </div>
    </div>
  )
}