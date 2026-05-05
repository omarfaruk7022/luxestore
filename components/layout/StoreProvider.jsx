'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const StoreContext = createContext(null);

export function useStore() {
  return useContext(StoreContext);
}

const CACHE_KEY = 'luxe_store_settings';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const DEFAULT_SETTINGS = {
  storeName: 'My Store',
  tagline: 'Quality products for everyone',
  logo: '',
  activeTemplate: 'luxe',
  colors: {},
  socialLinks: {},
  currencySymbol: '৳',
  freeShippingThreshold: 999,
};

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null; // expired
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

async function fetchSettings() {
  const res = await fetch('/api/settings');
  const json = await res.json();
  if (json.success) return json.settings;
  return null;
}

export default function StoreProvider({ children }) {
  // Start with cache if available — avoids flash/delay on repeat visits
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    return readCache() || DEFAULT_SETTINGS;
  });

  useEffect(() => {
    const cached = readCache();

    if (cached) {
      // Already rendered from cache — inject colors immediately
      injectColors(cached.colors || {});

      // Still refresh in background (stale-while-revalidate)
      fetchSettings().then((fresh) => {
        if (fresh) {
          const merged = { ...DEFAULT_SETTINGS, ...fresh };
          setSettings(merged);
          writeCache(merged);
          injectColors(fresh.colors || {});
        }
      }).catch(() => {});
    } else {
      // No cache — fetch now
      fetchSettings().then((data) => {
        if (data) {
          const merged = { ...DEFAULT_SETTINGS, ...data };
          setSettings(merged);
          writeCache(merged);
          injectColors(data.colors || {});
        }
      }).catch(() => {});
    }
  }, []);

  return (
    <StoreContext.Provider value={{ settings, setSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

function injectColors(colors = {}) {
  const map = {
    primary:    '--color-primary',
    secondary:  '--color-secondary',
    accent:     '--color-accent',
    background: '--color-background',
    foreground: '--color-foreground',
    muted:      '--color-muted',
    border:     '--color-border',
  };
  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(map)) {
    if (colors[key]) root.style.setProperty(cssVar, colors[key]);
    else root.style.removeProperty(cssVar);
  }
}
