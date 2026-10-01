import React from 'react'
import { TripRecord, CatchRecord } from '../types/index'

export type { Language } from '../types/index'

export const TripCard = ({ trip }: { trip: TripRecord }) => {
  const totalWeight = trip.catches?.reduce((sum, catch) => sum + catch.weightKg, 0) || 0
  const speciesList = trip.catches?.map(c => c.species).join(' · ') || '-'

  return (
    <div className="trip-card bg-white rounded-2xl p-6 shadow-sm border-b-4 border-ocean-100 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-navy">{trip.destination}</h3>
          <p className="text-sm text-gray-500">{trip.island}</p>
        </div>
        <p className="text-sm text-gray-500">{new Date(trip.startTime).toLocaleDateString()}</p>
      </div>
      <p className="text-sm text-gray-500 mt-1">{trip.departure}</p>
      <div className="mt-3 p-3 rounded-xl bg-ocean-50">
        <p className="text-xs text-gray-500">{t('totalCatch')}</p>
        <p className="text-xl font-bold text-ocean">{totalWeight.toFixed(1)} kg</p>
      </div>
      <div className="mt-3">
        <p className="text-xs text-gray-400">{t('catch')}: {speciesList}</p>
      </div>
    </div>
  )
}

export const ActiveTripCard = ({ trip, onEndTrip, onRecordCatch }: { trip: TripRecord; onEndTrip: () => void; onRecordCatch: () => void }) => {
  const totalWeight = trip.catches?.reduce((sum, catch) => sum + catch.weightKg, 0) || 0
  const catchCount = trip.catches?.length || 0

  return (
    <div className="active-trip-card bg-white rounded-2xl p-6 shadow-lg border-border-4 border-ocean-100">
      <h2 className="text-xl font-bold text-navy mb-4">{trip.destination}</h2>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-ocean-500 text-sm">{trip.departure}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3h14v2H5V3zm0 6h14v2H5V9zm0 6h14v2H5v-2z" />
        </svg>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-500">{t('distance')}: {trip.distanceKm} km</p>
        <p className="text-lg font-medium">{trip.status === 'active' ? t('inProgress') : 'Completed'}</p>
      </div>
      <div className="mb-4">
        <p className="text-ocean-600 font-medium">{t('catchCount', { 0: '0', 1: '1 catch', _: '{0} catches' })}: {catchCount}</p>
        <p className="text-xl font-bold text-ocean">{totalWeight.toFixed(1)} kg</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRecordCatch}
          className="flex-1 py-2 rounded-xl font-medium bg-ocean-50 text-ocean-600 border border-ocean-200 hover:bg-ocean-600 hover:text-white transition-colors"
        >
          {t('recordCatch')}
        </button>
        <button
          onClick={onEndTrip}
          className="flex-1 py-2 rounded-xl font-medium bg-white text-ocean-600 border border-ocean-300 hover:bg-ocean-50 hover:text-ocean-800 transition-colors"
        >
          {t('endTrip')}
        </button>
      </div>
    </div>
  )
}

