import { useMemo, useState } from 'react'
import {
  getExampleFileName,
  getFunctionLabCode,
  type ProgrammingLanguage,
} from '../lib/codeExamples'
import {
  calculateLinearFunctionState,
  sampleLinearFunction,
  type LinearFunctionParameters,
} from '../lib/functions'
import { formatNumber } from '../lib/physics'
import { CodeSnippet } from './CodeSnippet'
import { FunctionGraph } from './FunctionGraph'
import { MathExpression } from './MathExpression'

type DetailView = 'table' | 'code'

interface FunctionPreset {
  id: string
  label: string
  description: string
  parameters: LinearFunctionParameters
}

const presets: FunctionPreset[] = [
  {
    id: 'identity',
    label: 'Identidad',
    description: 'La salida copia la entrada',
    parameters: { slope: 1, intercept: 0 },
  },
  {
    id: 'motion',
    label: 'Posición uniforme',
    description: 'Empieza en 2 y avanza',
    parameters: { slope: 1, intercept: 2 },
  },
  {
    id: 'inverse',
    label: 'Pendiente negativa',
    description: 'La salida disminuye',
    parameters: { slope: -0.75, intercept: 1 },
  },
  {
    id: 'constant',
    label: 'Constante',
    description: 'Ignora la entrada',
    parameters: { slope: 0, intercept: 3 },
  },
]

const tableInputs = [-4, -2, 0, 2, 4]

interface FunctionLabWorkspaceProps {
  programmingLanguage: ProgrammingLanguage
  onLanguageChange: (language: ProgrammingLanguage) => void
}

