import { useEffect, useMemo, useRef, useState } from 'react'
import { getMotionLoopCode, type ProgrammingLanguage } from '../lib/codeExamples'
import type { MotionParameters } from '../lib/physics'
import { calculateMotionState, formatNumber } from '../lib/physics'
import { CodeSnippet } from './CodeSnippet'
import { MathExpression } from './MathExpression'
import { MotionTrack } from './MotionTrack'
import { PositionChart } from './PositionChart'

type DetailView = 'chart' | 'code'

interface MotionPreset {
  id: string
  label: string
  description: string
  parameters: MotionParameters
}

const maxTime = 10

const presets: MotionPreset[] = [
  {
    id: 'constant',
    label: 'Velocidad constante',
    description: 'Sin aceleración',
    parameters: { initialPosition: 0, initialVelocity: 5, acceleration: 0 },
  },
  {
    id: 'launch',
    label: 'Arranque',
    description: 'Acelera desde reposo',
    parameters: { initialPosition: 0, initialVelocity: 0, acceleration: 2 },
  },
  {
    id: 'braking',
    label: 'Frenado',
    description: 'Aceleración opuesta',
    parameters: { initialPosition: 0, initialVelocity: 10, acceleration: -1.5 },
  },
]

interface LabWorkspaceProps {
  programmingLanguage: ProgrammingLanguage
  onLanguageChange: (language: ProgrammingLanguage) => void
}

