"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GuestData {
  id: string;
  name: string;
  tableNumber: number;
}

interface GuestContextType {
  guest: GuestData | null;
  setGuest: (guest: GuestData) => void;
  clearGuest: () => void;
  isRegistered: boolean;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

const STORAGE_KEY = "nima-saba-guest";

export function GuestProvider({ children }: { children: ReactNode }) {
  const [guest, setGuestState] = useState<GuestData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGuestState(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  const setGuest = (data: GuestData) => {
    setGuestState(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearGuest = () => {
    setGuestState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!loaded) return null;

  return (
    <GuestContext.Provider value={{ guest, setGuest, clearGuest, isRegistered: !!guest }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuest must be inside GuestProvider");
  return ctx;
}
