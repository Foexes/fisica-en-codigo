import type { ForceState } from '../lib/forces'
import { formatNumber } from '../lib/physics'

interface ForceDiagramProps {
  state: ForceState
}

const width = 720
const height = 420
const box = { x: 295, y: 164, width: 130, height: 92 }
const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 }

function horizontalArrowLength(force: number): number {
  return force <= 0 ? 0 : Math.min(220, 38 + force * 5.2)
}

export function ForceDiagram({ state }: ForceDiagramProps) {
  const appliedLength = horizontalArrowLength(state.appliedForce)
  const resistanceLength = horizontalArrowLength(state.resistanceForce)
  const isBalanced = Math.abs(state.netForce) < 0.01

  return (
    <div className="force-diagram-shell">
      <svg
        className="force-diagram"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby="force-diagram-title force-diagram-description"
      >
        <title id="force-diagram-title">Diagrama de cuerpo libre</title>
        <desc id="force-diagram-description">
          Una caja de {formatNumber(state.mass)} kilogramos recibe{' '}
          {formatNumber(state.appliedForce)} newtons hacia la derecha y{' '}
          {formatNumber(state.resistanceForce)} newtons hacia la izquierda. La fuerza
          neta es {formatNumber(state.netForce)} newtons y la aceleración{' '}
          {formatNumber(state.acceleration)} metros por segundo al cuadrado.
        </desc>

        <defs>
          <marker
            id="force-applied-arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path className="force-diagram__arrowhead force-diagram__arrowhead--applied" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker
            id="force-resistance-arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path className="force-diagram__arrowhead force-diagram__arrowhead--resistance" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker
            id="force-normal-arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path className="force-diagram__arrowhead force-diagram__arrowhead--normal" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker
            id="force-weight-arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path className="force-diagram__arrowhead force-diagram__arrowhead--weight" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <line className="force-diagram__ground" x1="70" x2={width - 70} y1="279" y2="279" />
        <line className="force-diagram__ground-detail" x1="110" x2={width - 110} y1="292" y2="292" />

        <rect
          className="force-diagram__body-shadow"
          x={box.x + 8}
          y={box.y + 10}
          width={box.width}
          height={box.height}
          rx="13"
        />
        <rect
          className="force-diagram__body"
          x={box.x}
          y={box.y}
          width={box.width}
          height={box.height}
          rx="13"
        />
        <text className="force-diagram__body-label" x={center.x} y={center.y - 3} textAnchor="middle">
          objeto
        </text>
        <text className="force-diagram__mass-label" x={center.x} y={center.y + 18} textAnchor="middle">
          m = {formatNumber(state.mass)} kg
        </text>

        {state.appliedForce > 0 && (
          <>
            <line
              className="force-diagram__arrow force-diagram__arrow--applied"
              x1={box.x + box.width}
              x2={box.x + box.width + appliedLength}
              y1={center.y}
              y2={center.y}
              markerEnd="url(#force-applied-arrowhead)"
            />
            <text
              className="force-diagram__label force-diagram__label--applied"
              x={box.x + box.width + appliedLength / 2}
              y={center.y - 17}
              textAnchor="middle"
            >
              F aplicada = {formatNumber(state.appliedForce)} N
            </text>
          </>
        )}

        {state.resistanceForce > 0 && (
          <>
            <line
              className="force-diagram__arrow force-diagram__arrow--resistance"
              x1={box.x}
              x2={box.x - resistanceLength}
              y1={center.y}
              y2={center.y}
              markerEnd="url(#force-resistance-arrowhead)"
            />
            <text
              className="force-diagram__label force-diagram__label--resistance"
              x={box.x - resistanceLength / 2}
              y={center.y - 17}
              textAnchor="middle"
            >
              Resistencia = {formatNumber(state.resistanceForce)} N
            </text>
          </>
        )}

        <line
          className="force-diagram__arrow force-diagram__arrow--normal"
          x1={center.x}
          x2={center.x}
          y1={box.y}
          y2="58"
          markerEnd="url(#force-normal-arrowhead)"
        />
        <text className="force-diagram__label force-diagram__label--normal" x={center.x + 16} y="77">
          N = {formatNumber(state.normalForce)} N
        </text>

        <line
          className="force-diagram__arrow force-diagram__arrow--weight"
          x1={center.x}
          x2={center.x}
          y1={box.y + box.height}
          y2="365"
          markerEnd="url(#force-weight-arrowhead)"
        />
        <text className="force-diagram__label force-diagram__label--weight" x={center.x + 16} y="348">
          P = {formatNumber(state.weight)} N
        </text>

        <g className={isBalanced ? 'force-diagram__result force-diagram__result--balanced' : 'force-diagram__result'}>
          <rect x="247" y="380" width="226" height="28" rx="7" />
          <text x={center.x} y="398" textAnchor="middle">
            ΣFₓ = {state.netForce > 0 ? '+' : ''}{formatNumber(state.netForce)} N
          </text>
        </g>
      </svg>
    </div>
  )
}
