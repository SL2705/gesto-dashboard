import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

function formatStayTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
}

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
}

export default function TopStayTimePanel({ units }) {
  const { t } = useTranslation()

  return (
    <div className="wip-top-staytime-panel">
      <div className="wip-top-staytime-header">
        <div>
          <h2>{t('topStayTime.title')}</h2>
          <p>{t('topStayTime.subtitle')}</p>
        </div>
        <span className="wip-top-staytime-badge">{t('topStayTime.badge', { count: units.length })}</span>
      </div>

      <motion.div
        className="wip-top-staytime-list"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {units.length === 0 && <div className="wip-chart-empty">{t('topStayTime.empty')}</div>}

        {units.map((unit) => (
          <motion.div key={unit.usn} className="wip-staytime-row" variants={rowVariants}>
            <div className="wip-staytime-main">
              <span className="wip-staytime-usn">{unit.usn}</span>
              <span className="wip-staytime-sku">{unit.sku_model}</span>
            </div>
            <div className="wip-staytime-side">
              <span className="wip-staytime-stage">{unit.stage}</span>
              <span className="wip-staytime-value">{formatStayTime(unit.stay_time_minutes)}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
