import React from 'react'
import { useTranslation } from '../hooks/usehooks'
import { DemoBadge } from '../components/basic-components'

export type { Language } from '../types/index'

export const LanguageSelection = () => {
  const { t } = useTranslation()

  const buttonClass = 'w-full py-3 rounded-xl font-medium transition-colors flex items-center gap-3'

  return (
    <div className="language-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-ocean-900 via-turquoise-50 to-ocean-100 p-4">
      <div className="language-card bg-white rounded-2xl p-8 w-full max-w-md shadow-lg text-center">
        <h2 className="text-3xl font-bold text-navy mb-6">{t('smartOcean')}</h2>
        
        <div className="mb-8">
          <button 
            onClick={() => localStorage.setItem('smartOcean.language', JSON.stringify({ code: 'sw', name: 'Kiswahili' }))}
            className={buttonClass}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 18h.01M8 6h8l.4 2h3l.4-2H8l.5-2zM12 2v2l3 3h1l-3 3v-2c0-1.1-.9-2-2-2s-2 .9-2 2v2L8 2v2l3 3H5l3 3v-2C3 12 2 13 2 15v2l3 3h2l3-3v-2c0-1.1-.9-2-2 2v2l3 3H12v-2l-3-3v-2z" />
            </svg>
            <span>{t('kiswahili')}</span>
          </button>
        </div>
        
        <div className="mb-8">
          <button
            onClick={() => localStorage.setItem('smartOcean.language', JSON.stringify({ code: 'en', name: 'English' }))}
            className={buttonClass}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 18h.01M8 6h8l.4 2h3l.4-2H8l.5-2zM12 2v2l3 3h1l-3 3v-2c0-1.1-.9-2-2-2s-2 .9-2 2v2L8 2v2l3 3H5l3 3v-2C3 12 2 13 2 15v2l3 3h2l3-3v-2c0-1.1-.9-2-2 2v2l3 3H12v-2l-3-3v-2z" />
            </svg>
            <span>{t('english')}</span>
          </button>
        </div>
        
        <DemoBadge />
        <p className="mt-6 text-center text-sm text-gray-500">{t('demoDataNote')}</p>
      </div>
    </div>
  )
}