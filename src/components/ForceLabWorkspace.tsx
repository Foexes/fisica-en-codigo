import { useMemo, useState } from 'react'
import {
  getExampleFileName,
  getForceLabCode,
  type ProgrammingLanguage,
} from '../lib/codeExamples'
import {
  calculateForceState,
  type ForceParameters,
} from '../lib/forces'
import { formatNumber } from '../lib/physics'
import { CodeSnippet } from './CodeSnippet'
import { ForceDiagram } from './ForceDiagram'
import { MathExpression } from './MathExpression'

type DetailView = 'breakdown' | 'code'

interface ForcePreset {
  id: string
  label: string
  description: string
  parameters: ForceParameters
}

const presets: ForcePreset[] = [
  {
    id: 'push',
    label: 'Empuje libre',
    description: 'La aplicada domina',
    parameters: { appliedForce: 18, resistanceForce: 4, mass: 7 },
  },
  {
    id: 'balance',
    label: 'Equilibrio',
    description: 'La resultante es cero',
    parameters: { appliedForce: 12, resistanceForce: 12, mass: 6 },
  },
  {
    id: 'light',
    label: 'Objeto ligero',
    description: 'Misma fuerza, más cambio',
    parameters: { appliedForce: 10, resistanceForce: 2, mass: 2 },
  },
  {
    id: 'braking',
    label: 'Frenado',
    description: 'La resistencia domina',
    parameters: { appliedForce: 4, resistanceForce: 16, mass: 6 },
  },
]

interface ForceLabWorkspaceProps {
  programmingLanguage: ProgrammingLanguage
  onLanguageChange: (language: ProgrammingLanguage) => void
}

