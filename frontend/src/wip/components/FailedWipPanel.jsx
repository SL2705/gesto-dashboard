import { useTranslation } from 'react-i18next'
import StageBarChart from './StageBarChart'

const CRITICAL_COLOR = '#d03b3b'

export default function FailedWipPanel({ failedByStage }) {
  const { t } = useTranslation()
  const chartData = failedByStage.map((item) => ({ label: item.stage, value: item.failed_count }))

  return (
    <section className="wip-panel wip-failed-panel">
      <div className="wip-panel-header">
        <h2>{t('failedPanel.title')}</h2>
        <p>{t('failedPanel.subtitle')}</p>
      </div>

      <div className="wip-failed-layout">
        <div className="wip-failed-chart">
          <StageBarChart data={chartData} color={CRITICAL_COLOR} emptyLabel={t('failedPanel.empty')} />
        </div>

        <div className="wip-failed-table-wrapper">
          <table className="wip-failed-table">
            <thead>
              <tr>
                <th>{t('failedPanel.colStage')}</th>
                <th>{t('failedPanel.colFailedUnits')}</th>
                <th>{t('failedPanel.colTopError')}</th>
              </tr>
            </thead>
            <tbody>
              {failedByStage.length === 0 && (
                <tr>
                  <td colSpan={3} className="wip-table-empty">{t('failedPanel.empty')}</td>
                </tr>
              )}

              {failedByStage.map((item) => (
                <tr key={item.stage}>
                  <td>{item.stage}</td>
                  <td>{item.failed_count}</td>
                  <td>{t(`errors.${item.top_error}`, item.top_error)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
