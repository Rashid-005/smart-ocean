import type { Language } from '../types/index';

const translations: Record<'en' | 'sw', Record<string, string | string[]>> = {
  en: {
    // Welcome screen
    welcome: 'Welcome to Smart Ocean',
    tagline: 'Smarter Fishing, Better Decisions',
    chooseLanguage: 'Choose language',
    getStarted: 'Get Started',

    // Language selection
    kiswahili: 'Kiswahili',
    english: 'English',

    // Island selection
    selectIsland: 'Select Your Island',
    unguja: 'Unguja',
    pemba: 'Pemba',

    // Station selection
    selectStation: 'Choose Departure Station',
    malindi: 'Malindi',
    nungwi: 'Nungwi',
    matemwe: 'Matemwe',
    chakeChake: 'Chake Chake',
    wete: 'Wete',
    mkoani: 'Mkoani',

    // Home dashboard
    home: 'Home',
    greeting: 'Karibu, Mvuvi',
    islandStation: 'Unguja · Malindi',
    demoDataBadge: 'DEMO DATA',
    seaCondition: 'Sea Condition',
    wind: 'Wind',
    visibility: 'Visibility',
    distance: 'Distance',
    moderate: 'Moderate',
    good: 'Good',
    twelveKmH: '12 km/h',
    oceanSummaryTitle: 'Ocean Summary',
    safetyFirst: 'Safety First',
    checkWeather: 'Check weather conditions',
    lifeJackets: 'Carry life jackets',
    drinkingWater: 'Carry drinking water',
    checkFuel: 'Check fuel',
    tellSomeone: 'Tell someone your destination',

    // Fishing map
    fishingZones: 'Fishing Zones',
    mapLegend: 'Legend',
    higherSuitability: 'Higher illustrative suitability',
    moderateSuitability: 'Moderate illustrative suitability',
    lowerSuitability: 'Lower illustrative suitability',
    demoDataNote: 'Demo data only — marker colors do not guarantee fish presence or safe sea conditions.',

    // Zone details
    zoneDetails: 'Zone Details',
    fromDeparture: 'from departure',
    kmAway: 'km away',
    viewZone: 'View Zone',
    suitability: 'Suitability',
    species: 'Fish Species',
    waveHeight: 'Wave Height',
    temperature: 'Water Temperature',
    visibilityLabel: 'Visibility',
    demoData: 'DEMO DATA',
    demo: 'DEMO',

    // Safety checklist
    safetyChecklist: 'Safety Checklist',
    beforeYouGo: 'Before You Go',
    lifeJacket: 'Life jacket available',
    fuelChecked: 'Fuel checked',
    drinkingWaterPacked: 'Drinking water packed',
    weatherChecked: 'Weather checked',
    destinationShared: 'Destination shared',
    completeChecklist: 'Complete the safety checklist before starting the demo trip.',
    startTrip: 'Start Trip',

    // Trip management
    myTrips: 'My Trips',
    activeTrip: 'Active Trip',
    startTripButton: 'Start Trip',
    endTripButton: 'End Trip',
    recordCatch: 'Record Catch',
    catchRecorded: 'Catch recorded successfully',
    fishWeight: 'Fish Weight',
    kg: 'kg',
    saveRecord: 'Save Record',
    tripHistory: 'Trip History',
    totalTrips: 'Total trips',
    totalCatch: 'Total catch',

    // Catch form
    fishSpecies: 'Fish species',
    speciesDropdown: ['Tuna', 'Snapper', 'Kingfish', 'Grouper', 'Other'],
    weight: 'Weight',
    weightValidation: 'Please enter the catch weight.',
    weightMustBeGreater: 'Weight must be greater than zero.',
    date: 'Date',
    fishingZone: 'Fishing zone',
    optionalPhoto: 'Optional photo',
    preview: 'Preview',
    saveCatch: 'Save Catch',
    addNotes: 'Add any notes about today\'s trip…',
    catchSuccess: 'Catch recorded successfully',

    // Trip history
    noTripsRecorded: 'No trips recorded yet',
    startYourFirstTrip: 'Start Your First Trip',
    tripCardDestination: 'Destination',
    tripCardDeparture: 'Departure',
    tripCardStatus: 'Status',
    tripCardCatch: 'Catch',
    tripCardTotalWeight: 'Total weight',

    // Profile and settings
    profile: 'Profile',
    settings: 'Settings',
    languagePreference: 'Language preference',
    changeLanguage: 'Change language',
    islandPreference: 'Island preference',
    departureStation: 'Departure station',
    accountSettings: 'Account settings',
    helpSupport: 'Help & support',
    applicationInfo: 'Application information',
    ussdSmsAccess: 'USSD/SMS access',
    logOut: 'Log out',
    userName: 'User',
    phoneNumber: 'Phone number',
    avatar: 'Avatar',

    // Empty states
    emptyStateTitle: 'No trips recorded yet',
    emptyStateDescription: 'Hakuna safari zilizorekodiwa bado',
    startFirstTrip: 'Start Your First Trip',

    // Validation
    required: 'Required',
    invalidWeight: 'Weight must be greater than zero',

    // TZS cost
    estimatedTripCost: 'Estimated trip cost',
    tzs: 'TZS',
    illustrativeEstimate: 'Illustrative estimate — DEMO DATA',

    // USSD/SMS
    ussdCode: '*152*10#',
    ussdSelectLanguage: 'Select language',
    ussdSelectIsland: 'Select island',
    ussdGetFishingInfo: 'Get fishing information',
    ussdTripCatch: 'Trip and catch services',

    // Generic
    back: 'Back',
    continue: 'Continue',
    select: 'Select',
    dismiss: 'Dismiss',
  },

  sw: {
    // Welcome screen
    welcome: 'Smart Ocean',
    tagline: 'Bahari Yetu, Maisha Yetu',
    chooseLanguage: 'Chagua lugha',
    getStarted: 'Anza',

    // Language selection
    kiswahili: 'Kiswahili',
    english: 'English',

    // Island selection
    selectIsland: 'Chagua kisiwa',
    unguja: 'Unguja',
    pemba: 'Pemba',

    // Station selection
    selectStation: 'Chagua kituo cha kuanzia',
    malindi: 'Malindi',
    nungwi: 'Nungwi',
    matemwe: 'Matemwe',
    chakeChake: 'Chake Chake',
    wete: 'Wete',
    mkoani: 'Mkoani',

    // Home dashboard
    home: 'Nyumbani',
    greeting: 'Karibu, Mvuvi',
    islandStation: 'Unguja · Malindi',
    demoDataBadge: 'DEMO DATA',
    seaCondition: 'Hali ya Bahari',
    wind: 'Flu',
    visibility: 'Ulinganaji',
    distance: 'Eneo',
    moderate: 'Moderate',
    good: 'Naicho',
    twelveKmH: '12 km/h',
    oceanSummaryTitle: 'Hitimisho ya Bahari',
    safetyFirst: 'Usalama Kwanza',
    checkWeather: 'Angalia hali ya hewa',
    lifeJackets: 'Vaa/leta jaketi la kujiokoa',
    drinkingWater: 'Beba maji ya kunywa',
    checkFuel: 'Hakikisha mafuta yanatosha',
    tellSomeone: 'Mjulishe mtu unakoelekea',

    // Fishing map
    fishingZones: 'Engeo ya Uvuvi',
    mapLegend: 'Udhibiti',
    higherSuitability: 'Illustrative suitability: Higher',
    moderateSuitability: 'Illustrative suitability: Moderate',
    lowerSuitability: 'Illustrative suitability: Lower',
    demoDataNote: 'Data ya mfano tu — rangi za marker hazisimami kugonjwa wa samaki au hali ya bahari safi.',

    // Zone details
    zoneDetails: 'Malengo ya Engeo',
    fromDeparture: 'kuchakata',
    kmAway: 'km jange',
    viewZone: 'Angalia Engeo',
    suitability: 'Uvutaji',
    species: 'Aina ya Samaki',
    waveHeight: 'Urefu wa mwanga',
    temperature: 'Unywafi wa Maji',
    visibilityLabel: 'Ulinganaji',
    demoData: 'DATA YA MFANO',
    demo: 'MFANO',

    // Safety checklist
    safetyChecklist: 'Ushikina Usalama',
    beforeYouGo: 'Mapema Umekowapo',
    lifeJacket: 'Jaketi la kujiokoa',
    fuelChecked: 'Mafuta imeteshwa',
    drinkingWaterPacked: 'Maji ya kunywa imebeba',
    weatherChecked: 'Hali ya hewa imelazima',
    destinationShared: 'Mahali yenyewe imeongea',
    completeChecklist: 'Futa sheria za usalama kabla ya anza Safari.',
    startTrip: 'Anza Safari',

    // Trip management
    myTrips: 'Safari Zangu',
    activeTrip: 'Safari Ikiwa',
    startTripButton: 'Anza Safari',
    endTripButton: 'Maliza Safari',
    recordCatch: 'Rekodi Samaki',
    catchRecorded: 'Rekodi inavyofanywa',
    fishWeight: 'Zanzi ya Samaki',
    kg: 'kg',
    saveRecord: 'Hifadhi Rekodi',
    tripHistory: 'Usalama wa Safari',
    totalTrips: 'Safari zote',
    totalCatch: 'Total Catch',

    // Catch form
    fishSpecies: 'Chai ya Samaki',
    speciesDropdown: ['Tuna', 'Snapper', 'Kingfish', 'Grouper', 'Other'],
    weight: 'Uzito',
    weightValidation: 'Tafadhali weka uzito wa samaki.',
    weightMustBeGreater: 'Uzito wa kuongeza 0.',
    date: 'Tarehe',
    fishingZone: 'Engeo ya Uvuvi',
    optionalPhoto: 'Photo optionali',
    preview: 'Jaribio',
    saveCatch: 'Rekodi',
    addNotes: 'Tambua swali za siku hili…',
    catchSuccess: 'Rekodi inayoshewa',

    // Trip history
    noTripsRecorded: 'Hakuna safari zilizorekodiwa bado',
    startYourFirstTrip: 'Anza Safari ya Kwanza',
    tripCardDestination: 'Mahali',
    tripCardDeparture: 'Kituo cha kuanzia',
    tripCardStatus: 'Hali',
    tripCardCatch: 'Samaki',
    tripCardTotalWeight: 'Total weight',

    // Profile and settings
    profile: 'Mipangilio',
    settings: 'Milinganyo',
    languagePreference: 'Uhusiano la lugha',
    changeLanguage: 'Badilisha lugha',
    islandPreference: 'Uhusiano kisiwa',
    departureStation: 'Kituo cha kuanzia',
    accountSettings: 'Milingano ya akaunti',
    helpSupport: 'Bantao na Maambukuko',
    applicationInfo: 'Thamshi ya App',
    ussdSmsAccess: 'USSD/SMS',
    logOut: 'Kwisha',

    // Empty states
    emptyStateTitle: 'Hakuna safari zilizorekodiwa bado',
    emptyStateDescription: 'Hakuna safari zilizorekodiwa bado',
    startFirstTrip: 'Anza Safari ya Kwanza',

    // Validation
    required: 'Required',
    invalidWeight: 'Uzito unabaki 0',

    // TZS cost
    estimatedTripCost: 'Estimated trip cost',
    tzs: 'TZS',
    illustrativeEstimate: 'Estimate ya mfano — DATA YA MFANO',

    // USSD/SMS
    ussdCode: '*152*10#',
    ussdSelectLanguage: 'Chagua lugha',
    ussdSelectIsland: 'Chagua kisiwa',
    ussdGetFishingInfo: 'Ambia maelezo ya uvuvi',
    ussdTripCatch: 'Safari na Rekodi',

    // Generic
    back: 'Back',
    continue: 'Continue',
    select: 'Select',
    dismiss: 'Dismiss',
  },
};

export const getTranslation = (key: string, language: Language): string => {
  const value = translations[language.code][key];
  return typeof value === 'string' ? value : key;
};

export const toggleLanguage = (current: Language): Language => {
  return current.code === 'sw' ? { code: 'en', name: 'English' } : { code: 'sw', name: 'Kiswahili' };
};