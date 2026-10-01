import { lazy, Suspense, useEffect, useMemo, useState, type FormEvent, type ReactNode, type ChangeEvent } from 'react'
import {
  Anchor, ArrowLeft, ArrowRight, Bell, Check, ChevronRight, CircleHelp,
  ClipboardList, Clock3, Compass, Eye, EyeOff, Fish, House, LogOut, Map as MapIcon,
  MapPin, Menu, Navigation, Phone, Plus, ShieldCheck, Thermometer, UserRound,
  Waves, Wind, X,
  type LucideIcon,
} from 'lucide-react'
import L from 'leaflet'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './SmartOcean.css'
import { FISHING_ZONES, getZonesByIsland } from './data/fishingZones'
import { getFishingAreas, type FishingArea } from './data/fishingAreas'
import { getStationsByIsland } from './data/stations'
import { SAMPLE_CATCHES, SAMPLE_TRIPS } from './data/demoTrips'
import { translate } from './lib/i18n'
import { loadAppState, saveAppState } from './lib/storage'
import type { ModuleId } from './modules/DemoModules'
import type { AppState, CatchRecord, FishingZone, Language, TripRecord } from './types/index'

type DemoAccount = { name: string; phone: string }
type DemoCredential = DemoAccount & { phoneKey: string; passwordHash: string }
type Notice = { text: string; error?: boolean }
type NavId = 'home' | 'safety' | 'prediction' | 'map' | 'bestTime' | 'plan' | 'tripRecords' | 'catchRecords' | 'weather' | 'markets' | 'buyers' | 'prices' | 'sales' | 'reports' | 'history' | 'analysis' | 'notifications' | 'profile' | 'settings' | 'help'
type NavItem = { to: string; key: string; id: NavId; icon: LucideIcon }
const LazyDemoModulePage = lazy(async () => {
  const module = await import('./modules/DemoModules')
  return { default: module.DemoModulePage }
})

const NAV_GROUPS: { key: string; items: NavItem[] }[] = [
  { key: 'navDaily', items: [
    { to: '/home', key: 'dashboard', id: 'home', icon: House },
    { to: '/safety', key: 'seaSafety', id: 'safety', icon: ShieldCheck },
    { to: '/prediction', key: 'fishPrediction', id: 'prediction', icon: Fish },
    { to: '/map', key: 'map', id: 'map', icon: MapIcon },
    { to: '/best-time', key: 'bestTime', id: 'bestTime', icon: Clock3 },
  ] },
  { key: 'navFishing', items: [
    { to: '/plan-trip', key: 'planTrip', id: 'plan', icon: Anchor },
    { to: '/trips', key: 'tripRecords', id: 'tripRecords', icon: ClipboardList },
    { to: '/catches', key: 'catchRecords', id: 'catchRecords', icon: Fish },
    { to: '/weather', key: 'weatherSea', id: 'weather', icon: Waves },
  ] },
  { key: 'navMarket', items: [
    { to: '/markets', key: 'fishMarkets', id: 'markets', icon: MapPin },
    { to: '/buyers', key: 'buyerLocations', id: 'buyers', icon: UserRound },
    { to: '/prices', key: 'buyersPrices', id: 'prices', icon: Navigation },
    { to: '/sales', key: 'salesRecords', id: 'sales', icon: Check },
  ] },
  { key: 'navData', items: [
    { to: '/reports', key: 'fishingReports', id: 'reports', icon: Compass },
    { to: '/history', key: 'tripHistory', id: 'history', icon: Clock3 },
    { to: '/forecast-analysis', key: 'forecastAnalysis', id: 'analysis', icon: Eye },
    { to: '/notifications', key: 'notifications', id: 'notifications', icon: Bell },
  ] },
  { key: 'navAccount', items: [
    { to: '/profile', key: 'fisherProfile', id: 'profile', icon: UserRound },
    { to: '/settings', key: 'settings', id: 'settings', icon: Compass },
    { to: '/help', key: 'help', id: 'help', icon: CircleHelp },
  ] },
]

const lang = (code: Language['code']): Language => ({ code, name: code === 'sw' ? 'Kiswahili' : 'English' })
const say = (language: Language, key: string) => translate(language, key)

function readAccount(key: string): DemoAccount | null {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as DemoAccount : null } catch { return null }
}

function readCredentials(): DemoCredential[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('smartOcean.demoCredentials') ?? '[]')
    return Array.isArray(value) ? value as DemoCredential[] : []
  } catch { return [] }
}

