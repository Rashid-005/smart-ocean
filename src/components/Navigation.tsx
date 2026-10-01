import { ReactNode } from 'react'
import { Home, MapPin, Layout, User, LogOut, Settings } from 'lucide-react'
import { useTranslation } from '../hooks/usehooks'

export type { Language } from '../types/index'

export const DesktopNavigation = ({ 
  currentRoute, 
  setCurrentRoute 
}: { 
  currentRoute: 'home' | 'map' | 'trips' | 'profile';
  setCurrentRoute: (route: 'home' | 'map' | 'trips' | 'profile') => void;
}) => {
  const { t } = useTranslation()
  
  const navigationItems = [
    { key: 'home', icon: Home, alt: t('home') },
    { key: 'map', icon: MapPin, alt: t('map') },
    { key: 'trips', icon: Layout, alt: t('trips') },
    { key: 'profile', icon: User, alt: t('profile') },
  ]

  return (
    <aside className="desktop-nav bg-white h-screen shadow-lg border-r border-ocean-100">
      <div className="nav-header p-6">
        <h2 className="text-lg font-bold text-navy">{t('smartOcean')}</h2>
      </div>
      <nav className="nav-links p-4">
        {navigationItems.map((item) => (
          <div
            key={item.key}
            className={`nav-link ${currentRoute === item.key ? 'active' : ''} transition-colors hover:text-ocean-600`}
            onClick={() => setCurrentRoute(item.key as 'home' | 'map' | 'trips' | 'profile')}
          >
            <item.icon className="w-5 h-5 mb-2" />
            <span className="text-xs block">{t(item.alt)}</span>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export const BottomNavigation = ({ 
  currentRoute, 
  setCurrentRoute 
}: { 
  currentRoute: 'home' | 'map' | 'trips' | 'profile';
  setCurrentRoute: (route: 'home' | 'map' | 'trips' | 'profile') => void;
}) => {
  const { t } = useTranslation()
  
  return (
    <nav className="bottom-navigation bg-white border-t border-ocean-100 shadow-lg position-fixed bottom-0 left-0 right-0">
      <div className="navigation-item home ${
        currentRoute === 'home' ? 'active' : ''
      }" onClick={() => setCurrentRoute('home')}>
        <Home className="w-6 h-6" />
        <span className="text-xs hidden md:block">{t('home')}</span>
        <span className="text-xs md:hidden">{t('nyumbani')}</span>
      </div>
      <div className="navigation-item map ${
        currentRoute === 'map' ? 'active' : ''
      }" onClick={() => setCurrentRoute('map')}>
        <MapPin className="w-6 h-6" />
        <span className="text-xs hidden md:block">{t('map')}</span>
        <span className="text-xs md:hidden">{t('ramani')}</span>
      </div>
      <div className="navigation-item trips ${
        currentRoute === 'trips' ? 'active' : ''
      }" onClick={() => setCurrentRoute('trips')}>
        <Layout className="w-6 h-6" />
        <span className="text-xs hidden md:block">{t('trips')}</span>
        <span className="text-xs md:hidden">{t('safari')}</span>
      </div>
      <div className="navigation-item profile ${
        currentRoute === 'profile' ? 'active' : ''
      }" onClick={() => setCurrentRoute('profile')}>
        <User className="w-6 h-6" />
        <span className="text-xs hidden md:block">{t('profile')}</span>
        <span className="text-xs md:hidden">{t('mipangilio')}</span>
      </div>
    </nav>
  )
}