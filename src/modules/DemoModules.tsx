import { useState, type FormEvent, type ReactNode } from 'react'
import { Anchor, ArrowRight, Bell, Check, Clock3, CloudSun, Compass, Eye, Fish, MapPin, ShieldCheck, Waves, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FISHING_AREAS } from '../data/fishingAreas'
import { getZonesByIsland } from '../data/fishingZones'
import type { AppState, CatchRecord, Language } from '../types/index'

type ModuleId = 'safety' | 'prediction' | 'bestTime' | 'plan' | 'catches' | 'weather' | 'markets' | 'buyers' | 'prices' | 'sales' | 'reports' | 'analysis' | 'notifications' | 'help'
type SaleRecord = { id: string; date: string; species: string; weightKg: number; pricePerKg: number; buyer: string }
type TripPlan = { id: string; date: string; departureTime: string; destination: string; targetSpecies: string; vessel: string; crew: number; fuelBudget: number }

const COPY: Record<ModuleId, Record<'en' | 'sw', { title: string; intro: string; note: string }>> = {
  safety: {
    en: { title: 'Sea safety', intro: 'Review your departure checks before heading out.', note: 'Demonstration guidance only. Consult official marine safety notices and local authorities.' },
    sw: { title: 'Usalama wa Bahari', intro: 'Kagua maandalizi ya usalama kabla ya kuondoka.', note: 'Mwongozo wa mfano tu. Fuata matangazo rasmi ya usalama wa bahari na mamlaka za eneo.' },
  },
  prediction: {
    en: { title: 'Fish forecast (AI demo)', intro: 'Illustrative species and zone cards for showing how a future model could be presented.', note: 'No AI model or live environmental feed is connected. These examples do not predict actual fish locations.' },
    sw: { title: 'Utabiri wa Samaki (AI ya mfano)', intro: 'Kadi za mfano za kuonyesha namna matokeo ya modeli ya baadaye yanavyoweza kuwasilishwa.', note: 'Hakuna modeli ya AI au data ya mazingira ya moja kwa moja iliyounganishwa. Mifano hii haitabiri samaki walipo.' },
  },
  bestTime: {
    en: { title: 'Illustrative fishing times', intro: 'Example time windows to demonstrate a planning view.', note: 'Times are fictional examples, not recommendations generated from verified sea or fish data.' },
    sw: { title: 'Muda wa mfano wa kwenda kuvua', intro: 'Vipindi vya kubuni vinavyoonyesha muonekano wa kupanga muda.', note: 'Hii ni mifano ya kubuni, si mapendekezo yaliyotokana na data iliyothibitishwa ya bahari au samaki.' },
  },
  plan: {
    en: { title: 'Plan a fishing trip', intro: 'Save a local trip plan before departure.', note: 'Fuel budget and plan details are personal estimates saved on this device.' },
    sw: { title: 'Panga Safari ya Uvuvi', intro: 'Hifadhi mpango wa safari kwenye kifaa kabla ya kuondoka.', note: 'Makadirio ya mafuta na mpango huhifadhiwa kwenye kifaa hiki pekee.' },
  },
  catches: {
    en: { title: 'Catch records', intro: 'Review catch entries saved from your trips.', note: 'Records are stored on this device and can be edited through trip history.' },
    sw: { title: 'Rekodi za Samaki Walionaswa', intro: 'Kagua samaki uliorekodi kwenye safari zako.', note: 'Rekodi zinahifadhiwa kwenye kifaa hiki na huonekana pamoja na historia ya safari.' },
  },
  weather: {
    en: { title: 'Weather and sea conditions', intro: 'Illustrative ocean indicators for the selected island.', note: 'Not a live forecast. Check trusted marine and weather sources before departure.' },
    sw: { title: 'Hali ya Hewa na Bahari', intro: 'Viashiria vya mfano vya bahari kwa kisiwa ulichochagua.', note: 'Si utabiri wa moja kwa moja. Kagua vyanzo rasmi vya hali ya hewa na usalama kabla ya kuondoka.' },
  },
  markets: {
    en: { title: 'Fish markets', intro: 'Example market directory for a future verified marketplace.', note: 'Market names and details here are illustrative; opening hours and services are not verified.' },
    sw: { title: 'Masoko ya Samaki', intro: 'Orodha ya mfano ya masoko kwa huduma itakayothibitishwa baadaye.', note: 'Majina na taarifa ni za mfano; muda wa kazi na huduma havijathibitishwa.' },
  },
  buyers: {
    en: { title: 'Buyer locations', intro: 'Example buyer points grouped by island.', note: 'These are sample entries, not verified businesses or active buyer requests.' },
    sw: { title: 'Maeneo ya Wanunuzi', intro: 'Maeneo ya wanunuzi wa mfano yaliyopangwa kwa kisiwa.', note: 'Hizi ni rekodi za mfano, si biashara au oda zilizothibitishwa.' },
  },
  prices: {
    en: { title: 'Buyers and prices', intro: 'Compare illustrative sample offers by species.', note: 'All TZS amounts are invented demonstration values, not current market prices or offers.' },
    sw: { title: 'Wanunuzi na Bei', intro: 'Linganisha bei za mfano kwa aina za samaki.', note: 'Kiasi chote cha TZS kimebuniwa kwa maonesho; si bei au ofa za sasa sokoni.' },
  },
  sales: {
    en: { title: 'Sales records', intro: 'Record a completed sale and calculate its gross value.', note: 'Sales are saved locally. Example records and values are not market data.' },
    sw: { title: 'Rekodi za Mauzo', intro: 'Rekodi mauzo yaliyokamilika na hesabu thamani yake kabla ya gharama.', note: 'Mauzo huhifadhiwa kwenye kifaa. Rekodi na bei za mfano si data ya soko.' },
  },
  reports: {
    en: { title: 'Fishing reports', intro: 'A summary calculated from trip and catch records on this device.', note: 'The sample trips included at first launch are demonstration data.' },
    sw: { title: 'Ripoti za Uvuvi', intro: 'Muhtasari unaokokotolewa kutoka safari na samaki waliorekodiwa kwenye kifaa.', note: 'Safari za mwanzo ni data ya mfano kwa maonesho.' },
  },
  analysis: {
    en: { title: 'Forecast analysis', intro: 'A transparent view of what would be compared when validated predictions become available.', note: 'There are no model predictions here yet. Sample suitability labels must not be treated as AI output.' },
    sw: { title: 'Uchambuzi wa Utabiri', intro: 'Muonekano wa ulinganisho utakaotumika pale utabiri uliothibitishwa utakapopatikana.', note: 'Bado hakuna utabiri wa modeli hapa. Alama za mfano si matokeo ya AI.' },
  },
  notifications: {
    en: { title: 'Notifications', intro: 'Example reminders shown locally in this demo.', note: 'No official safety alerts or SMS notifications are connected.' },
    sw: { title: 'Arifa', intro: 'Vikumbusho vya mfano vinavyoonyeshwa kwenye app hii.', note: 'Hakuna tahadhari rasmi za usalama au SMS zilizounganishwa.' },
  },
  help: {
    en: { title: 'Help and guidance', intro: 'Quick answers about the demo and its data.', note: 'For real emergencies, contact local marine safety authorities.' },
    sw: { title: 'Msaada', intro: 'Majibu mafupi kuhusu mfumo wa mfano na data yake.', note: 'Kwa dharura halisi, wasiliana na mamlaka za usalama wa bahari.' },
  },
}

