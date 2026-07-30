import type { LinearFunctionState } from '../lib/functions'
import { formatNumber } from '../lib/physics'

interface FunctionGraphProps {
  state: LinearFunctionState
}

const width = 720
const height = 420
const padding = 34
const xLimit = 8
const yLimit = 12
const xGridValues = Array.from({ length: xLimit * 2 + 1 }, (_, index) => index - xLimit)
const yGridValues = Array.from({ length: 13 }, (_, index) => (index - 6) * 2)

function toScreenX(value: number): number {
  return padding + ((value + xLimit) / (xLimit * 2)) * (width - padding * 2)
}

function toScreenY(value: number): number {
  return padding + ((yLimit - value) / (yLimit * 2)) * (height - padding * 2)
}

export function FunctionGraph({ state }: FunctionGraphProps) {
  const start = {
    x: toScreenX(-xLimit),
    y: toScreenY(state.slope * -xLimit + state.intercept),
  }
  const end = {
    x: toScreenX(xLimit),
    y: toScreenY(state.slope * xLimit + state.intercept),
  }
  const selectedPoint = {
    x: toScreenX(state.input),
    y: toScreenY(state.output),
  }
  const interceptPoint = {
    x: toScreenX(0),
    y: toScreenY(state.intercept),
  }
  const origin = {
    x: toScreenX(0),
    y: toScreenY(0),
  }

  return (
    <div className="function-graph-shell">
      <svg
        className="function-graph"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby="function-graph-title function-graph-description"
      >
        <title id="function-graph-title">Gráfica de una función lineal</title>
        <desc id="function-graph-description">
          La función tiene pendiente {formatNumber(state.slope)}, intersección{' '}
          {formatNumber(state.intercept)} y para la entrada {formatNumber(state.input)}
          produce la salida {formatNumber(state.output)}.
        </desc>

        <defs>
          <clipPath id="function-graph-clip">
            <rect
              x={padding}
              y={padding}
              width={width - padding * 2}
              height={height - padding * 2}
            />
          </clipPath>
        </defs>

        <g aria-hidden="true">
          {xGridValues.map((value) => (
            <line
              key={`function-x-grid-${value}`}
              className="function-graph__grid"
              x1={toScreenX(value)}
              x2={toScreenX(value)}
              y1={padding}
              y2={height - padding}
            />
          ))}
          {yGridValues.map((value) => (
            <line
              key={`function-y-grid-${value}`}
              className="function-graph__grid"
              x1={padding}
              x2={width - padding}
              y1={toScreenY(value)}
              y2={toScreenY(value)}
            />
          ))}
        </g>

        <line
          className="function-graph__axis"
          x1={padding}
          x2={width - padding}
          y1={origin.y}
          y2={origin.y}
        />
        <line
          className="function-graph__axis"
          x1={origin.x}
          x2={origin.x}
          y1={height - padding}
          y2={padding}
        />

        {[-8, -4, 4, 8].map((value) => (
          <text
            key={`function-x-label-${value}`}
            className="function-graph__tick"
            x={toScreenX(value)}
            y={origin.y + 18}
            textAnchor="middle"
          >
            {value}
          </text>
        ))}
        {[-12, -8, -4, 4, 8, 12].map((value) => (
          <text
            key={`function-y-label-${value}`}
            className="function-graph__tick"
            x={origin.x - 10}
            y={toScreenY(value) + 3}
            textAnchor="end"
          >
            {value}
          </text>
        ))}

        <g clipPath="url(#function-graph-clip)">
          <line
            className="function-graph__line"
            x1={start.x}
            x2={end.x}
            y1={start.y}
            y2={end.y}
          />
          <line
            className="function-graph__guide"
            x1={selectedPoint.x}
            x2={selectedPoint.x}
            y1={origin.y}
            y2={selectedPoint.y}
          />
          <line
            className="function-graph__guide"
            x1={origin.x}
            x2={selectedPoint.x}
            y1={selectedPoint.y}
            y2={selectedPoint.y}
          />
          <circle
            className="function-graph__intercept"
            cx={interceptPoint.x}
            cy={interceptPoint.y}
            r="5"
          />
          <circle
            className="function-graph__point"
            cx={selectedPoint.x}
            cy={selectedPoint.y}
            r="7"
          />
        </g>

        <text
          className="function-graph__point-label"
          x={selectedPoint.x + 12}
          y={selectedPoint.y - 13}
        >
          ({formatNumber(state.input)}, {formatNumber(state.output)})
        </text>
        <text className="function-graph__axis-label" x={width - padding - 4} y={origin.y - 11}>
          x
        </text>
        <text className="function-graph__axis-label" x={origin.x + 11} y={padding + 9}>
          f(x)
        </text>
      </svg>
    </div>
  )
}