async function hashPassword(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function initialState(): AppState {
  const state = loadAppState()
  try { return localStorage.getItem('smartOcean.trips') ? state : { ...state, trips: SAMPLE_TRIPS, catches: SAMPLE_CATCHES } }
  catch { return { ...state, trips: SAMPLE_TRIPS, catches: SAMPLE_CATCHES } }
}

function zoneTitle(zone: FishingZone, language: Language): string {
  if (language.code !== 'sw') return zone.name
  const names: Record<string, string> = {
    'zone-a': 'Miamba ya Kaskazini', 'zone-b': 'Ufukwe wa Mashariki',
    'zone-c': 'Mkondo wa Kusini', 'zone-d': 'Mkondo wa Pemba', 'zone-e': 'Miamba ya Magharibi',
  }
  return names[zone.id] ?? zone.name
}

function localizedFish(species: string, language: Language): string {
  const keys: Record<string, string> = { tuna: 'tuna', snapper: 'snapper', kingfish: 'kingfish', grouper: 'grouper', other: 'other' }
  return say(language, keys[species.toLowerCase()] ?? species)
}

function weightOf(trip: TripRecord): number {
  return (trip.catches ?? []).reduce((total, record) => total + record.weightKg, 0)
}

function dateLabel(value: string | Date, language: Language, time = false): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(language.code === 'sw' ? 'sw-TZ' : 'en-TZ', {
    day: 'numeric', month: 'short', year: 'numeric', ...(time ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date)
}

function App() {
  return <BrowserRouter><Controller /></BrowserRouter>
}

function Controller() {
  const [model, setModel] = useState<AppState>(initialState)
  const [account, setAccount] = useState<DemoAccount | null>(() => readAccount('smartOcean.session'))
  const [notice, setNotice] = useState<Notice | null>(null)
  const navigate = useNavigate()
  const t = (key: string) => say(model.language, key)

  useEffect(() => { saveAppState(model) }, [model])
  useEffect(() => { document.documentElement.lang = model.language.code }, [model.language])

  const tell = (text: string, error = false) => {
    setNotice({ text, error })
    window.setTimeout(() => setNotice(null), 3200)
  }

  const setLocation = (island: AppState['island'], stationId?: string) => {
    const stations = getStationsByIsland(island)
    const station = stations.find((item) => item.id === stationId) ?? stations[0]
    setModel((current) => ({ ...current, island, station }))
  }

  const signIn = async (user: DemoAccount, password: string, mode: 'login' | 'register', island: AppState['island'], stationId: string): Promise<string | undefined> => {
    if (!crypto.subtle) return t('localStorageUnavailable')
    const phoneKey = user.phone.replace(/\D/g, '')
    const credentials = readCredentials()
    let authenticated = user
    if (mode === 'register') {
      if (credentials.some((credential) => credential.phoneKey === phoneKey)) return t('accountExists')
      credentials.push({ ...user, phoneKey, passwordHash: await hashPassword(password) })
      try { localStorage.setItem('smartOcean.demoCredentials', JSON.stringify(credentials)) }
      catch { return t('localStorageUnavailable') }
      setLocation(island, stationId)
    } else {
      const existing = credentials.find((credential) => credential.phoneKey === phoneKey)
      if (!existing || existing.passwordHash !== await hashPassword(password)) return t('invalidLogin')
      authenticated = { name: existing.name, phone: existing.phone }
    }
    try {
      localStorage.setItem('smartOcean.session', JSON.stringify(authenticated))
      localStorage.setItem('smartOcean.account', JSON.stringify(authenticated))
    } catch { /* In-memory demo session remains available without storage. */ }
    setAccount(authenticated)
    navigate('/home')
  }

  const signOut = () => {
    try { localStorage.removeItem('smartOcean.session') } catch { /* Storage may be unavailable. */ }
    setAccount(null)
    navigate('/login')
  }

  const startTrip = (zone: FishingZone) => {
    const trip: TripRecord = {
      id: crypto.randomUUID(), destination: zone.name, departure: model.station.name,
      island: model.island, startTime: new Date(), distanceKm: zone.distanceKm,
      status: 'active', catches: [],
    }
    setModel((current) => ({ ...current, activeTrip: trip, trips: [trip, ...current.trips] }))
    tell(t('tripStarted'))
    navigate('/trips')
  }

  const saveCatch = (record: CatchRecord) => {
    setModel((current) => {
      const active = current.activeTrip
      if (!active) return current
      const changed = { ...active, catches: [...active.catches, record] }
      return { ...current, catches: [record, ...current.catches], activeTrip: changed, trips: current.trips.map((trip) => trip.id === active.id ? changed : trip) }
    })
    tell(t('catchSaved'))
  }

  const endTrip = () => {
    const active = model.activeTrip
    if (!active) return
    const completed = { ...active, status: 'completed' as const, endTime: new Date() }
    setModel((current) => ({ ...current, activeTrip: null, trips: current.trips.map((trip) => trip.id === active.id ? completed : trip) }))
    tell(t('tripEnded'))
  }

  const changeLanguage = (next: Language) => setModel((current) => ({ ...current, language: next }))
  const toggleLanguage = () => changeLanguage(lang(model.language.code === 'sw' ? 'en' : 'sw'))
  const guarded = (active: NavId, child: ReactNode) => account
    ? <Shell active={active} account={account} model={model} onLogout={signOut}>{child}</Shell>
    : <Navigate to="/login" replace />

  return <>
    <Routes>
      <Route path="/" element={<Welcome language={model.language} onChange={changeLanguage} onContinue={() => navigate('/login')} />} />
      <Route path="/login" element={<Auth mode="login" language={model.language} onToggleLanguage={toggleLanguage} onSubmit={signIn} />} />
      <Route path="/register" element={<Auth mode="register" language={model.language} onToggleLanguage={toggleLanguage} onSubmit={signIn} />} />
      <Route path="/home" element={guarded('home', <Home model={model} account={account} onLocation={setLocation} onViewZone={(zone) => navigate(`/zone/${zone.id}`)} onMap={() => navigate('/map')} onNotice={(text) => tell(text)} />)} />
      <Route path="/safety" element={guarded('safety', <LazyModule page="safety" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/prediction" element={guarded('prediction', <LazyModule page="prediction" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/map" element={guarded('map', <FishingMapPage model={model} onZone={(zone) => navigate(`/zone/${zone.id}`)} />)} />
      <Route path="/best-time" element={guarded('bestTime', <LazyModule page="bestTime" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/zone/:zoneId" element={guarded('map', <ZonePage model={model} onStart={startTrip} onBack={() => navigate('/map')} />)} />
      <Route path="/plan-trip" element={guarded('plan', <LazyModule page="plan" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/trips" element={guarded('tripRecords', <Trips model={model} onSaveCatch={saveCatch} onEnd={endTrip} />)} />
      <Route path="/catches" element={guarded('catchRecords', <LazyModule page="catches" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/weather" element={guarded('weather', <LazyModule page="weather" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/markets" element={guarded('markets', <LazyModule page="markets" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/buyers" element={guarded('buyers', <LazyModule page="buyers" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/prices" element={guarded('prices', <LazyModule page="prices" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/sales" element={guarded('sales', <LazyModule page="sales" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/reports" element={guarded('reports', <LazyModule page="reports" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/history" element={guarded('history', <Trips model={model} onSaveCatch={saveCatch} onEnd={endTrip} />)} />
      <Route path="/forecast-analysis" element={guarded('analysis', <LazyModule page="analysis" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/notifications" element={guarded('notifications', <LazyModule page="notifications" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="/profile" element={guarded('profile', <Profile model={model} account={account} onLanguage={changeLanguage} onLocation={setLocation} onLogout={signOut} onNotice={(text) => tell(text)} />)} />
      <Route path="/settings" element={guarded('settings', <Profile model={model} account={account} onLanguage={changeLanguage} onLocation={setLocation} onLogout={signOut} onNotice={(text) => tell(text)} />)} />
      <Route path="/help" element={guarded('help', <LazyModule page="help" model={model} onNotice={(text) => tell(text)} />)} />
      <Route path="*" element={<Navigate to={account ? '/home' : '/'} replace />} />
    </Routes>
    {notice ? <div className={`toast${notice.error ? ' toast-error' : ''}`} role="status"><Check size={17} />{notice.text}</div> : null}
  </>
}

function LazyModule({ page, model, onNotice }: { page: ModuleId; model: AppState; onNotice: (message: string) => void }) {
  return <Suspense fallback={<div className="module-loading" role="status">{model.language.code === 'sw' ? 'Inafungua sehemu…' : 'Loading section…'}</div>}><LazyDemoModulePage page={page} model={model} onNotice={onNotice} /></Suspense>
}

function Welcome({ language, onChange, onContinue }: { language: Language; onChange: (language: Language) => void; onContinue: () => void }) {
  const t = (key: string) => say(language, key)
  return <main className="welcome-page"><div className="welcome-photo" /><div className="welcome-scrim" />
    <header className="welcome-top"><Brand full /><LanguageButtons language={language} onChange={onChange} /></header>
    <section className="welcome-content"><span className="welcome-kicker"><Anchor size={15} />ZANZIBAR · TANZANIA</span><h1>{t('welcome')}</h1><p className="welcome-tagline">{t('tagline')}</p><p className="welcome-subtitle">{t('subtitle')}</p><button className="button button-light welcome-cta" type="button" onClick={onContinue}>{t('getStarted')}<ArrowRight size={18} /></button><p className="welcome-note"><ShieldCheck size={15} />{t('appInfo')}</p></section>
    <div className="welcome-bottom"><span>06°09′S 39°12′E</span><span>BAHARI YETU, MAISHA YETU</span></div>
  </main>
}

function Brand({ full = false }: { full?: boolean }) {
  if (full) return <span className="brand-mark brand-mark-full"><img src="/smart-ocean-logo.svg" alt="Smart Ocean Zanzibar" /></span>
  return <span className="brand-mark"><span className="brand-icon"><img src="/smart-ocean-mark.svg" alt="" /></span><span><strong>Smart Ocean</strong><small>Bahari Yetu, Maisha Yetu</small></span></span>
}

function LanguageButtons({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return <div className="language-switch" role="group" aria-label={say(language, 'chooseLanguage')}><button type="button" className={language.code === 'sw' ? 'selected' : ''} aria-pressed={language.code === 'sw'} onClick={() => onChange(lang('sw'))}>Kiswahili</button><button type="button" className={language.code === 'en' ? 'selected' : ''} aria-pressed={language.code === 'en'} onClick={() => onChange(lang('en'))}>English</button></div>
}

function Auth({ mode, language, onToggleLanguage, onSubmit }: {
  mode: 'login' | 'register'; language: Language; onToggleLanguage: () => void
  onSubmit: (account: DemoAccount, password: string, mode: 'login' | 'register', island: AppState['island'], stationId: string) => Promise<string | undefined>
}) {
  const t = (key: string) => say(language, key)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [island, setIsland] = useState<AppState['island']>('Unguja')
  const [stationId, setStationId] = useState('malindi')
  const [error, setError] = useState('')
  const register = mode === 'register'
  const stations = getStationsByIsland(island)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('')
    if (register && name.trim().length < 2) return setError(t('nameRequired'))
    if (phone.replace(/\D/g, '').length < 9 || password.length < 4) return setError(register ? t('phoneRequired') : t('invalidLogin'))
    if (register && password !== confirm) return setError(t('passwordMismatch'))
    const submitError = await onSubmit({ name: name.trim() || (language.code === 'sw' ? 'Mvuvi' : 'Fisher'), phone: phone.trim() }, password, mode, island, stationId)
    if (submitError) setError(submitError)
  }
  return <main className="auth-page"><div className="auth-art"><div className="auth-art-image" /><div className="auth-art-overlay" /><Link to="/" className="auth-brand"><Brand full /></Link><div className="auth-art-copy"><span className="welcome-kicker"><Waves size={15} />SMART OCEAN</span><h1>{t('tagline')}</h1><p>{t('subtitle')}</p></div><span className="auth-coordinates">UNGUJA · PEMBA</span></div>
    <section className="auth-panel"><div className="auth-panel-head"><Link to="/" className="back-link"><ArrowLeft size={17} />Smart Ocean</Link><button type="button" className="text-button" onClick={onToggleLanguage}>{language.code === 'sw' ? 'English' : 'Kiswahili'}</button></div><div className="auth-form-wrap"><span className="eyebrow">{t('authLabel')}</span><h2>{t(register ? 'register' : 'loginTitle')}</h2><p className="muted">{register ? t('localAccountNote') : t('loginHint')}</p>
      <form className="form-stack" onSubmit={submit} noValidate>
        {register ? <label className="field"><span>{t('name')}</span><input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required /></label> : null}
        <label className="field"><span>{t('phone')}</span><span className="input-icon"><Phone size={17} /><input type="tel" autoComplete="tel" inputMode="tel" placeholder="+255 7XX XXX XXX" value={phone} onChange={(event) => setPhone(event.target.value)} required /></span></label>
        <label className="field"><span>{t('password')}</span><span className="input-icon"><input type={showPassword ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={4} /><button className="input-action" type="button" aria-label={t(showPassword ? 'hidePassword' : 'showPassword')} onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
        {register ? <><label className="field"><span>{t('confirmPassword')}</span><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required /></label><div className="form-grid"><label className="field"><span>{t('island')}</span><select value={island} onChange={(event) => { const next = event.target.value as AppState['island']; setIsland(next); setStationId(getStationsByIsland(next)[0].id) }}><option value="Unguja">{t('unguja')}</option><option value="Pemba">{t('pemba')}</option></select></label><label className="field"><span>{t('station')}</span><select value={stationId} onChange={(event) => setStationId(event.target.value)}>{stations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div></> : <button type="button" className="text-button forgot-link" onClick={() => setError(t('localAccountNote'))}>{t('forgotPassword')}</button>}
        {error ? <p className="form-error" role="alert">{error}</p> : null}<button type="submit" className="button button-primary auth-submit">{t(register ? 'createAccount' : 'loginButton')}<ArrowRight size={17} /></button>
      </form><p className="auth-switch">{t(register ? 'alreadyAccount' : 'noAccount')} <Link to={register ? '/login' : '/register'}>{t(register ? 'login' : 'register')}</Link></p><p className="auth-disclaimer"><ShieldCheck size={15} />{t('localAccountNote')}</p></div></section>
  </main>
}

function Shell({ active, account, model, onLogout, children }: { active: NavId; account: DemoAccount; model: AppState; onLogout: () => void; children: ReactNode }) {
  const t = (key: string) => say(model.language, key)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const items = NAV_GROUPS.flatMap((group) => group.items)
  const mobileItems = [
    items.find((item) => item.id === 'home')!,
    items.find((item) => item.id === 'map')!,
    items.find((item) => item.id === 'tripRecords')!,
    items.find((item) => item.id === 'profile')!,
  ]
  const tripActive = ['tripRecords', 'catchRecords', 'history'].includes(active)
  const navLink = (item: NavItem, mobile = false) => {
    const Icon = item.icon
    const selected = item.id === active || (item.id === 'tripRecords' && tripActive)
    return <Link key={item.id} to={item.to} onClick={() => mobile && setMobileMenuOpen(false)} className={`${mobile ? 'mobile-nav-link' : 'nav-link'}${selected ? ' is-active' : ''}`} aria-current={selected ? 'page' : undefined}><Icon size={mobile ? 20 : 18} /><span>{t(item.key)}</span>{!mobile && selected ? <span className="nav-active-dot" /> : null}</Link>
  }
  return <div className="app-shell"><aside className="desktop-sidebar"><Link to="/home" className="sidebar-brand"><Brand /></Link><nav className="sidebar-nav" aria-label={t('allSections')}>{NAV_GROUPS.map((group) => <section className="sidebar-group" key={group.key}><h2>{t(group.key)}</h2>{group.items.map((item) => navLink(item))}</section>)}</nav><div className="sidebar-bottom"><div className="sidebar-account"><span className="avatar avatar-small"><UserRound size={16} /></span><span><strong>{account.name}</strong><small>{t('accountDemo')}</small></span></div><button className="sidebar-signout" type="button" onClick={onLogout}><LogOut size={16} />{t('logout')}</button></div></aside>
    <div className="app-column"><header className="topbar"><Link to="/home" className="mobile-brand"><Brand /></Link><div className="topbar-right"><span className="demo-badge"><i />{t('demoData')}</span><span className="topbar-location"><MapPin size={15} />{model.station.name} · {t(model.island.toLowerCase())}</span><Link to="/profile" className="avatar" aria-label={t('profile')}><UserRound size={19} /></Link></div></header><main className="page-content">{children}</main><footer className="app-disclaimer"><span>{t('demoData')}</span>{t('demoBanner')}</footer></div>
    <nav className="mobile-nav" aria-label={t('dashboard')}>{mobileItems.map((item) => navLink(item, true))}<button type="button" className={`mobile-nav-link${mobileMenuOpen ? ' is-active' : ''}`} onClick={() => setMobileMenuOpen((current) => !current)} aria-expanded={mobileMenuOpen}><Menu size={20} /><span>{t('more')}</span></button></nav>
    {mobileMenuOpen ? <div className="mobile-menu-backdrop" onMouseDown={() => setMobileMenuOpen(false)}><nav className="mobile-menu-sheet" aria-label={t('allSections')} onMouseDown={(event) => event.stopPropagation()}><div className="mobile-menu-heading"><strong>{t('allSections')}</strong><button type="button" className="icon-button" aria-label={t('close')} onClick={() => setMobileMenuOpen(false)}><X size={18} /></button></div>{NAV_GROUPS.map((group) => <section className="mobile-nav-group" key={group.key}><h2>{t(group.key)}</h2>{group.items.map((item) => navLink(item, true))}</section>)}</nav></div> : null}
  </div>
}

function Heading({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}<h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}</div>{action}</div>
}

function DemoNotice({ language, compact = false }: { language: Language; compact?: boolean }) {
  return <div className={`demo-notice${compact ? ' demo-notice-compact' : ''}`}><span className="demo-badge">{say(language, 'demoData')}</span><p>{say(language, 'demoBanner')}</p></div>
}

function LocationControls({ model, onChange, onSaved }: { model: AppState; onChange: (island: AppState['island'], stationId?: string) => void; onSaved?: () => void }) {
  const t = (key: string) => say(model.language, key)
  const stations = getStationsByIsland(model.island)
  return <section className="location-controls panel"><div className="section-heading"><div><span className="eyebrow">{t('location')}</span><h2>{model.station.name} <span>·</span> {t(model.island.toLowerCase())}</h2></div><MapPin size={20} /></div><div className="location-fields"><label className="field"><span>{t('island')}</span><select value={model.island} onChange={(event) => onChange(event.target.value as AppState['island'])}><option value="Unguja">{t('unguja')}</option><option value="Pemba">{t('pemba')}</option></select></label><label className="field"><span>{t('station')}</span><select value={model.station.id} onChange={(event) => onChange(model.island, event.target.value)}>{stations.map((station) => <option key={station.id} value={station.id}>{station.name}</option>)}</select></label></div>{onSaved ? <button type="button" className="button button-secondary button-small" onClick={onSaved}><Check size={15} />{t('saveLocation')}</button> : null}</section>
}

function Metric({ icon, label, value, note }: { icon: ReactNode; label: string; value: string; note: string }) {
  return <article className="summary-card"><span className="summary-icon">{icon}</span><div className="summary-info"><span>{label}</span><strong>{value}</strong><small>{note}</small></div><span className="summary-demo">DEMO</span></article>
}

function Home({ model, account, onLocation, onViewZone, onMap, onNotice }: { model: AppState; account: DemoAccount | null; onLocation: (island: AppState['island'], stationId?: string) => void; onViewZone: (zone: FishingZone) => void; onMap: () => void; onNotice: (message: string) => void }) {
  const t = (key: string) => say(model.language, key)
  const zones = getZonesByIsland(model.island)
  const catchWeight = model.trips.reduce((sum, trip) => sum + weightOf(trip), 0)
  return <div className="home-page"><Heading eyebrow={`${t('island')} · ${t(model.island.toLowerCase())}`} title={`${t('greeting')}, ${account?.name ?? (model.language.code === 'sw' ? 'Mvuvi' : 'Fisher')}`} subtitle={`${model.station.name} · ${t(model.island.toLowerCase())}`} action={<button type="button" className="icon-button notification-button" aria-label={t('safetyFirst')} onClick={() => onNotice(t('safetyReminder'))}><Bell size={19} /><i /></button>} /><DemoNotice language={model.language} compact />
    <section className="summary-grid"><Metric icon={<Waves />} label={t('seaCondition')} value={t('moderate')} note={`${t('demoShort')} · 1.1 m`} /><Metric icon={<Wind />} label={t('wind')} value="12 km/h" note={t('demoShort')} /><Metric icon={<Eye />} label={t('visibility')} value={`${t('good')} · 8 km`} note={t('demoShort')} /><Metric icon={<Fish />} label={t('totalCatch')} value={`${catchWeight.toFixed(1)} kg`} note={`${model.trips.length} ${t('totalTrips').toLowerCase()}`} /></section>
    <div className="dashboard-columns"><div className="dashboard-primary"><LocationControls model={model} onChange={onLocation} onSaved={() => onNotice(t('stationSaved'))} /><section className="zone-preview-section"><div className="section-heading"><div><span className="eyebrow">{t('demoData')}</span><h2>{t('zonesAround')} {t(model.island.toLowerCase())}</h2></div><button type="button" className="text-link" onClick={onMap}>{t('viewMap')}<ArrowRight size={16} /></button></div><div className="zone-preview-list">{zones.map((zone) => <ZoneRow key={zone.id} zone={zone} language={model.language} onClick={() => onViewZone(zone)} />)}</div></section></div>
      <aside className="dashboard-aside"><section className="safety-card panel"><div className="safety-title"><span className="safety-icon"><ShieldCheck size={21} /></span><div><span className="eyebrow">{t('demoData')}</span><h2>{t('safetyFirst')}</h2></div></div><p>{t('safetyReminder')}</p><ul><li><Check size={15} />{t('checkWeather')}</li><li><Check size={15} />{t('lifeJacket')}</li><li><Check size={15} />{t('drinkingWater')}</li><li><Check size={15} />{t('checkFuel')}</li><li><Check size={15} />{t('tellSomeone')}</li></ul><button className="button button-secondary" type="button" onClick={onMap}>{t('exploreZones')}<ArrowRight size={16} /></button></section><div className="coast-note"><Compass size={19} /><div><strong>{t('demoRoute')}</strong><p>{t('appInfo')}</p></div></div></aside></div>
  </div>
}

function ZoneRow({ zone, language, onClick }: { zone: FishingZone; language: Language; onClick: () => void }) {
  const suitability = zone.suitability === 'high' ? 'higherSuitability' : zone.suitability === 'moderate' ? 'moderateSuitability' : 'lowerSuitability'
  return <button className="zone-card" type="button" onClick={onClick}><i className={`zone-status-dot status-${zone.suitability}`} /><span className="zone-card-copy"><strong>{zoneTitle(zone, language)}</strong><small>{zone.distanceKm} km · {zone.species.map((item) => localizedFish(item, language)).join(' · ')}</small></span><span className="zone-card-suitability">{say(language, suitability)}</span><ChevronRight size={17} /></button>
}

function FitMapPoints({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length) map.fitBounds(L.latLngBounds(points).pad(0.12), { maxZoom: 10 })
  }, [map, points])
  return null
}

function FocusFishingArea({ area }: { area: FishingArea | null }) {
  const map = useMap()
  useEffect(() => {
    if (area) map.panTo([area.latitude, area.longitude])
  }, [area, map])
  return null
}

function MarkerIcon(zone: FishingZone) {
  return L.divIcon({ className: `map-marker map-marker-${zone.suitability}`, html: '<span></span>', iconSize: [32, 32], iconAnchor: [16, 16] })
}

function FishingMapPage({ model, onZone }: { model: AppState; onZone: (zone: FishingZone) => void }) {
  const t = (key: string) => say(model.language, key)
  const [selected, setSelected] = useState<FishingZone | null>(null)
  const [selectedArea, setSelectedArea] = useState<FishingArea | null>(null)
  const [tileError, setTileError] = useState(false)
  const zones = useMemo(() => getZonesByIsland(model.island), [model.island])
  const areas = useMemo(() => getFishingAreas(model.island), [model.island])
  const mapPoints = useMemo<[number, number][]>(() => [
    ...zones.map((zone) => [zone.latitude, zone.longitude] as [number, number]),
    ...areas.map((area) => [area.latitude, area.longitude] as [number, number]),
  ], [areas, zones])
  const areaMarker = L.divIcon({ className: 'map-area-pin', html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 12] })
  return <div className="map-page"><Heading eyebrow={`${t('island')} · ${t(model.island.toLowerCase())}`} title={t('map')} subtitle={`${model.station.name} · ${t('demoData')}`} /><DemoNotice language={model.language} compact /><div className="map-layout"><div className="map-stage">{tileError ? <div className="map-fallback"><MapIcon size={23} />{t('mapUnavailable')}</div> : null}<MapContainer center={model.island === 'Unguja' ? [-6.16, 39.25] : [-5.5, 39.8]} zoom={model.island === 'Unguja' ? 9 : 9} scrollWheelZoom={false} className="leaflet-map"><FitMapPoints points={mapPoints} /><FocusFishingArea area={selectedArea} /><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" eventHandlers={{ tileerror: () => setTileError(true), tileload: () => setTileError(false) }} />{zones.map((zone) => <Marker key={zone.id} position={[zone.latitude, zone.longitude]} icon={MarkerIcon(zone)} eventHandlers={{ click: () => setSelected(zone) }}><Popup><strong>{zoneTitle(zone, model.language)}</strong><p>{zone.distanceKm} km · {t('demoShort')}</p><button type="button" onClick={() => onZone(zone)}>{t('viewZone')}</button></Popup></Marker>)}{areas.map((area) => <Marker key={area.id} position={[area.latitude, area.longitude]} icon={areaMarker} eventHandlers={{ click: () => setSelectedArea(area) }}><Popup><strong>{area.name}</strong><p>{t('areaPinNote')}</p></Popup></Marker>)}</MapContainer><span className="map-attribution"><MapPin size={14} />{model.station.name} · {t(model.island.toLowerCase())}</span></div><aside className="map-side-panel"><div className="map-side-heading"><div><span className="eyebrow">{t('demoData')}</span><h2>{t('exploreZones')}</h2></div><Navigation size={20} /></div><div className="map-zone-list">{zones.map((zone) => <ZoneRow key={zone.id} zone={zone} language={model.language} onClick={() => setSelected(zone)} />)}</div><details className="fishing-area-directory"><summary><span><MapPin size={15} />{t('fishingAreas')}</span><b>{areas.length}</b></summary><div className="fishing-area-list">{areas.map((area) => <button type="button" key={area.id} className={selectedArea?.id === area.id ? 'is-selected' : ''} onClick={() => setSelectedArea(area)}><MapPin size={13} />{area.name}</button>)}</div><p>{t('areaPinNote')}</p></details><div className="map-legend"><strong>{t('suitability')}</strong><span><i className="legend-dot legend-high" />{t('higherSuitability')}</span><span><i className="legend-dot legend-moderate" />{t('moderateSuitability')}</span><span><i className="legend-dot legend-low" />{t('lowerSuitability')}</span><span><i className="legend-dot legend-area" />{t('fishingAreas')}</span></div><p className="map-disclaimer">{t('demoMapNote')}</p></aside></div>
    {selected ? <div className="zone-sheet-backdrop" onMouseDown={() => setSelected(null)}><section className="zone-bottom-sheet" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><button className="icon-button sheet-close" type="button" aria-label={t('close')} onClick={() => setSelected(null)}><X size={18} /></button><span className="eyebrow">{t('demoData')}</span><h2>{zoneTitle(selected, model.language)}</h2><p>{selected.distanceKm} km · {selected.species.map((item) => localizedFish(item, model.language)).join(' · ')}</p><button className="button button-primary" type="button" onClick={() => onZone(selected)}>{t('viewZone')}<ArrowRight size={17} /></button></section></div> : null}
    {selectedArea ? <div className="zone-sheet-backdrop" onMouseDown={() => setSelectedArea(null)}><section className="zone-bottom-sheet area-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="fishing-area-title" onMouseDown={(event) => event.stopPropagation()}><button className="icon-button sheet-close" type="button" aria-label={t('close')} onClick={() => setSelectedArea(null)}><X size={18} /></button><span className="eyebrow">{t('fishingAreas')}</span><h2 id="fishing-area-title">{selectedArea.name}</h2><p><MapPin size={14} />{t(selectedArea.island.toLowerCase())}</p><p className="area-pin-note">{t('areaPinNote')}</p><button className="button button-secondary" type="button" onClick={() => setSelectedArea(null)}>{t('close')}</button></section></div> : null}
  </div>
}

function ZonePage({ model, onStart, onBack }: { model: AppState; onStart: (zone: FishingZone) => void; onBack: () => void }) {
  const { zoneId } = useParams()
  const zone = FISHING_ZONES.find((item) => item.id === zoneId)
  const t = (key: string) => say(model.language, key)
  const [destination, setDestination] = useState(false)
  const [checks, setChecks] = useState([false, false, false, false, false])
  if (!zone) return <div className="empty-panel"><h2>{t('zoneDetails')}</h2><button className="button button-primary" type="button" onClick={onBack}>{t('viewMap')}</button></div>
  const rating = zone.suitability === 'high' ? 'higherSuitability' : zone.suitability === 'moderate' ? 'moderateSuitability' : 'lowerSuitability'
  const checklist = ['lifeJacket', 'checkFuel', 'drinkingWater', 'checkWeather', 'tellSomeone']
  const ready = destination && checks.every(Boolean)
  return <div className="zone-detail-page"><button className="back-link page-back" type="button" onClick={onBack}><ArrowLeft size={17} />{t('map')}</button><section className="zone-hero"><div className="zone-hero-art"><span className="zone-coordinate">{Math.abs(zone.latitude).toFixed(2)}°S · {zone.longitude.toFixed(2)}°E</span><div className="zone-art-mark"><Waves size={52} /></div></div><div className="zone-hero-content"><span className="demo-badge">{t('demoData')}</span><h1>{zoneTitle(zone, model.language)}</h1><p><MapPin size={16} />{t(zone.island.toLowerCase())} · {zone.distanceKm} km {t('distanceFrom')} {model.station.name}</p><span className={`suitability-pill status-${zone.suitability}`}><i className={`zone-status-dot status-${zone.suitability}`} />{t(rating)}</span></div></section><DemoNotice language={model.language} />
    <div className="zone-detail-grid"><section className="zone-facts panel"><div className="section-heading"><div><span className="eyebrow">{t('demoData')}</span><h2>{t('oceanSummary')}</h2></div></div><div className="fact-grid"><Fact icon={<Waves />} label={t('seaCondition')} value={`${t('moderate')} · ${zone.waveHeight} m`} /><Fact icon={<Wind />} label={t('wind')} value={`${zone.windSpeed} km/h`} /><Fact icon={<Thermometer />} label={t('waterTemperature')} value={`${zone.waterTemperature}°C`} /><Fact icon={<Eye />} label={t('visibility')} value={`${t('good')} · ${zone.visibility} km`} /><Fact icon={<Navigation />} label={t('distance')} value={`${zone.distanceKm} km`} /></div><div className="species-block"><h3>{t('species')}</h3><div className="species-list">{zone.species.map((item) => <span className="species-chip" key={item}><Fish size={14} />{localizedFish(item, model.language)}</span>)}</div><p className="muted">{t('demoMapNote')}</p></div></section>
      <div className="preparation-column"><section className="destination-select panel"><div><span className="eyebrow">{t('destination')}</span><h2>{zoneTitle(zone, model.language)}</h2><p>{model.station.name} → {zoneTitle(zone, model.language)}</p></div><button type="button" className={`button ${destination ? 'button-selected' : 'button-secondary'}`} aria-pressed={destination} onClick={() => setDestination((value) => !value)}>{destination ? <Check size={17} /> : <Plus size={17} />}{t(destination ? 'destinationSelected' : 'selectDestination')}</button></section>
        <section className="checklist-panel panel"><div className="section-heading"><div><span className="eyebrow">{t('demoData')}</span><h2>{t('safetyChecklist')}</h2></div><ShieldCheck size={20} /></div><div className="checklist-items">{checklist.map((key, index) => <label className="checklist-item" key={key}><input type="checkbox" checked={checks[index]} onChange={() => setChecks((current) => current.map((value, i) => i === index ? !value : value))} /><span>{t(key)}</span></label>)}</div>{!ready ? <p className="form-hint">{t('completeChecklist')}</p> : null}<button type="button" className="button button-primary button-full" disabled={!ready} onClick={() => onStart(zone)}>{t('startTrip')}<ArrowRight size={17} /></button></section></div></div>
  </div>
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="fact-card"><span className="fact-icon">{icon}</span><span className="fact-label">{label}</span><strong>{value}</strong><small>DEMO</small></div>
}

function Trips({ model, onSaveCatch, onEnd }: { model: AppState; onSaveCatch: (record: CatchRecord) => void; onEnd: () => void }) {
  const t = (key: string) => say(model.language, key)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const total = model.trips.reduce((sum, trip) => sum + weightOf(trip), 0)
  return <div className="trips-page"><Heading eyebrow={t('demoData')} title={t('myTrips')} subtitle={t('tripHistory')} />
    <div className="trip-stats"><Metric icon={<Anchor />} label={t('totalTrips')} value={String(model.trips.length)} note={t('completed')} /><Metric icon={<Fish />} label={t('totalCatch')} value={`${total.toFixed(1)} kg`} note={t('demoShort')} /><Metric icon={<Clock3 />} label={t('activeTrip')} value={model.activeTrip ? t('inProgress') : '—'} note={model.activeTrip?.destination ?? t('noActiveTrip')} /></div>
    {model.activeTrip ? <ActiveTrip trip={model.activeTrip} language={model.language} onCatch={() => setShowForm((value) => !value)} onEnd={() => setConfirmEnd(true)} /> : <div className="active-empty panel"><span className="empty-icon"><Anchor size={23} /></span><div><h2>{t('noActiveTrip')}</h2><p>{t('startFirstTrip')}</p></div><Link to="/map" className="button button-primary">{t('viewMap')}<ArrowRight size={16} /></Link></div>}
    {showForm && model.activeTrip ? <CatchForm trip={model.activeTrip} language={model.language} onSave={(record) => { onSaveCatch(record); setShowForm(false) }} onCancel={() => setShowForm(false)} /> : null}
    <section className="history-section"><div className="section-heading"><div><span className="eyebrow">{t('demoData')}</span><h2>{t('tripHistory')}</h2></div><span className="history-count">{model.trips.length}</span></div>{model.trips.length ? <div className="history-list">{model.trips.map((trip) => <HistoryCard key={trip.id} trip={trip} language={model.language} />)}</div> : <div className="empty-panel"><span className="empty-icon"><Compass size={25} /></span><h3>{t('noTrips')}</h3><Link to="/map" className="button button-primary">{t('startFirstTrip')}</Link></div>}</section>
    {confirmEnd ? <div className="modal-backdrop"><section className="confirm-modal" role="dialog" aria-modal="true"><span className="modal-icon"><CircleHelp size={23} /></span><h2>{t('endTrip')}</h2><p>{t('confirmEnd')}</p><div className="modal-actions"><button className="button button-secondary" type="button" onClick={() => setConfirmEnd(false)}>{t('cancel')}</button><button className="button button-danger" type="button" onClick={() => { onEnd(); setConfirmEnd(false) }}>{t('confirm')}</button></div></section></div> : null}
  </div>
}

function ActiveTrip({ trip, language, onCatch, onEnd }: { trip: TripRecord; language: Language; onCatch: () => void; onEnd: () => void }) {
  const t = (key: string) => say(language, key)
  return <section className="active-trip-card"><div className="active-trip-top"><span className="trip-status"><i className="live-dot" />{t('inProgress')}</span><span className="demo-badge">{t('demoData')}</span></div><div className="active-trip-main"><div><span className="eyebrow">{t('activeTrip')}</span><h2>{trip.destination}</h2><p><MapPin size={15} />{trip.departure} → {trip.destination}</p></div><div className="active-distance"><strong>{trip.distanceKm} km</strong><small>{t('demoRoute')}</small></div></div><div className="trip-meta"><span><Clock3 size={15} />{t('started')} {dateLabel(trip.startTime, language, true)}</span><span><Fish size={15} />{trip.catches.length} {t('catch').toLowerCase()}</span></div><div className="active-trip-actions"><button className="button button-primary" type="button" onClick={onCatch}><Plus size={17} />{t('recordCatch')}</button><button className="button button-outline-danger" type="button" onClick={onEnd}>{t('endTrip')}</button></div></section>
}

function CatchForm({ trip, language, onSave, onCancel }: { trip: TripRecord; language: Language; onSave: (record: CatchRecord) => void; onCancel: () => void }) {
  const t = (key: string) => say(language, key)
  const [species, setSpecies] = useState('Tuna')
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(trip.startTime.toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState('')
  const [error, setError] = useState('')
  const zone = FISHING_ZONES.find((item) => item.name === trip.destination)
  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 900_000) { setError(language.code === 'sw' ? 'Chagua picha iliyo chini ya 900 KB.' : 'Choose an image smaller than 900 KB.'); return }
    const reader = new FileReader()
    reader.onload = () => setPhoto(typeof reader.result === 'string' ? reader.result : '')
    reader.readAsDataURL(file)
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const amount = Number(weight)
    if (!species) { setError(t('speciesRequired')); return }
    if (!Number.isFinite(amount) || amount <= 0) { setError(t('weightRequired')); return }
    if (!date) { setError(language.code === 'sw' ? 'Chagua tarehe.' : 'Choose a date.'); return }
    onSave({ id: crypto.randomUUID(), tripId: trip.id, species, weightKg: amount, date, zoneId: zone?.id ?? '', zoneName: trip.destination, ...(notes.trim() ? { notes: notes.trim() } : {}), ...(photo ? { photoUrl: photo } : {}) })
  }
  return <section className="catch-form-panel panel" id="catch-form"><div className="section-heading"><div><span className="eyebrow">{t('demoData')}</span><h2>{t('recordCatch')}</h2></div><button className="icon-button" type="button" aria-label={t('close')} onClick={onCancel}><X size={18} /></button></div><form className="form-stack" onSubmit={submit} noValidate>
    <div className="form-grid"><label className="field"><span>{t('fishSpecies')}</span><select value={species} onChange={(event) => setSpecies(event.target.value)}>{['Tuna', 'Snapper', 'Kingfish', 'Grouper', 'Other'].map((item) => <option key={item} value={item}>{localizedFish(item, language)}</option>)}</select></label><label className="field"><span>{t('weight')} ({t('kg')})</span><input type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="0.0" value={weight} onChange={(event) => setWeight(event.target.value)} required /></label></div>
    <div className="form-grid"><label className="field"><span>{t('date')}</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><label className="field"><span>{t('fishingZone')}</span><input value={zone ? zoneTitle(zone, language) : trip.destination} readOnly /></label></div>
    <label className="field"><span>{t('optionalPhoto')}</span><input type="file" accept="image/*" onChange={choosePhoto} /><small className="form-hint">{t('addPhoto')}</small></label>{photo ? <img className="catch-photo-preview" src={photo} alt={t('optionalPhoto')} /> : null}
    <label className="field"><span>{t('notes')}</span><textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={t('notesPlaceholder')} /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<div className="form-actions"><button type="button" className="button button-secondary" onClick={onCancel}>{t('cancel')}</button><button type="submit" className="button button-primary"><Check size={17} />{t('saveCatch')}</button></div>
  </form></section>
}

function HistoryCard({ trip, language }: { trip: TripRecord; language: Language }) {
  const t = (key: string) => say(language, key)
  const zone = FISHING_ZONES.find((item) => item.name === trip.destination)
  return <details className="history-card"><summary><span className="history-icon"><Anchor size={19} /></span><span className="history-main"><strong>{zone ? zoneTitle(zone, language) : trip.destination}</strong><small>{trip.departure} → {trip.destination} · {dateLabel(trip.startTime, language)}</small></span><span className={`history-status history-${trip.status}`}>{t(trip.status === 'active' ? 'inProgress' : 'completed')}</span><span className="history-total">{weightOf(trip).toFixed(1)} kg</span><ChevronRight size={17} className="history-chevron" /></summary><div className="history-details"><span>{t('island')}: {t(trip.island.toLowerCase())}</span><span>{t('started')}: {dateLabel(trip.startTime, language, true)}</span>{trip.endTime ? <span>{t('endTrip')}: {dateLabel(trip.endTime, language, true)}</span> : null}<strong>{t('totalWeight')}: {weightOf(trip).toFixed(1)} kg</strong>{trip.catches.map((record) => <div className="history-catch" key={record.id}><span><Fish size={14} />{localizedFish(record.species, language)}</span><strong>{record.weightKg.toFixed(1)} kg</strong></div>)}</div></details>
}

function Profile({ model, account, onLanguage, onLocation, onLogout, onNotice }: { model: AppState; account: DemoAccount | null; onLanguage: (language: Language) => void; onLocation: (island: AppState['island'], stationId?: string) => void; onLogout: () => void; onNotice: (text: string) => void }) {
  const t = (key: string) => say(model.language, key)
  const [started, setStarted] = useState(false)
  const [choice, setChoice] = useState<'language' | 'island' | 'info' | 'trip' | null>(null)
  const zones = getZonesByIsland(model.island)
  const options = [{ id: 'language' as const, label: t('menuLanguage') }, { id: 'island' as const, label: t('menuIsland') }, { id: 'info' as const, label: t('menuInfo') }, { id: 'trip' as const, label: t('menuTrip') }]
  return <div className="profile-page"><Heading eyebrow={t('settings')} title={t('profileSettings')} /><section className="profile-card panel"><span className="avatar avatar-large"><UserRound size={26} /></span><div className="profile-id"><h2>{account?.name}</h2><p><Phone size={14} />{account?.phone}</p><span className="demo-badge">{t('accountDemo')}</span></div><button type="button" className="button button-outline-danger profile-logout" onClick={onLogout}><LogOut size={16} />{t('logout')}</button></section>
    <div className="profile-grid"><section className="settings-panel panel"><div className="section-heading"><div><span className="eyebrow">{t('settings')}</span><h2>{t('changeLanguage')}</h2></div></div><LanguageButtons language={model.language} onChange={onLanguage} /><div className="settings-divider" /><LocationControls model={model} onChange={onLocation} onSaved={() => onNotice(t('stationSaved'))} /><p className="settings-note"><CircleHelp size={15} />{t('localAccountNote')}</p></section>
      <section className="ussd-panel panel"><div className="section-heading"><div><span className="eyebrow">{t('demoData')}</span><h2>{t('ussdSms')}</h2></div><Phone size={20} /></div><p className="muted">{t('ussdIntro')}</p><div className="ussd-code-row"><span>{t('dialCode')}</span><strong>*152*10#</strong><b>DEMO</b></div><button className="button button-primary" type="button" onClick={() => { setStarted(true); setChoice(null) }}>{started ? t('backMenu') : t('tryMenu')}<ArrowRight size={16} /></button>
        {started ? <div className="ussd-phone"><div className="ussd-phone-head">SMART OCEAN <span>DEMO</span></div><div className="ussd-screen"><strong>{choice ? t('menuReply') : 'Smart Ocean'}</strong>{choice === 'language' ? <div className="ussd-choice-row"><button type="button" onClick={() => onLanguage(lang('sw'))}>Kiswahili</button><button type="button" onClick={() => onLanguage(lang('en'))}>English</button></div> : null}{choice === 'island' ? <div className="ussd-choice-row"><button type="button" onClick={() => onLocation('Unguja')}>{t('unguja')}</button><button type="button" onClick={() => onLocation('Pemba')}>{t('pemba')}</button></div> : null}{choice === 'info' ? <><p>{zones[0]?.name} · {zones[0]?.distanceKm} km</p><p>{t('demoShort')} · {t('moderate')}</p><small>{t('demoMapNote')}</small></> : null}{choice === 'trip' ? <><p>{model.activeTrip ? `${t('activeTrip')}: ${model.activeTrip.destination}` : t('noActiveTrip')}</p><Link to="/trips" className="ussd-link">{t('myTrips')}<ArrowRight size={14} /></Link></> : null}{!choice ? options.map((item, index) => <button className="ussd-menu-option" key={item.id} type="button" onClick={() => setChoice(item.id)}><span>{index + 1}</span>{item.label}<ChevronRight size={14} /></button>) : null}</div><button className="ussd-back" type="button" onClick={() => choice ? setChoice(null) : setStarted(false)}>{choice ? t('backMenu') : t('close')}</button></div> : null}
      </section></div><p className="profile-app-info"><Waves size={16} />{t('appInfo')}</p></div>
}

export default App