const DEMO_SAFETY_CHECKS = {
  en: ['Check official marine notices', 'Life jackets ready for everyone', 'Water, fuel and phone packed', 'Share destination and return time'],
  sw: ['Kagua matangazo rasmi ya baharini', 'Jaketi za kujiokoa zipo kwa wote', 'Maji, mafuta na simu vimeandaliwa', 'Mjulishe mtu unakoenda na muda wa kurudi'],
}

function loadRecords<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value as T[] : []
  } catch { return [] }
}

function saveRecords<T>(key: string, records: T[]): void {
  try { localStorage.setItem(key, JSON.stringify(records)) } catch { /* Keep the form usable if storage is unavailable. */ }
}

export function DemoModulePage({ page, model, onNotice }: { page: ModuleId; model: AppState; onNotice: (message: string) => void }) {
  const language = model.language.code
  const copy = COPY[page][language]
  return <div className="module-page"><div className="page-heading"><div><span className="eyebrow">{language === 'sw' ? 'MFANO WA MFUMO' : 'PRODUCT DEMO'}</span><h1>{copy.title}</h1><p>{copy.intro}</p></div></div><div className="demo-notice"><span className="demo-badge">{language === 'sw' ? 'DATA YA MFANO' : 'DEMO DATA'}</span><p>{copy.note}</p></div>
    {page === 'safety' ? <SafetyModule language={language} onNotice={onNotice} /> : null}
    {page === 'prediction' ? <PredictionModule model={model} /> : null}
    {page === 'bestTime' ? <BestTimeModule language={language} /> : null}
    {page === 'plan' ? <TripPlanModule model={model} onNotice={onNotice} /> : null}
    {page === 'catches' ? <CatchRecordsModule model={model} /> : null}
    {page === 'weather' ? <WeatherModule model={model} /> : null}
    {page === 'markets' ? <DirectoryModule kind="markets" model={model} /> : null}
    {page === 'buyers' ? <DirectoryModule kind="buyers" model={model} /> : null}
    {page === 'prices' ? <PricesModule language={language} /> : null}
    {page === 'sales' ? <SalesModule language={language} /> : null}
    {page === 'reports' ? <ReportsModule model={model} /> : null}
    {page === 'analysis' ? <AnalysisModule language={language} model={model} /> : null}
    {page === 'notifications' ? <NotificationsModule language={language} onNotice={onNotice} /> : null}
    {page === 'help' ? <HelpModule language={language} /> : null}
  </div>
}