export function FunctionLabWorkspace({
  programmingLanguage,
  onLanguageChange,
}: FunctionLabWorkspaceProps) {
  const [parameters, setParameters] = useState<LinearFunctionParameters>(
    presets[1].parameters,
  )
  const [input, setInput] = useState(3)
  const [activePresetId, setActivePresetId] = useState<string | null>('motion')
  const [detailView, setDetailView] = useState<DetailView>('table')
  const state = calculateLinearFunctionState(parameters, input)
  const samples = sampleLinearFunction(parameters, tableInputs)

  const behaviorDescription = useMemo(() => {
    if (Math.abs(state.slope) < 0.01) {
      return 'Es constante: cambiar x no modifica la salida.'
    }
    if (state.slope > 0) {
      return `Es creciente: cada +1 en x suma ${formatNumber(state.slope)} a la salida.`
    }
    return `Es decreciente: cada +1 en x resta ${formatNumber(Math.abs(state.slope))} a la salida.`
  }, [state.slope])

  const updateParameter = (key: keyof LinearFunctionParameters, value: number) => {
    setActivePresetId(null)
    setParameters((currentParameters) => ({
      ...currentParameters,
      [key]: value,
    }))
  }

  const applyPreset = (preset: FunctionPreset) => {
    setParameters(preset.parameters)
    setActivePresetId(preset.id)
  }

  return (
    <section className="lab-workspace" aria-label="Laboratorio de funciones">
      <div className="lab-toolbar">
        <div className="preset-selector" aria-label="Funciones de ejemplo">
          <span className="interface-label">Regla</span>
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
          Gráfica actualizada en vivo
        </div>
      </div>

      <div className="lab-layout">
        <div className="simulation-stage function-stage">
          <div className="stage-readout stage-readout--function">
            <div>
              <span>Entrada</span>
              <strong>{formatNumber(state.input)}</strong>
            </div>
            <div>
              <span>Salida f(x)</span>
              <strong>{formatNumber(state.output)}</strong>
            </div>
            <div>
              <span>Pendiente m</span>
              <strong>{formatNumber(state.slope)}</strong>
            </div>
            <div>
              <span>Inicial b</span>
              <strong>{formatNumber(state.intercept)}</strong>
            </div>
            <p>{behaviorDescription}</p>
          </div>

          <FunctionGraph state={state} />

          <div className="live-equation" aria-label="Evaluación actual de la función">
            <span>Evaluación en vivo</span>
            <MathExpression
              expression={`f(${state.input.toFixed(1)})=(${state.slope.toFixed(2)})(${state.input.toFixed(1)})+(${state.intercept.toFixed(2)})=${state.output.toFixed(2)}`}
              label={`f de ${formatNumber(state.input)} produce ${formatNumber(state.output)}`}
            />
          </div>
        </div>

        <aside className="parameter-dock" aria-label="Parámetros de la función">
          <div className="parameter-dock__heading">
            <div>
              <span className="interface-label">Entradas</span>
              <h2>f(x) = mx + b</h2>
            </div>
            <span className="parameter-dock__custom-state">
              {activePresetId === null ? 'Personalizada' : 'Preset'}
            </span>
          </div>

          <label className="parameter-control">
            <span>
              <span><b>x</b> Entrada</span>
              <output>{formatNumber(state.input)}</output>
            </span>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.5"
              value={state.input}
              onChange={(event) => setInput(Number(event.target.value))}
            />
            <small><span>−6</span><span>6</span></small>
          </label>

          <label className="parameter-control">
            <span>
              <span><b>m</b> Pendiente</span>
              <output>{formatNumber(state.slope)}</output>
            </span>
            <input
              type="range"
              min="-1.25"
              max="1.25"
              step="0.25"
              value={state.slope}
              onChange={(event) => updateParameter('slope', Number(event.target.value))}
            />
            <small><span>−1,25</span><span>1,25</span></small>
          </label>

          <label className="parameter-control">
            <span>
              <span><b>b</b> Salida inicial</span>
              <output>{formatNumber(state.intercept)}</output>
            </span>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.5"
              value={state.intercept}
              onChange={(event) => updateParameter('intercept', Number(event.target.value))}
            />
            <small><span>−4</span><span>4</span></small>
          </label>

          <div className="parameter-dock__tip">
            <span aria-hidden="true">i</span>
            <p>
              <strong>Traducción directa</strong>
              Mover x equivale a cambiar el argumento de <code>f(x)</code>. Modificar m o b
              cambia la implementación de la función.
            </p>
          </div>
        </aside>
      </div>

      <div className="detail-panel">
        <div className="detail-panel__tabs" role="tablist" aria-label="Representaciones de la función">
          <button
            type="button"
            role="tab"
            aria-selected={detailView === 'table'}
            onClick={() => setDetailView('table')}
          >
            Tabla de valores
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

        {detailView === 'table' ? (
          <div className="detail-panel__content detail-panel__content--function">
            <div className="detail-copy">
              <span className="interface-label">Misma regla</span>
              <h3>De tabla a gráfica</h3>
              <p>
                Cada columna es una llamada distinta a la misma función. Sus pares
                <code> (x, f(x)) </code> forman puntos sobre la recta.
              </p>
              <span className="detail-copy__current">
                f({formatNumber(state.input)}) = {formatNumber(state.output)}
              </span>
            </div>
            <div className="function-value-table-shell">
              <table className="function-value-table">
                <caption>Valores de la función lineal actual</caption>
                <tbody>
                  <tr>
                    <th scope="row">x</th>
                    {samples.map((sample) => (
                      <td key={`function-input-${sample.input}`}>{formatNumber(sample.input)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">f(x)</th>
                    {samples.map((sample) => (
                      <td key={`function-output-${sample.input}`}>{formatNumber(sample.output)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="detail-panel__content detail-panel__content--code">
            <div className="detail-copy">
              <span className="interface-label">Function call</span>
              <h3>La fórmula como función</h3>
              <p>
                El parámetro recibe x, <code>return</code> calcula mx + b y el valor
                devuelto es f(x).
              </p>
            </div>
            <div className="live-code-window">
              <CodeSnippet
                code={getFunctionLabCode(
                  programmingLanguage,
                  state.slope,
                  state.intercept,
                  state.input,
                )}
                language={programmingLanguage}
                onLanguageChange={onLanguageChange}
                fileName={getExampleFileName('functions', programmingLanguage)}
                compact
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
