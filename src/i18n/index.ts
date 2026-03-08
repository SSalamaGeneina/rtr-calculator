import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ar from './ar.json'
import { RTR_STORAGE_KEY } from '../lib/constants'

// Get language from URL params or default to English
const urlParams = new URLSearchParams(window.location.search)
const langParam = urlParams.get('lang')

function getPersistedLanguage(): 'en' | 'ar' | null {
  try {
    const raw = window.localStorage.getItem(RTR_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { language?: string }
    return parsed.language === 'ar' ? 'ar' : parsed.language === 'en' ? 'en' : null
  } catch {
    return null
  }
}

const persistedLanguage = getPersistedLanguage()
const defaultLang = langParam === 'ar' || langParam === 'en'
  ? (langParam as 'en' | 'ar')
  : (persistedLanguage ?? 'en')

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: defaultLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