function ModuleCard({ icon, title, value, detail }: { icon: ReactNode; title: string; value: string; detail: string }) {
  return <article className="module-card"><span className="module-card-icon">{icon}</span><div><span className="module-card-title">{title}</span><strong>{value}</strong><small>{detail}</small></div><span className="summary-demo">DEMO</span></article>
}

function SafetyModule({ language, onNotice }: { language: Language['code']; onNotice: (message: string) => void }) {
  const [checked, setChecked] = useState([false, false, false, false])
  const checks = DEMO_SAFETY_CHECKS[language]
  const complete = checked.every(Boolean)
  return <div className="module-grid"><section className="module-panel"><div className="section-heading"><div><span className="eyebrow">{language === 'sw' ? 'KABLA YA KUONDOKA' : 'BEFORE DEPARTURE'}</span><h2>{language === 'sw' ? 'Ukaguzi wa usalama' : 'Departure safety check'}</h2></div><ShieldCheck /></div><div className="module-checks">{checks.map((check, index) => <label className="checklist-item" key={check}><input type="checkbox" checked={checked[index]} onChange={() => setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} /><span>{check}</span></label>)}</div><p className="module-note">{language === 'sw' ? 'Hii si alama ya usalama. Fuata taarifa rasmi na uamuzi wa mvuvi.' : 'This is not a safety rating. Follow official notices and the fisher’s judgement.'}</p><button type="button" className="button button-primary" disabled={!complete} onClick={() => onNotice(language === 'sw' ? 'Ukaguzi wa maandalizi umekamilika.' : 'Preparation checklist complete.')}>{language === 'sw' ? 'Thibitisha ukaguzi' : 'Confirm checklist'}<Check size={16} /></button></section><ModuleCard icon={<ShieldCheck />} title={language === 'sw' ? 'Kipaumbele' : 'Priority'} value={language === 'sw' ? 'Taarifa rasmi' : 'Official notices'} detail={language === 'sw' ? 'Kagua kabla ya safari' : 'Check before departure'} /></div>
}

