import type { VectorState } from '../lib/vectors'
import { formatNumber } from '../lib/physics'

interface VectorDiagramProps {
  state: VectorState
}

const width = 720
const height = 420
const origin = { x: width / 2, y: height / 2 }
const scale = 22.5
const xGridValues = Array.from({ length: 21 }, (_, index) => index - 10)
const yGridValues = Array.from({ length: 17 }, (_, index) => index - 8)

export function VectorDiagram({ state }: VectorDiagramProps) {
  const target = {
    x: origin.x + state.x * scale,
    y: origin.y - state.y * scale,
  }
  const isZeroVector = state.magnitude < 0.01

  return (
    <div className="vector-diagram-shell">
      <svg
        className="vector-diagram"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby="vector-diagram-title vector-diagram-description"
      >
        <title id="vector-diagram-title">Vector en un plano cartesiano</title>
        <desc id="vector-diagram-description">
          Vector con componente X de {formatNumber(state.x)}, componente Y de{' '}
          {formatNumber(state.y)}, magnitud {formatNumber(state.magnitude)} y ángulo{' '}
          {formatNumber(state.angleDegrees)} grados.
        </desc>

        <defs>
          <marker
            id="vector-arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path className="vector-diagram__arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <g aria-hidden="true">
          {xGridValues.map((value) => (
            <line
              key={`x-grid-${value}`}
              className="vector-diagram__grid"
              x1={origin.x + value * scale}
              x2={origin.x + value * scale}
              y1="20"
              y2={height - 20}
            />
          ))}
          {yGridValues.map((value) => (
            <line
              key={`y-grid-${value}`}
              className="vector-diagram__grid"
              x1="20"
              x2={width - 20}
              y1={origin.y - value * scale}
              y2={origin.y - value * scale}
            />
          ))}
        </g>

        <line
          className="vector-diagram__axis"
          x1="20"
          x2={width - 20}
          y1={origin.y}
          y2={origin.y}
        />
        <line
          className="vector-diagram__axis"
          x1={origin.x}
          x2={origin.x}
          y1={height - 20}
          y2="20"
        />

        <text className="vector-diagram__axis-label" x={width - 27} y={origin.y - 9}>
          +X
        </text>
        <text className="vector-diagram__axis-label" x={origin.x + 10} y="31">
          +Y
        </text>

        {!isZeroVector && (
          <>
            <line
              className="vector-diagram__component vector-diagram__component--x"
              x1={origin.x}
              x2={target.x}
              y1={origin.y}
              y2={origin.y}
            />
            <line
              className="vector-diagram__component vector-diagram__component--y"
              x1={target.x}
              x2={target.x}
              y1={origin.y}
              y2={target.y}
            />
            <line
              className="vector-diagram__vector"
              x1={origin.x}
              x2={target.x}
              y1={origin.y}
              y2={target.y}
              markerEnd="url(#vector-arrowhead)"
            />

            {Math.abs(state.x) > 0.1 && (
              <text
                className="vector-diagram__component-label"
                x={(origin.x + target.x) / 2}
                y={origin.y + (state.y >= 0 ? 20 : -10)}
                textAnchor="middle"
              >
                vₓ = {formatNumber(state.x)}
              </text>
            )}
            {Math.abs(state.y) > 0.1 && (
              <text
                className="vector-diagram__component-label"
                x={target.x + (state.x >= 0 ? 12 : -12)}
                y={(origin.y + target.y) / 2}
                textAnchor={state.x >= 0 ? 'start' : 'end'}
              >
                vᵧ = {formatNumber(state.y)}
              </text>
            )}
            <text
              className="vector-diagram__vector-label"
              x={target.x + (state.x >= 0 ? 14 : -14)}
              y={target.y + (state.y >= 0 ? -12 : 20)}
              textAnchor={state.x >= 0 ? 'start' : 'end'}
            >
              v = ({formatNumber(state.x)}, {formatNumber(state.y)})
            </text>
          </>
        )}

        <circle
          className={isZeroVector ? 'vector-diagram__origin vector-diagram__origin--zero' : 'vector-diagram__origin'}
          cx={origin.x}
          cy={origin.y}
          r={isZeroVector ? 7 : 4}
        />
        {isZeroVector && (
          <text
            className="vector-diagram__zero-label"
            x={origin.x + 13}
            y={origin.y - 13}
          >
            vector cero
          </text>
        )}
      </svg>
    </div>
  )
}
