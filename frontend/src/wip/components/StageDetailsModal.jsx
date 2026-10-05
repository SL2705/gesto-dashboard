import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useStageDetails } from '../hooks/useStageDetails'

export default function StageDetailsModal({ family, stage, onClose }) {
  const { t } = useTranslation()
  const { data, loading, hasError } = useStageDetails(family, stage)

  return (
    <div className="wip-modal">
      <motion.div
        className="wip-modal-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      />

      <motion.div
        className="wip-modal-content"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="wip-modal-header">
          <div>
            <h3>{t('modal.title')}</h3>
            <div className="wip-modal-subtitle">
              {stage} · {data ? `${data.count} ${t('modal.units')}` : `${t('status.loading')}`}
            </div>
          </div>
          <button type="button" className="wip-modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="wip-modal-body">
          {loading && <div className="wip-modal-loading">{t('modal.loading')}</div>}
          {hasError && <div className="wip-modal-loading">{t('status.stageDetailsError')}</div>}

          {data && data.units.length === 0 && !loading && (
            <div className="wip-modal-empty">{t('modal.empty')}</div>
          )}

          {data && data.units.length > 0 && (
            <div className="wip-table-wrapper">
              <table className="wip-modal-table">
                <thead>
                  <tr>
                    <th>{t('modal.colUsn')}</th>
                    <th>{t('modal.colModel')}</th>
                    <th>{t('modal.colSku')}</th>
                    <th>{t('modal.colMo')}</th>
                    <th>{t('modal.colUpn')}</th>
                    <th>{t('modal.colStatus')}</th>
                    <th>{t('modal.colPod')}</th>
                    <th>{t('modal.colStayTime')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.units.map((unit) => (
                    <tr key={unit.usn}>
                      <td>{unit.usn}</td>
                      <td>{unit.model_name}</td>
                      <td>{unit.sku_model}</td>
                      <td>{unit.mo}</td>
                      <td>{unit.upn}</td>
                      <td>
                        <span className={`wip-status-badge is-${unit.status.toLowerCase()}`}>
                          {t(`executionStatus.${unit.status.toLowerCase()}`)}
                        </span>
                      </td>
                      <td>{unit.pod}</td>
                      <td>{unit.stay_time_minutes}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
