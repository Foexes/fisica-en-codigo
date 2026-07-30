import { useMemo, useState } from 'react'
import {
  getExampleFileName,
  getVectorLabCode,
  type ProgrammingLanguage,
} from '../lib/codeExamples'
import { formatNumber } from '../lib/physics'
import { calculateVectorState, type Vector2 } from '../lib/vectors'
import { CodeSnippet } from './CodeSnippet'
import { MathExpression } from './MathExpression'
import { VectorDiagram } from './VectorDiagram'

type DetailView = 'breakdown' | 'code'

interface VectorPreset {
  id: string
  label: string
  description: string
  vector: Vector2
}

const presets: VectorPreset[] = [
  {
    id: 'horizontal',
    label: 'Movimiento lateral',
    description: 'Solo componente X',
    vector: { x: 7, y: 0 },
  },
  {
    id: 'jump',
    label: 'Salto',
    description: 'Avanza y sube',
    vector: { x: 4, y: 7 },
  },
  {
    id: 'camera',
    label: 'Cámara',
    description: 'Segundo cuadrante',
    vector: { x: -6, y: 3 },
  },
]

interface VectorLabWorkspaceProps {
  programmingLanguage: ProgrammingLanguage
  onLanguageChange: (language: ProgrammingLanguage) => void
}

