import { useState, useEffect, useCallback } from 'react';
import { INITIAL_STATE } from '../lib/storage';
import { toggleLanguage, getTranslation } from '../lib/translations';
import type { CatchRecord, FishingZone, Language, Station, TripRecord } from '../types/index';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(INITIAL_STATE.language);

  useEffect(() => {
    localStorage.setItem('smartOcean.language', JSON.stringify(language));
  }, [language]);

  const switchLanguage = useCallback(() => {
    const newLang = toggleLanguage(language);
    setLanguage(newLang);
  }, [language]);

  return { language, switchLanguage };
};

export const useStation = () => {
  const [station, setStation] = useState<Station>(INITIAL_STATE.station);

  useEffect(() => {
    localStorage.setItem('smartOcean.station', JSON.stringify(station));
  }, [station]);

  const updateStation = useCallback((newStation: Station) => {
    setStation(newStation);
  }, []);

  return { station, updateStation };
};

export const useIsland = () => {
  const [island, setIsland] = useState<'Unguja' | 'Pemba'>(INITIAL_STATE.island);

  useEffect(() => {
    localStorage.setItem('smartOcean.island', island);
  }, [island]);

  const updateIsland = useCallback((newIsland: 'Unguja' | 'Pemba') => {
    setIsland(newIsland);
  }, []);

  return { island, updateIsland };
};

export const useTrips = () => {
  const [trips, setTrips] = useState<TripRecord[]>(INITIAL_STATE.trips);

  useEffect(() => {
    localStorage.setItem('smartOcean.trips', JSON.stringify(trips));
  }, [trips]);

  return { trips, setTrips };
};

export const useCatches = () => {
  const [catches, setCatches] = useState<CatchRecord[]>(INITIAL_STATE.catches);

  useEffect(() => {
    localStorage.setItem('smartOcean.catches', JSON.stringify(catches));
  }, [catches]);

  return { catches, setCatches };
};

export const useActiveTrip = () => {
  const [activeTrip, setActiveTrip] = useState<TripRecord | null>(INITIAL_STATE.activeTrip);

  useEffect(() => {
    localStorage.setItem('smartOcean.activeTrip', JSON.stringify(activeTrip));
  }, [activeTrip]);

  const startNewTrip = useCallback((trip: TripRecord) => {
    setActiveTrip(trip);
  }, []);

  const endTrip = useCallback(() => {
    setActiveTrip(null);
  }, []);

  const updateCatch = useCallback((catchRecord: CatchRecord) => {
    if (!activeTrip) return;
    
    const existingCatchIndex = activeTrip.catches.findIndex(
      c => c.species === catchRecord.species && c.date === catchRecord.date
    );

    let updatedCatches;
    if (existingCatchIndex >= 0) {
      // Update existing catch
      updatedCatches = [...activeTrip.catches];
      updatedCatches[existingCatchIndex] = catchRecord;
    } else {
      // Add new catch
      updatedCatches = [...(activeTrip.catches || []), catchRecord];
    }

    setActiveTrip({
      ...activeTrip,
      catches: updatedCatches,
    });
  }, [activeTrip]);

  return { activeTrip, startNewTrip, endTrip, updateCatch };
};

export const useTranslation = () => {
  const { language, switchLanguage } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  return { t, language, switchLanguage };
};

export type { Language, Station, FishingZone, TripRecord, CatchRecord };