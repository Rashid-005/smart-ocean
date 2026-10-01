import React, { useState } from 'react'
import { useTranslation } from '../hooks/usehooks'
import { DemoBadge } from '../components/basic-components'

export type { Language } from '../types/index'

export const Welcome = () => {
  const { t, switchLanguage } = useTranslation()
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  const languageClass = showLanguageSelector
    ? 'bg-white text-navy hover:bg-ocean-50 focus:outline-none focus:ring-2 focus:ring-ocean-300'
    : ''

  return (
    <div className="welcome-screen min-h-screen bg-gradient-to-b from-ocean-900 via-turquoise-50 to-ocean-100 flex items-center justify-center p-4">
      <div className="welcome-content max-w-md w-full text-center">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-2">{t('welcome')}</h1>
          <p className="text-2xl text-ocean-500">{t('tagline')}</p>
        </div>

        {/* Tagline */}
        <p className="text-ocean-600 text-lg mb-8">{t('bahariYetuMaishaYetu') || 'Bahari Yetu, Maisha Yetu'}</p>

        {/* Language selector */}
        <div className="mb-8">
          <button onClick={() => setShowLanguageSelector(true)} className={languageClass}>
            {t('chooseLanguage')}
          </button>
        </div>

        {/* Demo button */}
        <button 
          onClick={() => setShowLanguageSelector(true)} 
          className="w-full py-4 rounded-xl font-bold bg-ocean-600 text-white transition-colors hover:bg-ocean-500 shadow-lg"
        >
          {t('getStarted')}
        </button>
      </div>

      {/* Language selector overlay */}
      {showLanguageSelector && (
        <div className="language-overlay fixed inset-0 bg-black/50 backdrop-blur-zulius z-50 flex items-center justify-center">
          <div className="language-selector-card bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform scale-95 opacity-0 transition-all" 
               onClick={(e: any) => e.stopPropagation()}
            >
            <button
              onClick={() => setShowLanguageSelector(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-navy mb-6">{t('selectLanguage')}</h2>
            <div className="space-y-4 mb-8">
              <button
                onClick={() => {
                  setShowLanguageSelector(false)
                  localStorage.setItem('smartOcean.language', JSON.stringify({ code: 'sw', name: 'Kiswahili' }))
                }}
                className="w-full py-3 rounded-xl font-medium transition-colors flex items-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 18h.01M8 6h8l.4 2h3l.4-2H8l.5-2zM12 2v2l3 3h1l-3 3v-2c0-1.1-.9-2-2-2s-2 .9-2 2v2L8 2v2l3 3H5l3 3v-2C3 12 2 13 2 15v2l3 3h2l3-3v-2c0-1.1-.9-2-2 2v2l3 3H12v-2l-3-3v-2z" />
                </svg>
                <span>{t('kiswahili')}</span>
              </button>
              <button
                onClick={() => {
                  setShowLanguageSelector(false)
                  localStorage.setItem('smartOcean.language', JSON.stringify({ code: 'en', name: 'English' }))
                }}
                className="w-full py-3 rounded-xl font-medium transition-colors flex items-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 18h.01M8 6h8l.4 2h3l.4-2H8l.5-2zM12 2v2l3 3h1l-3 3v-2c0-1.1-.9-2-2-2s-2 .9-2 2v2L8 2v2l3 3H5l3 3v-2C3 12 2 13 2 15v2l3 3h2l3-3v-2c0-1.1-.9-2-2 2v2l3 3H12v-2l-3-3v-2z" />
                </svg>
                <span>{t('english')}</span>
              </button>
            </div>
            <p className="text-center text-sm text-gray-500">{t('demoDataNote')}</p>
          </div>
        </div>
      )}
    </div>
  )
}