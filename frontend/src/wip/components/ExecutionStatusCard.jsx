import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import AnimatedNumber from './AnimatedNumber'

const SEGMENTS = [
  { key: 'testing', labelKey: 'executionStatus.testing', icon: '▶', className: 'is-testing' },
  { key: 'failed', labelKey: 'executionStatus.failed', icon: '✕', className: 'is-failed' },
  { key: 'offline', labelKey: 'executionStatus.offline', icon: '⏸', className: 'is-offline' },
]

const SPRING = { type: 'spring', stiffness: 140, damping: 22 }

export default function ExecutionStatusCard({ statusSummary, familyLabel }) {
  const { t } = useTranslation()
  const total = statusSummary.testing + statusSummary.failed + statusSummary.offline || 1

  return (
    <article className="wip-card wip-status-card">
      <div className="wip-legend-header">
        <h3>{t('executionStatus.title')}</h3>
        <p>{t('executionStatus.subtitle', { family: familyLabel })}</p>
      </div>

      <div className="wip-distribution-bar" role="img" aria-label={t('executionStatus.title')}>
        {SEGMENTS.map((segment) => (
          <motion.div
            key={segment.key}
            className={`wip-distribution-segment ${segment.className}`}
            animate={{ width: `${(statusSummary[segment.key] / total) * 100}%` }}
            transition={SPRING}
            initial={false}
          />
        ))}
      </div>

      <div className="wip-status-grid">
        {SEGMENTS.map((segment) => (
          <div key={segment.key} className={`wip-status-mini-card ${segment.className}`}>
            <span className="wip-status-mini-icon">{segment.icon}</span>
            <div>
              <div className="wip-status-mini-title">{t(segment.labelKey)}</div>
              <AnimatedNumber value={statusSummary[segment.key]} className="wip-status-mini-value" />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