export function LabWorkspace({
  programmingLanguage,
  onLanguageChange,
}: LabWorkspaceProps) {
  const [parameters, setParameters] = useState<MotionParameters>(presets[1].parameters)
  const [activePresetId, setActivePresetId] = useState<string | null>('launch')
  const [time, setTime] = useState(3)
  const [isPlaying, setIsPlaying] = useState(false)
  const [detailView, setDetailView] = useState<DetailView>('chart')
  const previousFrameRef = useRef<number | null>(null)
  const state = calculateMotionState(parameters, time)

  useEffect(() => {
    if (!isPlaying) {
      previousFrameRef.current = null
      return
    }

    let animationFrameId = 0
    const animate = (timestamp: number) => {
      if (previousFrameRef.current === null) previousFrameRef.current = timestamp
      const elapsedSeconds = (timestamp - previousFrameRef.current) / 1000
      previousFrameRef.current = timestamp

      setTime((currentTime) => {
        const nextTime = currentTime + elapsedSeconds
        if (nextTime >= maxTime) {
          setIsPlaying(false)
          return maxTime
        }
        animationFrameId = requestAnimationFrame(animate)
        return nextTime
      })
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isPlaying])

  const motionRange = useMemo(() => {
    const samplePositions = Array.from({ length: 101 }, (_, index) =>
      calculateMotionState(parameters, (index / 100) * maxTime).position,
    )
    const minimum = Math.min(0, ...samplePositions)
    const maximum = Math.max(0, ...samplePositions)
    const margin = Math.max((maximum - minimum) * 0.08, 1)
    return { min: minimum - margin, max: maximum + margin }
  }, [parameters])

  const movementDescription = useMemo(() => {
    if (Math.abs(parameters.acceleration) < 0.01) return 'La velocidad se mantiene constante.'
    if (Math.abs(state.velocity) < 0.2) return 'El objeto está a punto de cambiar de dirección.'
    if (parameters.acceleration * state.velocity > 0) return 'La rapidez está aumentando.'
    return 'La rapidez está disminuyendo.'
  }, [parameters.acceleration, state.velocity])

  const updateParameter = (key: keyof MotionParameters, value: number) => {
    setActivePresetId(null)
    setParameters((currentParameters) => ({ ...currentParameters, [key]: value }))
  }

  const applyPreset = (preset: MotionPreset) => {
    setIsPlaying(false)
    setTime(0)
    setParameters(preset.parameters)
    setActivePresetId(preset.id)
  }

  const resetSimulation = () => {
    setIsPlaying(false)
    setTime(0)
  }

  const togglePlayback = () => {
    if (time >= maxTime) setTime(0)
    setIsPlaying((currentValue) => !currentValue)
  }

  return (
    <section className="lab-workspace" aria-label="Laboratorio de movimiento">
      <div className="lab-toolbar">
        <div className="preset-selector" aria-label="Escenarios rápidos">
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
          <span className={isPlaying ? 'simulation-state__dot simulation-state__dot--running' : 'simulation-state__dot'} />
          {isPlaying ? 'Simulación en curso' : 'Simulación pausada'}
        </div>
      </div>

      <div className="lab-layout">
        <div className="simulation-stage">
          <div className="stage-readout">
            <div>
              <span>Posición</span>
              <strong>{formatNumber(state.position)} <small>m</small></strong>
            </div>
            <div>
              <span>Velocidad</span>
              <strong>{formatNumber(state.velocity)} <small>m/s</small></strong>
            </div>
            <div>
              <span>Tiempo</span>
              <strong>{formatNumber(time)} <small>s</small></strong>
            </div>
            <p>{movementDescription}</p>
          </div>

          <MotionTrack state={state} range={motionRange} />

          <div className="transport-bar">
            <div className="transport-actions">
              <button
                className="transport-button transport-button--play"
                type="button"
                aria-label={isPlaying ? 'Pausar simulación' : 'Reproducir simulación'}
                onClick={togglePlayback}
              >
                <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '▶'}</span>
                {isPlaying ? 'Pausar' : time >= maxTime ? 'Repetir' : 'Reproducir'}
              </button>
              <button className="transport-button" type="button" onClick={resetSimulation}>
                Reiniciar
              </button>
            </div>
            <label className="timeline-control">
              <span className="sr-only">Instante de la simulación</span>
              <input
                type="range"
                min="0"
                max={maxTime}
                step="0.1"
                value={time}
                onChange={(event) => {
                  setIsPlaying(false)
                  setTime(Number(event.target.value))
                }}
              />
              <output>{formatNumber(time)} / {maxTime} s</output>
            </label>
          </div>

          <div className="live-equation" aria-label="Sustitución actual en la ecuación de posición">
            <span>Ecuación en vivo</span>
            <MathExpression
              expression={`x(${time.toFixed(1)})=${parameters.initialPosition.toFixed(1)}+(${parameters.initialVelocity.toFixed(1)})(${time.toFixed(1)})+\\frac{1}{2}(${parameters.acceleration.toFixed(1)})(${time.toFixed(1)})^2=${state.position.toFixed(1)}\\,m`}
              label={`La posición calculada es ${formatNumber(state.position)} metros`}
            />
          </div>
        </div>

        <aside className="parameter-dock" aria-label="Parámetros de la simulación">
          <div className="parameter-dock__heading">
            <div>
              <span className="interface-label">Entradas</span>
              <h2>Parámetros</h2>
            </div>
            <span className="parameter-dock__custom-state">
              {activePresetId === null ? 'Personalizado' : 'Preset'}
            </span>
          </div>

          <label className="parameter-control">
            <span>
              <span><b>x₀</b> Posición inicial</span>
              <output>{formatNumber(parameters.initialPosition)} m</output>
            </span>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={parameters.initialPosition}
              onChange={(event) => updateParameter('initialPosition', Number(event.target.value))}
            />
            <small><span>−10</span><span>10</span></small>
          </label>

          <label className="parameter-control">
            <span>
              <span><b>v₀</b> Velocidad inicial</span>
              <output>{formatNumber(parameters.initialVelocity)} m/s</output>
            </span>
            <input
              type="range"
              min="-8"
              max="12"
              step="0.5"
              value={parameters.initialVelocity}
              onChange={(event) => updateParameter('initialVelocity', Number(event.target.value))}
            />
            <small><span>−8</span><span>12</span></small>
          </label>

          <label className="parameter-control">
            <span>
              <span><b>a</b> Aceleración</span>
              <output>{formatNumber(parameters.acceleration)} m/s²</output>
            </span>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.2"
              value={parameters.acceleration}
              onChange={(event) => updateParameter('acceleration', Number(event.target.value))}
            />
            <small><span>−4</span><span>4</span></small>
          </label>

          <div className="parameter-dock__tip">
            <span aria-hidden="true">i</span>
            <p><strong>Prueba esto</strong> Pon una velocidad positiva y una aceleración negativa. Observa cuándo cambia de dirección.</p>
          </div>
        </aside>
      </div>

      <div className="detail-panel">
        <div className="detail-panel__tabs" role="tablist" aria-label="Representación del movimiento">
          <button
            type="button"
            role="tab"
            aria-selected={detailView === 'chart'}
            onClick={() => setDetailView('chart')}
          >
            Gráfica
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

        {detailView === 'chart' ? (
          <div className="detail-panel__content detail-panel__content--chart">
            <div className="detail-copy">
              <span className="interface-label">Posición / tiempo</span>
              <h3>La trayectoria deja una huella</h3>
              <p>La inclinación de la curva representa la velocidad. Si la curva se dobla, hay aceleración.</p>
              <span className="detail-copy__current">Instante actual · {formatNumber(time)} s</span>
            </div>
            <PositionChart parameters={parameters} currentState={state} maxTime={maxTime} />
          </div>
        ) : (
          <div className="detail-panel__content detail-panel__content--code">
            <div className="detail-copy">
              <span className="interface-label">Integración numérica</span>
              <h3>La fórmula convertida en loop</h3>
              <p>Cada frame suma una porción pequeña del cambio. <code>delta</code> mantiene el movimiento independiente del framerate.</p>
            </div>
            <div className="live-code-window">
              <CodeSnippet
                code={getMotionLoopCode(programmingLanguage, parameters)}
                language={programmingLanguage}
                onLanguageChange={onLanguageChange}
                compact
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
