import { motion } from 'motion/react'
import AnimatedNumber from './AnimatedNumber'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

export default function StageCardsGrid({ stageOrder, stages, onSelectStage }) {
  return (
    <motion.div className="wip-stage-cards" variants={listVariants} initial="hidden" animate="visible">
      {stageOrder.map((stage) => (
        <motion.button
          key={stage}
          type="button"
          className="wip-mini-stage-card"
          onClick={() => onSelectStage(stage)}
          variants={cardVariants}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="wip-mini-stage-name">{stage}</div>
          <AnimatedNumber value={stages[stage] ?? 0} className="wip-mini-stage-value" />
        </motion.button>
      ))}
    </motion.div>
  )
}
