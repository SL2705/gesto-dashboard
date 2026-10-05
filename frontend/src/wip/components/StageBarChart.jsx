import { useState } from 'react'
import { motion } from 'motion/react'

const CHART_HEIGHT = 240
const BAR_MAX_WIDTH = 30
const AXIS_GAP = 36
const BAR_SPRING = { type: 'spring', stiffness: 170, damping: 24 }

/**
 * Gráfica de barras simple en SVG (sin dependencias de charting).
 * Un solo valor por categoría -> un solo hue, siguiendo la guía de dataviz:
 * barras con tope redondeado de 4px, base cuadrada, gridlines recesivas,
 * valor rotulado en el tope, tooltip al pasar el mouse, y una animación de
 * resorte cuando los valores cambian entre refresh.
 */
export default function StageBarChart({ data, color, emptyLabel = 'No data yet.' }) {
  const [hovered, setHovered] = useState(null)

  const maxValue = Math.max(1, ...data.map((item) => item.value))
  const hasData = data.some((item) => item.value > 0)
  const width = Math.max(320, data.length * 64)
  const plotHeight = CHART_HEIGHT - AXIS_GAP

  return (
    <div className="wip-bar-chart-wrapper">
      {!hasData && <div className="wip-chart-empty">{emptyLabel}</div>}

      <svg
        viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
        width="100%"
        height={CHART_HEIGHT}
        role="img"
        aria-label="Stage bar chart"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const y = plotHeight - plotHeight * fraction
          return (
            <line
              key={fraction}
              x1={0}
              x2={width}
              y1={y}
              y2={y}
              className="wip-chart-gridline"
            />
          )
        })}

        {data.map((item, index) => {
          const slotWidth = width / data.length
          const barWidth = Math.min(BAR_MAX_WIDTH, slotWidth * 0.5)
          const barHeight = (item.value / maxValue) * plotHeight
          const x = slotWidth * index + slotWidth / 2 - barWidth / 2
          const y = plotHeight - barHeight
          const isHovered = hovered === index

          return (
            <g
              key={item.label}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="wip-chart-bar-group"
            >
              <motion.rect
                x={x}
                width={barWidth}
                rx={4}
                fill={color}
                initial={{ height: 0, y: plotHeight }}
                animate={{ height: Math.max(barHeight, 1), y, opacity: isHovered ? 1 : 0.88 }}
                transition={BAR_SPRING}
              />

              <motion.text
                x={slotWidth * index + slotWidth / 2}
                textAnchor="middle"
                className="wip-chart-value-label"
                initial={{ y: plotHeight - 8, opacity: 0 }}
                animate={{ y: y - 8, opacity: 1 }}
                transition={BAR_SPRING}
              >
                {item.value}
              </motion.text>

              <text
                x={slotWidth * index + slotWidth / 2}
                y={plotHeight + 20}
                textAnchor="middle"
                className="wip-chart-axis-label"
              >
                {item.label}
              </text>

              {isHovered && (
                <title>{`${item.label}: ${item.value}`}</title>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