export const CatchForm = ({ onSaveCatch }: { onSaveCatch: (catchData: any) => void }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    species: '',
    weight: '',
    date: new Date().toISOString().split('T')[0],
    zone: '',
    notes: '',
    photoPreview: null,
  })

  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, files } = e.target
    setFormData({ ...formData, [name]: type === 'number' ? parseFloat(value) : value })
  }

  const handlePhotoChange = (e: React.ChangeEvent<any>) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, photoPreview: URL.createObjectURL(file) })
      setPhotoUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.species) {
      alert(t('fishSpecies'))
      return
    }
    
    if (!formData.weight || formData.weight <= 0) {
      alert(t('weightValidation'))
      return
    }

    if (!formData.date) {
      alert(t('date'))
      return
    }

    onSaveCatch({
      ...formData,
      id: Date.now().toString(),
      photoUrl,
    })

    setFormData({
      species: '',
      weight: '',
      date: new Date().toISOString().split('T')[0],
      zone: '',
      notes: '',
      photoPreview: null,
    })
    setPhotoUrl(null)
  }

  return (
    <div className="catch-form bg-white rounded-2xl p-6 shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-navy mb-6">{t('recordCatch')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-2">{t('fishSpecies')}</label>
          <select
            value={formData.species}
            onChange={handleChange}
            name="species"
            className={`
              w-full py-2 rounded-lg border border-ocean-200 text-ocean-800 
              transition-colors focus:outline-none focus:border-ocean-400
            `}
          >
            <option value={} disabled>{t('selectSpecies')}</option>
            <option value="Tuna">{t('tuna')}</option>
            <option value="Snapper">{t('snapper')}</option>
            <option value="Kingfish">{t('kingfish')}</option>
            <option value="Grouper">{t('grouper')}</option>
            <option value="Other">{t('other')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-2">{t('weight')}</label>
          <input
            type="number"
            value={formData.weight || ''}
            onChange={handleChange}
            name="weight"
            placeholder="0"
            className={`
              w-full py-2 rounded-lg border border-ocean-200 text-ocean-800 
              transition-colors focus:outline-none focus:border-ocean-400
            `}
            min="0"
            step="0.1"
          />
          <p className="text-xs text-gray-500">{t('kg')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-2">{t('date')}</label>
          <input
            type="date"
            value={formData.date}
            onChange={handleChange}
            name="date"
            className={`
              w-full py-2 rounded-lg border border-ocean-200 text-ocean-800 
              transition-colors focus:outline-none focus:border-ocean-400
            `}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-2">{t('fishingZone')}</label>
          <p className="text-sm text-gray-500">{t('autoPopulatedFromDestination')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-2">{t('optionalPhoto')}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <button
            className="w-full py-2 rounded-lg border border-ocean-200 text-ocean-600 hover:bg-ocean-50 transition-colors cursor-pointer"
          >
            {t('addPhoto')}
          </button>
          {formData.photoPreview && (
            <img
              src={formData.photoPreview}
              alt="Catch photo preview"
              className="mt-3 w-full h-40 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-2">{t('notes')}</label>
          <textarea
            value={formData.notes || ''}
            onChange={handleChange}
            name="notes"
            placeholder={t('addNotes')}
            className={`
              w-full py-2 rounded-lg border border-ocean-200 text-ocean-800 resize-none 
              transition-colors focus:outline-none focus:border-ocean-400
              min-h-[80px]
            `}
          /></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-medium bg-ocean-600 text-white transition-colors hover:bg-ocean-500"
        >
          {t('saveCatch')}
        </button>
      </form>
    </div>
  )
}

export const CatchCard = ({ catch: catchRecord }: { catch: CatchRecord }) => {
  return (
    <div className="catch-card bg-white rounded-xl p-4 shadow-sm border border-ocean-100">
      <div className="flex items-center justify-between">
        <span className="font-medium text-ocean-800">{catchRecord.species}</span>
        <span className="text-xl font-bold text-ocean">{catchRecord.weightKg} kg</span>
      </div>
      <p className="text-xs text-gray-500">{catchRecord.date}</p>
    </div>
  )
}

export const EmptyState = ({ 
  title, 
  description, 
  buttonText, 
  onButtonClick 
}: {
  title: string
  description: string
  buttonText: string
  onButtonClick: () => void
}) => {
  return (
    <div className="empty-state text-center py-12">
      <h3 className="text-2xl font-bold text-navy mb-3">{title}</h3>
      <p className="text-lg text-gray-500 mb-6">{description}</p>
      <button
        onClick={onButtonClick}
        className="py-3 rounded-xl font-medium bg-ocean-600 text-white transition-colors hover:bg-ocean-500"
      >
        {buttonText}
      </button>
    </div>
  )
}