function PredictionModule({ model }: { model: AppState }) {
  const sw = model.language.code === 'sw'
  const zones = getZonesByIsland(model.island)
  const factorText = sw ? 'Sababu za mfano: eneo na aina za samaki zilizowekwa kwenye dataset.' : 'Example factors: demo zone and species entries in the mock dataset.'
  return <><div className="module-grid">{zones.map((zone) => <article className="module-panel" key={zone.id}><div className="section-heading"><div><span className="eyebrow">{sw ? 'MATOKEO YA MFANO' : 'ILLUSTRATIVE OUTPUT'}</span><h2>{zone.name}</h2></div><Fish /></div><p>{sw ? 'Aina za mfano' : 'Illustrative species'}: {zone.species.join(' · ')}</p><p>{sw ? 'Ufaafu wa mfano' : 'Illustrative suitability'}: {zone.suitability}</p><small className="module-note">{factorText}</small><Link className="text-link" to={`/zone/${zone.id}`}>{sw ? 'Angalia eneo' : 'View zone'}<ArrowRight size={15} /></Link></article>)}</div><p className="module-note">{sw ? 'Hakuna modeli ya AI iliyounganishwa. Hizi si alama za uhakika wala utabiri wa samaki.' : 'No AI model is connected. These are not confidence scores or fish forecasts.'}</p></>
}

function BestTimeModule({ language }: { language: Language['code'] }) {
  const sw = language === 'sw'
  const windows = sw ? [['05:30–07:00', 'Asubuhi', 'Mfano wa kupanga'], ['07:00–09:30', 'Asubuhi', 'Mfano wa kupanga'], ['15:30–17:00', 'Jioni', 'Mfano wa kupanga']] : [['05:30–07:00', 'Morning', 'Planning example'], ['07:00–09:30', 'Morning', 'Planning example'], ['15:30–17:00', 'Afternoon', 'Planning example']]
  return <div className="module-grid">{windows.map(([time, period, note]) => <ModuleCard key={time} icon={<Clock3 />} title={period} value={time} detail={note} />)}<section className="module-panel"><h2>{sw ? 'Kwa nini muda huu?' : 'Why these times?'}</h2><p>{sw ? 'Vipindi hivi vimewekwa kwa mfano tu. Mfumo haujapima mawimbi, mawimbi ya maji, au mwenendo wa samaki.' : 'These windows are placeholders. The app has not analyzed tides, wave conditions, or fish movement.'}</p></section></div>
}

