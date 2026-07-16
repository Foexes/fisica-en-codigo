import type { MotionParameters, MotionState } from '../lib/physics'
import { calculateMotionState, formatNumber } from '../lib/physics'

interface PositionChartProps {
  parameters: MotionParameters
  currentState: MotionState
  maxTime: number
}

const chartWidth = 720
const chartHeight = 280
const padding = { top: 24, right: 28, bottom: 42, left: 58 }

export function PositionChart({
  parameters,
  currentState,
  maxTime,
}: PositionChartProps) {
  const points = Array.from({ length: 81 }, (_, index) => {
    const time = (index / 80) * maxTime
    return calculateMotionState(parameters, time)
  })
  const positions = points.map((point) => point.position)
  const rawMin = Math.min(0, ...positions)
  const rawMax = Math.max(0, ...positions)
  const margin = Math.max((rawMax - rawMin) * 0.12, 1)
  const minPosition = rawMin - margin
  const maxPosition = rawMax + margin
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom

  const scaleX = (time: number) => padding.left + (time / maxTime) * plotWidth
  const scaleY = (position: number) =>
    padding.top +
    ((maxPosition - position) / (maxPosition - minPosition)) * plotHeight

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${scaleX(point.time).toFixed(2)} ${scaleY(point.position).toFixed(2)}`,
    )
    .join(' ')

  const xTicks = [0, 2, 4, 6, 8, 10]
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    return minPosition + (index / 4) * (maxPosition - minPosition)
  })

  return (
    <div className="chart-shell">
      <svg
        className="position-chart"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
        aria-labelledby="position-chart-title position-chart-description"
      >
        <title id="position-chart-title">Gráfica de posición respecto al tiempo</title>
        <desc id="position-chart-description">
          La curva representa la posición calculada y el punto marca el instante actual.
        </desc>

        {yTicks.map((position) => (
          <g key={position}>
            <line
              className="position-chart__grid"
              x1={padding.left}
              x2={chartWidth - padding.right}
              y1={scaleY(position)}
              y2={scaleY(position)}
            />
            <text
              className="position-chart__tick"
              x={padding.left - 10}
              y={scaleY(position) + 4}
              textAnchor="end"
            >
              {formatNumber(position, 0)}
            </text>
          </g>
        ))}

        {xTicks.map((time) => (
          <g key={time}>
            <line
              className="position-chart__grid"
              x1={scaleX(time)}
              x2={scaleX(time)}
              y1={padding.top}
              y2={chartHeight - padding.bottom}
            />
            <text
              className="position-chart__tick"
              x={scaleX(time)}
              y={chartHeight - padding.bottom + 24}
              textAnchor="middle"
            >
              {time}
            </text>
          </g>
        ))}

        <line
          className="position-chart__axis"
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={chartHeight - padding.bottom}
        />
        <line
          className="position-chart__axis"
          x1={padding.left}
          x2={chartWidth - padding.right}
          y1={chartHeight - padding.bottom}
          y2={chartHeight - padding.bottom}
        />
        <path className="position-chart__line" d={linePath} />
        <line
          className="position-chart__guide"
          x1={scaleX(currentState.time)}
          x2={scaleX(currentState.time)}
          y1={scaleY(currentState.position)}
          y2={chartHeight - padding.bottom}
        />
        <circle
          className="position-chart__point"
          cx={scaleX(currentState.time)}
          cy={scaleY(currentState.position)}
          r="6"
        />
        <text
          className="position-chart__axis-label"
          x={chartWidth / 2}
          y={chartHeight - 7}
          textAnchor="middle"
        >
          tiempo (s)
        </text>
        <text
          className="position-chart__axis-label"
          x="16"
          y={chartHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90 16 ${chartHeight / 2})`}
        >
          posición (m)
        </text>
      </svg>
    </div>
  )
}
