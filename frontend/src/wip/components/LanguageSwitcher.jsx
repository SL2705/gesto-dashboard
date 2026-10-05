import { useTranslation } from 'react-i18next'
import { persistLanguage } from '../i18n'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'zh', label: '中文' },
]

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const handleSelect = (code) => {
    i18n.changeLanguage(code)
    persistLanguage(code)
  }

  return (
    <div className="wip-lang-switcher" role="group" aria-label={t('language.label')}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={`wip-lang-btn ${i18n.resolvedLanguage === lang.code ? 'is-active' : ''}`}
          onClick={() => handleSelect(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