function TripPlanModule({ model, onNotice }: { model: AppState; onNotice: (message: string) => void }) {
  const sw = model.language.code === 'sw'
  const key = 'smartOcean.tripPlans'
  const [plans, setPlans] = useState<TripPlan[]>(() => loadRecords<TripPlan>(key))
  const [date, setDate] = useState('')
  const [departureTime, setDepartureTime] = useState('05:30')
  const [destination, setDestination] = useState('')
  const [targetSpecies, setTargetSpecies] = useState('Tuna')
  const [vessel, setVessel] = useState('')
  const [crew, setCrew] = useState('1')
  const [fuelBudget, setFuelBudget] = useState('')
  const areas = FISHING_AREAS.filter((area) => area.island === model.island)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const plan: TripPlan = { id: crypto.randomUUID(), date, departureTime, destination, targetSpecies, vessel: vessel.trim(), crew: Number(crew), fuelBudget: Number(fuelBudget) }
    const updated = [plan, ...plans]
    setPlans(updated); saveRecords(key, updated)
    onNotice(sw ? 'Mpango wa safari umehifadhiwa kwenye kifaa.' : 'Trip plan saved on this device.')
    setDate(''); setDestination(''); setVessel(''); setFuelBudget('')
  }
  return <div className="module-grid"><section className="module-panel"><form className="form-stack" onSubmit={submit}><div className="form-grid"><label className="field"><span>{sw ? 'Tarehe ya safari' : 'Trip date'}</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><label className="field"><span>{sw ? 'Muda wa kuondoka' : 'Planned departure'}</span><input type="time" value={departureTime} onChange={(event) => setDepartureTime(event.target.value)} required /></label></div><div className="form-grid"><label className="field"><span>{sw ? 'Eneo lengwa' : 'Destination'}</span><select value={destination} onChange={(event) => setDestination(event.target.value)} required><option value="">{sw ? 'Chagua eneo' : 'Choose an area'}</option>{areas.map((area) => <option key={area.id}>{area.name}</option>)}</select></label><label className="field"><span>{sw ? 'Aina ya samaki lengwa' : 'Target species'}</span><select value={targetSpecies} onChange={(event) => setTargetSpecies(event.target.value)}>{['Tuna', 'Snapper', 'Kingfish', 'Grouper', 'Other'].map((species) => <option key={species}>{species}</option>)}</select></label></div><div className="form-grid"><label className="field"><span>{sw ? 'Aina ya chombo' : 'Vessel type'}</span><input value={vessel} onChange={(event) => setVessel(event.target.value)} placeholder={sw ? 'Mfano: boti ya nyuzi' : 'e.g. dhow'} required /></label><label className="field"><span>{sw ? 'Idadi ya watu' : 'Crew count'}</span><input type="number" min="1" max="30" value={crew} onChange={(event) => setCrew(event.target.value)} required /></label></div><label className="field"><span>{sw ? 'Bajeti ya mafuta (TZS, makadirio)' : 'Fuel budget (TZS, estimate)'}</span><input type="number" min="0" step="500" value={fuelBudget} onChange={(event) => setFuelBudget(event.target.value)} required /></label><p className="module-note">{sw ? 'Hifadhi ya mfano tu. Makadirio ya gharama si bei ya sasa.' : 'Demo storage only. Cost estimate is not a current market price.'}</p><button type="submit" className="button button-primary">{sw ? 'Hifadhi mpango' : 'Save plan'}<Check size={16} /></button></form></section><section className="module-panel"><div className="section-heading"><div><span className="eyebrow">{sw ? 'KWENYE KIFAA HIKI' : 'ON THIS DEVICE'}</span><h2>{sw ? 'Mipango iliyohifadhiwa' : 'Saved plans'}</h2></div><span className="history-count">{plans.length}</span></div>{plans.length ? plans.map((plan) => <div className="module-list-row" key={plan.id}><strong>{plan.destination}</strong><span>{plan.date} · {plan.departureTime}</span><small>{plan.targetSpecies} · {plan.crew} · TZS {plan.fuelBudget.toLocaleString()}</small></div>) : <p className="module-note">{sw ? 'Bado hakuna mpango uliohifadhiwa.' : 'No saved plans yet.'}</p>}</section></div>
}

function CatchRecordsModule({ model }: { model: AppState }) {
  const sw = model.language.code === 'sw'
  return <section className="module-panel"><div className="section-heading"><div><span className="eyebrow">{sw ? 'REKODI ZILIZOHIFADHIWA' : 'SAVED RECORDS'}</span><h2>{model.catches.length} {sw ? 'rekodi' : 'records'}</h2></div><Link to="/trips" className="text-link">{sw ? 'Safari zangu' : 'My trips'}<ArrowRight size={15} /></Link></div>{model.catches.length ? model.catches.map((record: CatchRecord) => <div className="module-list-row" key={record.id}><strong>{record.species} · {record.weightKg} kg</strong><span>{record.zoneName} · {record.date}</span>{record.notes ? <small>{record.notes}</small> : null}</div>) : <p className="module-note">{sw ? 'Rekodi za samaki huongezwa kwenye ukurasa wa Safari baada ya kuanza safari.' : 'Catch records are added from Trips after starting a trip.'}</p>}</section>
}