export function ForceLabWorkspace({
  programmingLanguage,
  onLanguageChange,
}: ForceLabWorkspaceProps) {
  const [parameters, setParameters] = useState<ForceParameters>(presets[0].parameters)
  const [activePresetId, setActivePresetId] = useState<string | null>('push')
  const [detailView, setDetailView] = useState<DetailView>('breakdown')
  const state = calculateForceState(parameters)

  const behaviorDescription = useMemo(() => {
    if (Math.abs(state.netForce) < 0.01) {
      return 'Fuerzas equilibradas: la velocidad no cambia.'
    }
    const direction = state.netForce > 0 ? 'derecha' : 'izquierda'
    return `La velocidad cambia hacia la ${direction}.`
  }, [state.netForce])

  const updateParameter = (key: keyof ForceParameters, value: number) => {
    setActivePresetId(null)
    setParameters((currentParameters) => ({
      ...currentParameters,
      [key]: value,
    }))
  }

  const applyPreset = (preset: ForcePreset) => {
    setParameters(preset.parameters)
    setActivePresetId(preset.id)
  }

  return (
    <section className="lab-workspace" aria-label="Laboratorio de fuerzas">
      <div className="lab-toolbar">
        <div className="preset-selector" aria-label="Escenarios de fuerzas">
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
          Diagrama actualizado en vivo
        </div>
      </div>

      <div className="lab-layout">
        <div className="simulation-stage force-stage">
          <div className="stage-readout stage-readout--force">
            <div>
              <span>Aplicada →</span>
              <strong>{formatNumber(state.appliedForce)} <small>N</small></strong>
            </div>
            <div>
              <span>Resistencia ←</span>
              <strong>{formatNumber(state.resistanceForce)} <small>N</small></strong>
            </div>
            <div>
              <span>Fuerza neta</span>
              <strong>{formatNumber(state.netForce)} <small>N</small></strong>
            </div>
            <div>
              <span>Aceleración</span>
              <strong>{formatNumber(state.acceleration)} <small>m/s²</small></strong>
            </div>
            <p>{behaviorDescription}</p>
          </div>

          <ForceDiagram state={state} />

          <div className="live-equation" aria-label="Cálculo actual de fuerza y aceleración">
            <span>Segunda ley en vivo</span>
            <MathExpression
              expression={`F_{net}=(${state.appliedForce.toFixed(1)})-(${state.resistanceForce.toFixed(1)})=${state.netForce.toFixed(1)},\\quad a=\\frac{${state.netForce.toFixed(1)}}{${state.mass.toFixed(1)}}=${state.acceleration.toFixed(2)}`}
              label={`La fuerza neta es ${formatNumber(state.netForce)} newtons y la aceleración ${formatNumber(state.acceleration)} metros por segundo al cuadrado`}
            />
          </div>
        </div>

        <aside className="parameter-dock" aria-label="Parámetros de fuerzas">
          <div className="parameter-dock__heading">
            <div>
              <span className="interface-label">Entradas</span>
              <h2>Fnet = ma</h2>
            </div>
            <span className="parameter-dock__custom-state">
              {activePresetId === null ? 'Personalizado' : 'Preset'}
            </span>
          </div>

          <label className="parameter-control">
            <span>
              <span><b>→</b> Fuerza aplicada</span>
              <output>{formatNumber(state.appliedForce)} N</output>
            </span>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={state.appliedForce}
              onChange={(event) => updateParameter('appliedForce', Number(event.target.value))}
            />
            <small><span>0 N</span><span>30 N</span></small>
          </label>

          <label className="parameter-control">
            <span>
              <span><b>←</b> Resistencia</span>
              <output>{formatNumber(state.resistanceForce)} N</output>
            </span>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={state.resistanceForce}
              onChange={(event) => updateParameter('resistanceForce', Number(event.target.value))}
            />
            <small><span>0 N</span><span>30 N</span></small>
          </label>

          <label className="parameter-control">
            <span>
              <span><b>m</b> Masa</span>
              <output>{formatNumber(state.mass)} kg</output>
            </span>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={state.mass}
              onChange={(event) => updateParameter('mass', Number(event.target.value))}
            />
            <small><span>1 kg</span><span>15 kg</span></small>
          </label>

          <div className="parameter-dock__tip">
            <span aria-hidden="true">i</span>
            <p>
              <strong>Equilibrio no significa reposo</strong>
              Si Fnet = 0, la aceleración es cero. Un objeto que ya se mueve continúa con
              velocidad constante mientras las fuerzas sigan equilibradas.
            </p>
          </div>
        </aside>
      </div>

      <div className="detail-panel">
        <div className="detail-panel__tabs" role="tablist" aria-label="Representaciones de las fuerzas">
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
          <div className="detail-panel__content detail-panel__content--force">
            <div className="detail-copy">
              <span className="interface-label">Por ejes</span>
              <h3>Suma antes de dividir</h3>
              <p>
                Primero combina las fuerzas con su dirección. Solo después usa la masa
                para convertir la resultante en aceleración.
              </p>
              <span className="detail-copy__current">
                {Math.abs(state.netForce) < 0.01 ? 'Sistema equilibrado' : 'Sistema no equilibrado'}
              </span>
            </div>
            <div className="force-breakdown" aria-label="Descomposición numérica de fuerzas">
              <div>
                <span>Eje horizontal</span>
                <MathExpression
                  expression={`\\sum F_x=${state.appliedForce.toFixed(1)}-${state.resistanceForce.toFixed(1)}=${state.netForce.toFixed(1)}\\,N`}
                  label={`fuerza horizontal neta ${formatNumber(state.netForce)} newtons`}
                />
              </div>
              <div>
                <span>Eje vertical</span>
                <MathExpression
                  expression={`\\sum F_y=N-P=${state.normalForce.toFixed(1)}-${state.weight.toFixed(1)}=0`}
                  label="la fuerza normal y el peso se equilibran verticalmente"
                />
              </div>
              <div>
                <span>Efecto sobre el movimiento</span>
                <MathExpression
                  expression={`a=\\frac{\\sum F_x}{m}=${state.acceleration.toFixed(2)}\\,m/s^2`}
                  label={`aceleración ${formatNumber(state.acceleration)} metros por segundo al cuadrado`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="detail-panel__content detail-panel__content--code">
            <div className="detail-copy">
              <span className="interface-label">Physics step</span>
              <h3>De fuerzas a velocidad</h3>
              <p>
                El código calcula fuerza neta y aceleración. Después reutiliza
                <code> velocity += acceleration * delta</code>.
              </p>
            </div>
            <div className="live-code-window">
              <CodeSnippet
                code={getForceLabCode(
                  programmingLanguage,
                  state.appliedForce,
                  state.resistanceForce,
                  state.mass,
                )}
                language={programmingLanguage}
                onLanguageChange={onLanguageChange}
                fileName={getExampleFileName('forces', programmingLanguage)}
                compact
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
