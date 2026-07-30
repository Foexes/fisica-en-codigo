import { useState } from 'react'
import type { ConceptStep } from '../data/concepts'
import type { ProgrammingLanguage } from '../lib/codeExamples'
import { CodeSnippet } from './CodeSnippet'
import { MathExpression } from './MathExpression'

interface LearnWorkspaceProps {
  steps: ConceptStep[]
  getCode: (codeId: string, language: ProgrammingLanguage) => string
  getFileName: (language: ProgrammingLanguage) => string
  ariaLabel: string
  translation: string
  programmingLanguage: ProgrammingLanguage
  onLanguageChange: (language: ProgrammingLanguage) => void
  onOpenLab: () => void
}

export function LearnWorkspace({
  steps,
  getCode,
  getFileName,
  ariaLabel,
  translation,
  programmingLanguage,
  onLanguageChange,
  onOpenLab,
}: LearnWorkspaceProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const activeStep = steps[activeStepIndex]

  return (
    <section className="learn-workspace" aria-label={ariaLabel}>
      <div className="concept-stepper" aria-label="Conceptos de la lección">
        {steps.map((step, index) => (
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
            code={getCode(activeStep.codeId, programmingLanguage)}
            language={programmingLanguage}
            onLanguageChange={onLanguageChange}
            fileName={getFileName(programmingLanguage)}
          />
          <div className="code-window__translation">
            <span aria-hidden="true">↳</span>
            <p>
              <strong>Traducción</strong>
              {translation}
            </p>
          </div>
        </div>
      </article>

      <div className="learn-actions">
        <span>{activeStepIndex + 1} de {steps.length} conceptos</span>
        <div>
          <button
            className="app-button app-button--secondary"
            type="button"
            disabled={activeStepIndex === 0}
            onClick={() => setActiveStepIndex((current) => Math.max(0, current - 1))}
          >
            Anterior
          </button>
          {activeStepIndex < steps.length - 1 ? (
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
