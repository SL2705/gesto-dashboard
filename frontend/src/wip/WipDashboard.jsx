import { useEffect, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useWipDashboards } from './hooks/useWipDashboards'
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import FamilyTabs from './components/FamilyTabs'
import WipSummaryCard from './components/WipSummaryCard'
import ExecutionStatusCard from './components/ExecutionStatusCard'
import StageBarChart from './components/StageBarChart'
import StageCardsGrid from './components/StageCardsGrid'
import TopStayTimePanel from './components/TopStayTimePanel'
import FailedWipPanel from './components/FailedWipPanel'
import StageDetailsModal from './components/StageDetailsModal'
import './wip.css'

const STAGE_COLOR = '#2a78d6'

const EASE = [0.16, 1, 0.3, 1]

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
}

function DashboardSkeleton() {
  return (
    <div>
      <section className="wip-summary-grid">
        <article className="wip-card">
          <div className="wip-skeleton wip-skeleton-line" style={{ width: '40%' }} />
          <div className="wip-skeleton wip-skeleton-number" />
          <div className="wip-skeleton wip-skeleton-line" style={{ width: '70%' }} />
          <div style={{ marginTop: 18 }}>
            <div className="wip-skeleton wip-skeleton-chip" />
            <div className="wip-skeleton wip-skeleton-chip" />
            <div className="wip-skeleton wip-skeleton-chip" />
          </div>
        </article>
        <article className="wip-card">
          <div className="wip-skeleton wip-skeleton-line" style={{ width: '50%' }} />
          <div className="wip-skeleton wip-skeleton-line" style={{ width: '90%', marginTop: 20, height: 60 }} />
        </article>
      </section>
    </div>
  )
}

export default function WipDashboard() {
  const { t, i18n } = useTranslation()
  const [activeFamily, setActiveFamily] = useState('proyecto_a')
  const [selectedStage, setSelectedStage] = useState(null)
  const { dataByFamily, loading, hasError, lastUpdated, refresh } = useWipDashboards()

  const activeData = dataByFamily[activeFamily]
  const activeFamilyLabel = t(`families.${activeFamily}`)

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage
  }, [i18n.resolvedLanguage])

  return (
    <MotionConfig reducedMotion="user">
      <div className="wip-page">
        <div className="wip-background-glow wip-glow-1" />
        <div className="wip-background-glow wip-glow-2" />

        <AppHeader loading={loading} lastUpdated={lastUpdated} onRefresh={refresh} />

        <main className="wip-container">
          <div className="wip-page-intro">
            <span className="wip-hero-badge">
              <span className="wip-hero-badge-dot" />
              {t('hero.badge')}
            </span>
            <p>{t('hero.subtitle')}</p>
          </div>

          <FamilyTabs active={activeFamily} onChange={setActiveFamily} dataByFamily={dataByFamily} />

          {hasError && <div className="wip-status-box wip-status-error">{t('status.connectionError')}</div>}

          {!activeData && !hasError && <DashboardSkeleton />}

          <AnimatePresence mode="wait">
            {activeData && (
              <motion.div
                key={activeFamily}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: EASE }}
              >
                <motion.section
                  className="wip-summary-grid"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                >
                  <motion.div variants={sectionVariants} transition={{ duration: 0.3, ease: EASE }}>
                    <WipSummaryCard
                      familyLabel={activeFamilyLabel}
                      stageOrder={activeData.stage_order}
                      wipTotal={activeData.wip_total}
                      skuModels={activeData.sku_models}
                    />
                  </motion.div>

                  <motion.div variants={sectionVariants} transition={{ duration: 0.3, ease: EASE }}>
                    <ExecutionStatusCard
                      familyLabel={activeFamilyLabel}
                      statusSummary={activeData.status_summary}
                    />
                  </motion.div>
                </motion.section>

                <section className="wip-dashboard-grid">
                  <article className="wip-panel wip-chart-panel">
                    <div className="wip-panel-header">
                      <h2>{t('stageChart.title')}</h2>
                      <p>{t('stageChart.subtitle')}</p>
                    </div>
                    <StageBarChart
                      color={STAGE_COLOR}
                      emptyLabel={t('stageChart.empty')}
                      data={activeData.stage_order.map((stage) => ({
                        label: stage,
                        value: activeData.stages[stage] ?? 0,
                      }))}
                    />
                  </article>

                  <article className="wip-panel wip-side-panel">
                    <div className="wip-panel-header">
                      <h2>{t('stageDetailsPanel.title')}</h2>
                      <p>{t('stageDetailsPanel.subtitle')}</p>
                    </div>

                    <StageCardsGrid
                      stageOrder={activeData.stage_order}
                      stages={activeData.stages}
                      onSelectStage={setSelectedStage}
                    />

                    <TopStayTimePanel units={activeData.top_stay_time} />
                  </article>
                </section>

                <FailedWipPanel failedByStage={activeData.failed_by_stage} />

                <section className="wip-status-box">
                  {t('status.showing', { family: activeFamilyLabel })}
                </section>
              </motion.div>
            )}
          </AnimatePresence>

          <AppFooter />
        </main>

        <AnimatePresence>
          {selectedStage && (
            <StageDetailsModal
              family={activeFamily}
              stage={selectedStage}
              onClose={() => setSelectedStage(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