function WeatherModule({ model }: { model: AppState }) {
  const sw = model.language.code === 'sw'
  return <><div className="module-grid"><ModuleCard icon={<Wind />} title={sw ? 'Upepo' : 'Wind'} value="12 km/h" detail={sw ? 'Kasi ya mfano' : 'Illustrative value'} /><ModuleCard icon={<Waves />} title={sw ? 'Mawimbi' : 'Waves'} value="1.1 m" detail={sw ? 'Urefu wa mfano' : 'Illustrative value'} /><ModuleCard icon={<CloudSun />} title={sw ? 'Mvua' : 'Rain'} value={sw ? 'Haijapimwa' : 'Not measured'} detail={sw ? 'Hakuna data live' : 'No live data'} /><ModuleCard icon={<MapPin />} title={sw ? 'Kisiwa' : 'Island'} value={model.island} detail="DEMO" /></div><p className="module-note">{sw ? 'Hakuna muda wa mwisho wa sasisho kwa sababu hakuna chanzo cha utabiri kilichounganishwa.' : 'No last-updated time is shown because no forecast source is connected.'}</p></>
}

function DirectoryModule({ kind, model }: { kind: 'markets' | 'buyers'; model: AppState }) {
  const sw = model.language.code === 'sw'
  const items = kind === 'markets'
    ? [{ name: sw ? 'Soko la samaki la mfano · Malindi' : 'Demo fish market · Malindi', place: 'Unguja', detail: sw ? 'Saa na huduma hazijathibitishwa' : 'Hours and services unverified' }, { name: sw ? 'Soko la mfano · Mkoani' : 'Demo market · Mkoani', place: 'Pemba', detail: sw ? 'Rekodi ya kuonyesha tu' : 'Illustrative entry only' }]
    : [{ name: sw ? 'Mnunuzi wa mfano 01' : 'Demo buyer 01', place: 'Unguja', detail: sw ? 'Anapokea jodari · oda ya mfano' : 'Tuna interest · sample inquiry' }, { name: sw ? 'Mnunuzi wa mfano 02' : 'Demo buyer 02', place: 'Pemba', detail: sw ? 'Anapokea samaki mchanganyiko' : 'Mixed fish · sample inquiry' }]
  const visible = items.filter((item) => model.island === item.place)
  return <section className="module-panel"><div className="section-heading"><div><span className="eyebrow">{sw ? 'ORODHA YA MFANO' : 'DEMO DIRECTORY'}</span><h2>{sw ? 'Karibu nawe' : 'Near your selected island'}</h2></div></div>{visible.map((item) => <div className="module-list-row" key={item.name}><strong><MapPin size={15} />{item.name}</strong><span>{item.place} · {item.detail}</span>{kind === 'buyers' ? <Link to="/prices" className="text-link">{sw ? 'Angalia bei za mfano' : 'View sample prices'}<ArrowRight size={14} /></Link> : null}</div>)}<p className="module-note">{sw ? 'Hakuna biashara au mnunuzi aliyethibitishwa ndani ya MVP hii.' : 'No business or buyer is verified in this MVP.'}</p></section>
}

function PricesModule({ language }: { language: Language['code'] }) {
  const sw = language === 'sw'
  const offers = [{ buyer: sw ? 'Mnunuzi wa mfano A' : 'Demo buyer A', species: sw ? 'Jodari' : 'Tuna', price: 8000 }, { buyer: sw ? 'Mnunuzi wa mfano B' : 'Demo buyer B', species: sw ? 'Jodari' : 'Tuna', price: 9000 }, { buyer: sw ? 'Mnunuzi wa mfano C' : 'Demo buyer C', species: sw ? 'Pono' : 'Snapper', price: 6500 }]
  return <section className="module-panel"><div className="section-heading"><div><span className="eyebrow">TZS · {sw ? 'DATA YA MFANO' : 'DEMO DATA'}</span><h2>{sw ? 'Bei za kubuni' : 'Illustrative offers'}</h2></div></div>{offers.map((offer) => <div className="module-list-row module-price-row" key={offer.buyer}><strong>{offer.buyer}</strong><span>{offer.species}</span><b>TZS {offer.price.toLocaleString()} / kg</b></div>)}</section>
}

