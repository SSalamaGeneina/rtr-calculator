import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ar from './ar.json'

// Get language from URL params or default to English
const urlParams = new URLSearchParams(window.location.search)
const langParam = urlParams.get('lang')
const defaultLang = langParam === 'ar' ? 'ar' : 'en'

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
