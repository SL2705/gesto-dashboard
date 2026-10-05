import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'
import zh from './locales/zh.json'

const STORAGE_KEY = 'wip-lang'

function getStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function persistLanguage(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // localStorage puede no estar disponible (modo privado); no es crítico.
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    zh: { translation: zh },
  },
  lng: getStoredLanguage() || 'es',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