function SalesModule({ language }: { language: Language['code'] }) {
  const sw = language === 'sw'
  const [sales, setSales] = useState<SaleRecord[]>(() => loadRecords<SaleRecord>('smartOcean.sales'))
  const [species, setSpecies] = useState('Tuna')
  const [weight, setWeight] = useState('')
  const [price, setPrice] = useState('')
  const [buyer, setBuyer] = useState('')
  const [error, setError] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (Number(weight) <= 0 || Number(price) <= 0) { setError(sw ? 'Weka uzito na bei inayozidi sifuri.' : 'Enter a weight and price above zero.'); return }
    const record: SaleRecord = { id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), species, weightKg: Number(weight), pricePerKg: Number(price), buyer: buyer.trim() || (sw ? 'Mnunuzi wa mfano' : 'Demo buyer') }
    const next = [record, ...sales]
    setSales(next); saveRecords('smartOcean.sales', next); setError(''); setWeight(''); setPrice(''); setBuyer('')
  }
  return <div className="module-grid"><section className="module-panel"><form className="form-stack" onSubmit={submit}><label className="field"><span>{sw ? 'Aina ya samaki' : 'Species'}</span><select value={species} onChange={(event) => setSpecies(event.target.value)}>{['Tuna', 'Snapper', 'Kingfish', 'Grouper', 'Other'].map((item) => <option key={item}>{item}</option>)}</select></label><div className="form-grid"><label className="field"><span>{sw ? 'Uzito (kg)' : 'Weight (kg)'}</span><input type="number" min="0.01" step="0.01" value={weight} onChange={(event) => setWeight(event.target.value)} required /></label><label className="field"><span>{sw ? 'Bei kwa kg (TZS)' : 'Price per kg (TZS)'}</span><input type="number" min="100" step="100" value={price} onChange={(event) => setPrice(event.target.value)} required /></label></div><label className="field"><span>{sw ? 'Mnunuzi' : 'Buyer'}</span><input value={buyer} onChange={(event) => setBuyer(event.target.value)} placeholder={sw ? 'Jina (si lazima)' : 'Name (optional)'} /></label>{error ? <p className="form-error">{error}</p> : null}<button className="button button-primary" type="submit">{sw ? 'Hifadhi mauzo' : 'Save sale'}<Check size={15} /></button></form></section><section className="module-panel"><h2>{sw ? 'Mauzo yaliyorekodiwa' : 'Recorded sales'}</h2>{sales.map((sale) => <div className="module-list-row" key={sale.id}><strong>{sale.species} · {sale.weightKg} kg</strong><span>{sale.buyer} · {sale.date}</span><b>TZS {(sale.weightKg * sale.pricePerKg).toLocaleString()}</b></div>)}</section></div>
}

function ReportsModule({ model }: { model: AppState }) {
  const sw = model.language.code === 'sw'
  const count = model.catches.length
  const total = model.catches.reduce((sum, record) => sum + record.weightKg, 0)
  const completed = model.trips.filter((trip) => trip.status === 'completed').length
  return <><div className="module-grid"><ModuleCard icon={<Anchor />} title={sw ? 'Safari zilizokamilika' : 'Completed trips'} value={String(completed)} detail={sw ? 'Kutoka rekodi zako' : 'From your saved records'} /><ModuleCard icon={<Fish />} title={sw ? 'Samaki waliorekodiwa' : 'Recorded catch'} value={`${total.toFixed(1)} kg`} detail={`${count} ${sw ? 'rekodi' : 'records'}`} /><ModuleCard icon={<Compass />} title={sw ? 'Maeneo' : 'Zones'} value={String(new Set(model.trips.map((trip) => trip.destination)).size)} detail={sw ? 'Kwenye historia' : 'In trip history'} /></div><section className="module-panel"><h2>{sw ? 'Matokeo kwa aina' : 'Catch by species'}</h2>{Array.from(model.catches.reduce((totals, record) => totals.set(record.species, (totals.get(record.species) ?? 0) + record.weightKg), new Map<string, number>())).map(([species, amount]) => <div className="module-list-row" key={species}><strong>{species}</strong><b>{amount.toFixed(1)} kg</b></div>)}{!count ? <p className="module-note">{sw ? 'Rekodi safari ili kuanza ripoti.' : 'Record trips to populate reports.'}</p> : null}</section></>
}

