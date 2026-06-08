import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { translations } from '../i18n/translations';

const STORAGE_KEY = 'mai_locale';

const LanguageContext = createContext(null);

function makeT(dict) {
  return (path, vars) => {
    const keys = path.split('.');
    let cur = dict;
    for (const k of keys) {
      if (cur == null || typeof cur !== 'object') return path;
      cur = cur[k];
    }
    if (typeof cur !== 'string') return path;
    if (vars && typeof vars === 'object') {
      return cur.replace(/\{\{(\w+)\}\}/g, (_, name) =>
        vars[name] !== undefined && vars[name] !== null ? String(vars[name]) : `{{${name}}}`
      );
    }
    return cur;
  };
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'fr') return saved;
    return 'fr';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l) => {
    if (l === 'fr' || l === 'en') setLocaleState(l);
  }, []);

  const t = useMemo(() => makeT(translations[locale] || translations.fr), [locale]);

  const priceLocale = locale === 'en' ? 'en-GB' : 'fr-FR';

  const value = useMemo(
    () => ({ locale, setLocale, t, priceLocale }),
    [locale, setLocale, t, priceLocale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
