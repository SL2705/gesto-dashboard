import { useTranslation } from 'react-i18next'

const APP_VERSION = '1.0'

export default function AppFooter() {
  const { t } = useTranslation()

  return (
    <footer className="wip-footer">
      <div className="wip-footer-brand">
        <span className="wip-footer-dot" />
        <span>{t('hero.title')}</span>
        <span className="wip-footer-version">v{APP_VERSION}</span>
      </div>

      <p className="wip-footer-note">{t('footer.tagline')}</p>
    </footer>
  )
}