function AnalysisModule({ language, model }: { language: Language['code']; model: AppState }) {
  const sw = language === 'sw'
  return <div className="module-grid"><section className="module-panel"><span className="eyebrow">{sw ? 'UCHAMBUZI WA MFANO' : 'DEMO ANALYSIS'}</span><h2>{sw ? 'Ulinganisho wa baadaye' : 'Future comparison'}</h2><p>{sw ? `Rekodi ${model.catches.length} za samaki zipo kwenye kifaa hiki. MVP hii haina matokeo halisi ya modeli ya kutabiri.` : `${model.catches.length} catch records are stored on this device. This MVP has no real model forecast outputs.`}</p><div className="module-comparison"><span>{sw ? 'Utabiri' : 'Prediction'}<b>{sw ? 'Haipo' : 'Unavailable'}</b></span><ArrowRight size={17} /><span>{sw ? 'Matokeo ya safari' : 'Trip outcome'}<b>{sw ? `${model.catches.length} rekodi` : `${model.catches.length} records`}</b></span></div></section><ModuleCard icon={<Eye />} title={sw ? 'Uwazi wa data' : 'Data transparency'} value={sw ? 'Inahitajika' : 'Required'} detail={sw ? 'Chanzo · muda · modeli' : 'Source · timestamp · model'} /></div>
}

function NotificationsModule({ language, onNotice }: { language: Language['code']; onNotice: (message: string) => void }) {
  const sw = language === 'sw'
  const [dismissed, setDismissed] = useState<string[]>([])
  const notices = [{ id: 'safety', title: sw ? 'Kumbusho la usalama' : 'Safety reminder', detail: sw ? 'Kagua taarifa rasmi kabla ya safari.' : 'Check official notices before departure.' }, { id: 'catch', title: sw ? 'Kamilisha rekodi' : 'Complete your record', detail: sw ? 'Hifadhi uzito na aina za samaki baada ya safari.' : 'Save catch weights and species after a trip.' }, { id: 'demo', title: sw ? 'Data ya mfano' : 'Demo data', detail: sw ? 'Utabiri na bei si taarifa live.' : 'Forecasts and prices are not live.' }]
  return <section className="module-panel">{notices.filter((item) => !dismissed.includes(item.id)).map((item) => <div className="module-list-row" key={item.id}><strong><Bell size={15} />{item.title}</strong><span>{item.detail}</span><button type="button" className="text-button" onClick={() => { setDismissed((current) => [...current, item.id]); onNotice(sw ? 'Arifa imefichwa.' : 'Notification dismissed.') }}>{sw ? 'Ficha' : 'Dismiss'}</button></div>)}</section>
}

function HelpModule({ language }: { language: Language['code'] }) {
  const sw = language === 'sw'
  const questions = sw ? [['Data hii ni ya moja kwa moja?', 'Hapana. Hii ni demo; kagua vyanzo rasmi.'], ['Naanzaje safari?', 'Chagua eneo kwenye ramani, kamilisha checklist, kisha anza safari ya mfano.'], ['Rekodi zangu zinahifadhiwa wapi?', 'Kwenye browser ya kifaa hiki kupitia localStorage.']] : [['Is this live data?', 'No. This is a demo; consult official sources.'], ['How do I start a trip?', 'Choose a map zone, complete the safety checklist, then start a demo trip.'], ['Where are records stored?', 'In this device browser using localStorage.']]
  return <section className="module-panel help-faq">{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}<p className="module-note">{sw ? 'Kwa dharura baharini, wasiliana na mamlaka husika.' : 'For marine emergencies, contact the relevant authorities.'}</p></section>
}

export type { ModuleId }
