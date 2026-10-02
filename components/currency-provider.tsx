"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Currency = "ZAR" | "USD" | "EUR" | "GBP";
type CurrencyContextValue = { currency: Currency; setCurrency: (currency: Currency) => void; formatPrice: (price: number) => string };
const currencySettings = {
  ZAR: { locale: "en-ZA", rate: 1 },
  USD: { locale: "en-US", rate: 0.055 },
  EUR: { locale: "en-IE", rate: 0.05 },
  GBP: { locale: "en-GB", rate: 0.043 }
} as const;
const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("ZAR");
  useEffect(() => { const saved = window.localStorage.getItem("apparel-plantra-currency"); if (saved && saved in currencySettings) setCurrency(saved as Currency); }, []);
  useEffect(() => { window.localStorage.setItem("apparel-plantra-currency", currency); }, [currency]);
  const value = useMemo(() => ({ currency, setCurrency, formatPrice: (price: number) => new Intl.NumberFormat(currencySettings[currency].locale, { style: "currency", currency, maximumFractionDigits: currency === "ZAR" ? 0 : 2 }).format(price * currencySettings[currency].rate) }), [currency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() { const context = useContext(CurrencyContext); if (!context) throw new Error("useCurrency must be used inside CurrencyProvider"); return context; }
