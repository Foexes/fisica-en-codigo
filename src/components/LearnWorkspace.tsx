import { useState } from 'react'
import {
  getConceptCode,
  type ConceptCodeId,
  type ProgrammingLanguage,
} from '../lib/codeExamples'
import { CodeSnippet } from './CodeSnippet'
import { MathExpression } from './MathExpression'

interface ConceptStep {
  id: string
  number: string
  name: string
  question: string
  explanation: string
  expression: string
  expressionLabel: string
  codeId: ConceptCodeId
  unit: string
  example: string
  insight: string
}

const conceptSteps: ConceptStep[] = [
  {
    id: 'position',
    number: '01',
    name: 'Posición',
    question: '¿Dónde está?',
    explanation:
      'La posición no dice cuánto has recorrido. Describe un punto respecto a un origen que elegimos como referencia.',
    expression: 'x(t)',
    expressionLabel: 'posición x en función del tiempo',
    codeId: 'position',
    unit: 'metros (m)',
    example: 'x = −3 m significa tres metros a la izquierda del origen.',
    insight: 'Es una variable de estado: una fotografía del sistema.',
  },
  {
    id: 'velocity',
    number: '02',
    name: 'Velocidad',
    question: '¿Cómo cambia su posición?',
    explanation:
      'La velocidad conecta el paso del tiempo con el cambio de posición. Su signo también conserva la dirección.',
    expression: 'v=\\frac{\\Delta x}{\\Delta t}',
    expressionLabel: 'velocidad es igual al cambio de posición dividido por el cambio de tiempo',
    codeId: 'velocity',
    unit: 'metros por segundo (m/s)',
    example: 'v = 4 m/s suma cuatro metros de posición por cada segundo.',
    insight: 'Es una tasa de cambio: cuánto cambia una variable por unidad de tiempo.',
  },
  {
    id: 'acceleration',
    number: '03',
    name: 'Aceleración',
    question: '¿Cómo cambia su velocidad?',
    explanation:
      'La aceleración no significa simplemente “ir rápido”. Mide cómo cambia la velocidad: su magnitud, su dirección o ambas.',
    expression: 'a=\\frac{\\Delta v}{\\Delta t}',
    expressionLabel: 'aceleración es igual al cambio de velocidad dividido por el cambio de tiempo',
    codeId: 'acceleration',
    unit: 'metros por segundo al cuadrado (m/s²)',
    example: 'a = 2 m/s² añade 2 m/s a la velocidad cada segundo.',
    insight: 'Es un cambio del cambio: una segunda capa de comportamiento.',
  },
]

interface LearnWorkspaceProps {
  programmingLanguage: ProgrammingLanguage
  onLanguageChange: (language: ProgrammingLanguage) => void
  onOpenLab: () => void
}

export function LearnWorkspace({
  programmingLanguage,
  onLanguageChange,
  onOpenLab,
}: LearnWorkspaceProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const activeStep = conceptSteps[activeStepIndex]

  return (
    <section className="learn-workspace" aria-label="Conceptos fundamentales">
      <div className="concept-stepper" aria-label="Conceptos de la lección">
        {conceptSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={index === activeStepIndex ? 'concept-stepper__item--active' : ''}
            aria-pressed={index === activeStepIndex}
            onClick={() => setActiveStepIndex(index)}
          >
            <span>{step.number}</span>
            <strong>{step.name}</strong>
            <small>{step.question}</small>
          </button>
        ))}
      </div>

      <article className="concept-reader">
        <div className="concept-reader__copy">
          <span className="interface-label">Concepto {activeStep.number}</span>
          <h2>{activeStep.question}</h2>
          <p className="concept-reader__lead">{activeStep.explanation}</p>

          <div className="concept-equation">
            <MathExpression
              expression={activeStep.expression}
              display
              label={activeStep.expressionLabel}
            />
            <span>{activeStep.unit}</span>
          </div>

          <dl className="concept-details">
            <div>
              <dt>Ejemplo mental</dt>
              <dd>{activeStep.example}</dd>
            </div>
            <div>
              <dt>Patrón de programación</dt>
              <dd>{activeStep.insight}</dd>
            </div>
          </dl>
        </div>

        <div className="concept-reader__code">
          <CodeSnippet
            code={getConceptCode(activeStep.codeId, programmingLanguage)}
            language={programmingLanguage}
            onLanguageChange={onLanguageChange}
          />
          <div className="code-window__translation">
            <span aria-hidden="true">↳</span>
            <p>
              <strong>Traducción</strong>
              El código conserva exactamente la misma relación entre estado, cambio y tiempo.
            </p>
          </div>
        </div>
      </article>

      <div className="learn-actions">
        <span>{activeStepIndex + 1} de {conceptSteps.length} conceptos</span>
        <div>
          <button
            className="app-button app-button--secondary"
            type="button"
            disabled={activeStepIndex === 0}
            onClick={() => setActiveStepIndex((current) => Math.max(0, current - 1))}
          >
            Anterior
          </button>
          {activeStepIndex < conceptSteps.length - 1 ? (
            <button
              className="app-button app-button--primary"
              type="button"
              onClick={() => setActiveStepIndex((current) => current + 1)}
            >
              Siguiente concepto
            </button>
          ) : (
            <button className="app-button app-button--primary" type="button" onClick={onOpenLab}>
              Abrir laboratorio
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