export function VectorLabWorkspace({
  programmingLanguage,
  onLanguageChange,
}: VectorLabWorkspaceProps) {
  const [vector, setVector] = useState<Vector2>(presets[1].vector)
  const [activePresetId, setActivePresetId] = useState<string | null>('jump')
  const [detailView, setDetailView] = useState<DetailView>('breakdown')
  const state = calculateVectorState(vector)

  const directionDescription = useMemo(() => {
    if (state.magnitude < 0.01) return 'Sin magnitud no existe una dirección definida.'
    if (Math.abs(state.y) < 0.01) {
      return state.x > 0 ? 'Apunta hacia la derecha.' : 'Apunta hacia la izquierda.'
    }
    if (Math.abs(state.x) < 0.01) {
      return state.y > 0 ? 'Apunta verticalmente hacia arriba.' : 'Apunta verticalmente hacia abajo.'
    }

    const horizontal = state.x > 0 ? 'derecha' : 'izquierda'
    const vertical = state.y > 0 ? 'arriba' : 'abajo'
    return `Apunta hacia ${vertical} y la ${horizontal}.`
  }, [state])

  const updateComponent = (key: keyof Vector2, value: number) => {
    setActivePresetId(null)
    setVector((currentVector) => ({ ...currentVector, [key]: value }))
  }

  const applyPreset = (preset: VectorPreset) => {
    setVector(preset.vector)
    setActivePresetId(preset.id)
  }

  return (
    <section className="lab-workspace" aria-label="Laboratorio de vectores">
      <div className="lab-toolbar">
        <div className="preset-selector" aria-label="Vectores de ejemplo">
          <span className="interface-label">Escenario</span>
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              aria-pressed={activePresetId === preset.id}
              onClick={() => applyPreset(preset)}
            >
              <strong>{preset.label}</strong>
              <small>{preset.description}</small>
            </button>
          ))}
        </div>
        <div className="simulation-state">
          <span className="simulation-state__dot simulation-state__dot--running" />
          Vector actualizado en vivo
        </div>
      </div>

      <div className="lab-layout">
        <div className="simulation-stage vector-stage">
          <div className="stage-readout stage-readout--vector">
            <div>
              <span>Componente X</span>
              <strong>{formatNumber(state.x)}</strong>
            </div>
            <div>
              <span>Componente Y</span>
              <strong>{formatNumber(state.y)}</strong>
            </div>
            <div>
              <span>Magnitud</span>
              <strong>{formatNumber(state.magnitude)}</strong>
            </div>
            <div>
              <span>Ángulo</span>
              <strong>{formatNumber(state.angleDegrees)} <small>°</small></strong>
            </div>
            <p>{directionDescription}</p>
          </div>

          <VectorDiagram state={state} />

          <div className="live-equation" aria-label="Cálculo actual de la magnitud">
            <span>Magnitud en vivo</span>
            <MathExpression
              expression={`|\\vec{v}|=\\sqrt{(${state.x.toFixed(1)})^2+(${state.y.toFixed(1)})^2}=${state.magnitude.toFixed(2)}`}
              label={`La magnitud actual del vector es ${formatNumber(state.magnitude)}`}
            />
          </div>
        </div>

        <aside className="parameter-dock" aria-label="Componentes del vector">
          <div className="parameter-dock__heading">
            <div>
              <span className="interface-label">Entradas</span>
              <h2>Componentes</h2>
            </div>
            <span className="parameter-dock__custom-state">
              {activePresetId === null ? 'Personalizado' : 'Preset'}
            </span>
          </div>

          <label className="parameter-control">
            <span>
              <span><b>vₓ</b> Eje horizontal</span>
              <output>{formatNumber(state.x)}</output>
            </span>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={state.x}
              onChange={(event) => updateComponent('x', Number(event.target.value))}
            />
            <small><span>−10</span><span>10</span></small>
          </label>

          <label className="parameter-control">
            <span>
              <span><b>vᵧ</b> Eje vertical</span>
              <output>{formatNumber(state.y)}</output>
            </span>
            <input
              type="range"
              min="-8"
              max="8"
              step="0.5"
              value={state.y}
              onChange={(event) => updateComponent('y', Number(event.target.value))}
            />
            <small><span>−8</span><span>8</span></small>
          </label>

          <div className="parameter-dock__tip">
            <span aria-hidden="true">i</span>
            <p>
              <strong>Convención de ejes</strong>
              Este plano usa +Y hacia arriba. En Godot 2D y muchas interfaces, +Y apunta hacia abajo:
              el cálculo es el mismo, pero cambia la interpretación visual.
            </p>
          </div>
        </aside>
      </div>

      <div className="detail-panel">
        <div className="detail-panel__tabs" role="tablist" aria-label="Representación del vector">
          <button
            type="button"
            role="tab"
            aria-selected={detailView === 'breakdown'}
            onClick={() => setDetailView('breakdown')}
          >
            Descomposición
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={detailView === 'code'}
            onClick={() => setDetailView('code')}
          >
            Código equivalente
          </button>
        </div>

        {detailView === 'breakdown' ? (
          <div className="detail-panel__content detail-panel__content--vector">
            <div className="detail-copy">
              <span className="interface-label">Vector unitario</span>
              <h3>Dirección sin velocidad</h3>
              <p>
                Normalizar divide cada componente por la magnitud. El resultado apunta igual,
                pero su longitud es exactamente uno.
              </p>
              <span className="detail-copy__current">
                {state.magnitude < 0.01 ? 'El vector cero no se puede normalizar' : 'Magnitud normalizada · 1'}
              </span>
            </div>
            <div className="vector-breakdown" aria-label="Descomposición numérica del vector">
              <div>
                <span>Vector original</span>
                <MathExpression
                  expression={`\\vec{v}=(${state.x.toFixed(1)},${state.y.toFixed(1)})`}
                  label={`vector original ${formatNumber(state.x)}, ${formatNumber(state.y)}`}
                />
              </div>
              <div>
                <span>Magnitud</span>
                <MathExpression
                  expression={`|\\vec{v}|=${state.magnitude.toFixed(2)}`}
                  label={`magnitud ${formatNumber(state.magnitude)}`}
                />
              </div>
              <div>
                <span>Dirección normalizada</span>
                <MathExpression
                  expression={`\\hat{v}=(${state.normalized.x.toFixed(2)},${state.normalized.y.toFixed(2)})`}
                  label={`dirección normalizada ${state.normalized.x.toFixed(2)}, ${state.normalized.y.toFixed(2)}`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="detail-panel__content detail-panel__content--code">
            <div className="detail-copy">
              <span className="interface-label">Vector2</span>
              <h3>La misma operación en código</h3>
              <p>
                Los motores ya incluyen magnitud y normalización. El caso de longitud cero se
                controla para evitar divisiones inválidas.
              </p>
            </div>
            <div className="live-code-window">
              <CodeSnippet
                code={getVectorLabCode(programmingLanguage, state.x, state.y)}
                language={programmingLanguage}
                onLanguageChange={onLanguageChange}
                fileName={getExampleFileName('vectors', programmingLanguage)}
                compact
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
