import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import AnimatedNumber from './AnimatedNumber'

const VISIBLE_SKU_CHIPS = 6

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const chipVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export default function WipSummaryCard({ familyLabel, stageOrder, wipTotal, skuModels }) {
  const { t } = useTranslation()
  const visible = skuModels.slice(0, VISIBLE_SKU_CHIPS)
  const extraCount = skuModels.length - visible.length

  return (
    <article className="wip-card wip-summary-card">
      <div className="wip-card-header">
        <span className="wip-card-label">{familyLabel} {t('summaryCard.titleSuffix')}</span>
        <span className="wip-card-chip">{stageOrder.join(' · ')}</span>
      </div>

      <AnimatedNumber value={wipTotal} className="wip-number" />
      <p className="wip-card-note">{t('summaryCard.totalNote', { family: familyLabel })}</p>

      <div className="wip-divider" />

      <div className="wip-sku-breakdown">
        <span className="wip-breakdown-label">{t('summaryCard.breakdownLabel')}</span>

        <motion.div
          className="wip-sku-chip-list"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {visible.length === 0 && <span className="wip-sku-empty">{t('summaryCard.empty')}</span>}

          {visible.map((item) => (
            <motion.span key={item.sku_model} className="wip-sku-chip" variants={chipVariants}>
              <span className="wip-sku-chip-name">{item.sku_model}</span>
              <span className="wip-sku-chip-count">{item.count}</span>
            </motion.span>
          ))}

          {extraCount > 0 && (
            <motion.span className="wip-sku-chip wip-sku-chip-more" variants={chipVariants}>
              <span className="wip-sku-chip-count">{t('summaryCard.more', { count: extraCount })}</span>
            </motion.span>
          )}
        </motion.div>
      </div>
    </article>
  )
}
