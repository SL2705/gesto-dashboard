import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { FAMILIES } from '../constants'

export default function FamilyTabs({ active, onChange, dataByFamily }) {
  const { t } = useTranslation()

  return (
    <div className="wip-tabs" role="tablist">
      {FAMILIES.map((family) => {
        const payload = dataByFamily[family.key]
        const count = payload ? payload.wip_total : '--'
        const isActive = active === family.key

        return (
          <motion.button
            key={family.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`wip-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(family.key)}
            whileTap={{ scale: 0.96 }}
          >
            {isActive && (
              <motion.span
                layoutId="wip-tab-pill"
                className="wip-tab-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}

            <span className="wip-tab-content">
              <span className="wip-tab-dot" />
              <span className="wip-tab-label">{t(`families.${family.key}`)}</span>
              <span className="wip-tab-count">{count}</span>
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
