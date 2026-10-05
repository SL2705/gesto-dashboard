import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const COOLDOWN_SECONDS = 8

/**
 * Barra superior fija al viewport (position: fixed): siempre visible, sin
 * importar cuánto se scrollee. Mide su propia altura y la expone como
 * variable CSS para que el contenido de abajo no quede tapado debajo.
 */
export default function AppHeader({ loading, lastUpdated, onRefresh }) {
  const { t } = useTranslation()
  const [cooldown, setCooldown] = useState(0)
  const intervalRef = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    const el = headerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const updateHeight = () => {
      document.documentElement.style.setProperty('--wip-header-height', `${el.offsetHeight}px`)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleRefreshClick = () => {
    if (cooldown > 0 || loading) return

    onRefresh()
    setCooldown(COOLDOWN_SECONDS)

    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const isLocked = cooldown > 0 || loading
  const cooldownText = loading
    ? t('hero.refreshing')
    : cooldown > 0
      ? t('hero.refreshIn', { seconds: cooldown })
      : t('hero.readyToRefresh')

  const lastUpdateText = lastUpdated
    ? t('hero.lastUpdate', { time: lastUpdated.toLocaleTimeString() })
    : t('hero.lastUpdateEmpty')

  return (
    <motion.header
      ref={headerRef}
      className="wip-app-header"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="wip-app-header-inner">
        <div className="wip-app-header-left">
          <span className="wip-app-logo-dot" />
          <h1 className="wip-app-title">{t('hero.title')}</h1>
        </div>

        <div className="wip-app-header-right">
          <div className="wip-app-header-controls">
            <LanguageSwitcher />

            <motion.button
              type="button"
              className={`wip-btn wip-btn-refresh ${isLocked ? 'is-locked' : ''}`}
              onClick={handleRefreshClick}
              disabled={isLocked}
              whileHover={!isLocked ? { y: -2 } : undefined}
              whileTap={!isLocked ? { scale: 0.96 } : undefined}
            >
              <span className={`wip-btn-icon ${loading ? 'is-spinning' : ''}`}>↻</span>
              <span>{t('hero.refresh')}</span>
            </motion.button>
          </div>

          <div className="wip-app-header-meta">
            <span className="wip-cooldown-text">{cooldownText}</span>
            <span className="wip-last-update">{lastUpdateText}</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
