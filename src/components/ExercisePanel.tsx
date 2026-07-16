import { useMemo, useState } from 'react'
import { MathExpression } from './MathExpression'

interface Exercise {
  id: string
  title: string
  skill: string
  prompt: string
  givenValues: Array<{ symbol: string; value: string }>
  expression: string
  expressionLabel: string
  answer: number
  unit: string
  hint: string
  success: string
}

const exercises: Exercise[] = [
  {
    id: 'final-velocity',
    title: 'Despegue del rover',
    skill: 'Calcular velocidad',
    prompt:
      'Un rover parte del reposo y mantiene una aceleración de 2 m/s² durante 4 segundos. ¿Cuál es su velocidad final?',
    givenValues: [
      { symbol: 'v₀', value: '0 m/s' },
      { symbol: 'a', value: '2 m/s²' },
      { symbol: 't', value: '4 s' },
    ],
    expression: 'v=v_0+at',
    expressionLabel: 'velocidad es igual a velocidad inicial más aceleración por tiempo',
    answer: 8,
    unit: 'm/s',
    hint: 'Sustituye los tres datos en v = v₀ + at. El término v₀ desaparece porque vale cero.',
    success: 'v = 0 + (2 × 4) = 8 m/s. Has conectado aceleración, tiempo y velocidad.',
  },
  {
    id: 'constant-position',
    title: 'Nave en crucero',
    skill: 'Calcular posición',
    prompt:
      'Una nave empieza en x₀ = 2 m y avanza a velocidad constante de 5 m/s durante 6 segundos. ¿En qué posición termina?',
    givenValues: [
      { symbol: 'x₀', value: '2 m' },
      { symbol: 'v', value: '5 m/s' },
      { symbol: 't', value: '6 s' },
    ],
    expression: 'x=x_0+vt',
    expressionLabel: 'posición es igual a posición inicial más velocidad por tiempo',
    answer: 32,
    unit: 'm',
    hint: 'Como la aceleración es cero, basta con sumar el desplazamiento vt a la posición inicial.',
    success: 'x = 2 + (5 × 6) = 32 m. Recuerda: posición y distancia recorrida no son lo mismo.',
  },
  {
    id: 'find-acceleration',
    title: 'Cambio de ritmo',
    skill: 'Despejar aceleración',
    prompt:
      'La velocidad de un vehículo cambia de 3 m/s a 15 m/s en 4 segundos. ¿Cuál fue su aceleración media?',
    givenValues: [
      { symbol: 'v₀', value: '3 m/s' },
      { symbol: 'v', value: '15 m/s' },
      { symbol: 't', value: '4 s' },
    ],
    expression: 'a=\\frac{v-v_0}{t}',
    expressionLabel: 'aceleración es igual a velocidad final menos velocidad inicial dividido por tiempo',
    answer: 3,
    unit: 'm/s²',
    hint: 'Primero calcula el cambio de velocidad: 15 − 3. Después repártelo entre los 4 segundos.',
    success: 'a = (15 − 3) / 4 = 3 m/s². También has practicado despeje algebraico.',
  },
]

interface ExercisePanelProps {
  completedIds: string[]
  onComplete: (exerciseId: string) => void
}

export function ExercisePanel({ completedIds, onComplete }: ExercisePanelProps) {
  const firstIncompleteIndex = exercises.findIndex(
    (exercise) => !completedIds.includes(exercise.id),
  )
  const [activeIndex, setActiveIndex] = useState(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle')
  const [isHintVisible, setIsHintVisible] = useState(false)
  const exercise = exercises[activeIndex]
  const completedCount = completedIds.length
  const progress = useMemo(
    () => Math.round((completedCount / exercises.length) * 100),
    [completedCount],
  )

  const selectExercise = (index: number) => {
    setActiveIndex(index)
    setAnswer('')
    setFeedback('idle')
    setIsHintVisible(false)
  }

  const checkAnswer = () => {
    const numericAnswer = Number(answer.replace(',', '.'))
    const isCorrect =
      Number.isFinite(numericAnswer) && Math.abs(numericAnswer - exercise.answer) < 0.01

    if (isCorrect) {
      setFeedback('success')
      onComplete(exercise.id)
      return
    }

    setFeedback('error')
  }

  const openNextExercise = () => {
    const nextIndex = (activeIndex + 1) % exercises.length
    selectExercise(nextIndex)
  }

  return (
    <section className="practice-workspace" aria-labelledby="practice-title">
      <header className="practice-header">
        <div>
          <span className="interface-label">Sesión de práctica</span>
          <h2 id="practice-title">Tres problemas, una misma idea</h2>
          <p>No memorices el resultado. Identifica primero qué cambia y qué conoces.</p>
        </div>
        <div className="practice-progress" aria-label={`${completedCount} de 3 ejercicios completados`}>
          <strong>{completedCount}<span>/3</span></strong>
          <div>
            <span>Dominio de la lección</span>
            <div className="practice-progress__track"><i style={{ width: `${progress}%` }} /></div>
          </div>
        </div>
      </header>

      <div className="practice-layout">
        <nav className="exercise-navigation" aria-label="Lista de problemas">
          {exercises.map((item, index) => {
            const isCompleted = completedIds.includes(item.id)
            const isActive = index === activeIndex
            return (
              <button
                key={item.id}
                type="button"
                className={isActive ? 'exercise-navigation__item--active' : ''}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => selectExercise(index)}
              >
                <span className={isCompleted ? 'exercise-status exercise-status--complete' : 'exercise-status'}>
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.skill}</small>
                </span>
              </button>
            )
          })}

          <div className="exercise-navigation__note">
            <span aria-hidden="true">↵</span>
            <p>Puedes usar <kbd>Enter</kbd> para comprobar tu respuesta.</p>
          </div>
        </nav>

        <article className="challenge-panel">
          <div className="challenge-panel__heading">
            <div>
              <span className="interface-label">Problema {activeIndex + 1} · {exercise.skill}</span>
              <h3>{exercise.title}</h3>
            </div>
            <span className="challenge-difficulty">Base</span>
          </div>

          <p className="challenge-prompt">{exercise.prompt}</p>

          <div className="known-values" aria-label="Datos conocidos">
            {exercise.givenValues.map((givenValue) => (
              <div key={givenValue.symbol}>
                <span>{givenValue.symbol}</span>
                <strong>{givenValue.value}</strong>
              </div>
            ))}
          </div>

          <div className="challenge-equation">
            <span>Ecuación útil</span>
            <MathExpression
              expression={exercise.expression}
              display
              label={exercise.expressionLabel}
            />
          </div>

          <div className="answer-workbench">
            <label htmlFor="exercise-answer">Tu resultado</label>
            <div className="answer-workbench__row">
              <div className="answer-input">
                <input
                  id="exercise-answer"
                  inputMode="decimal"
                  autoComplete="off"
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value)
                    setFeedback('idle')
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') checkAnswer()
                  }}
                  aria-describedby="answer-feedback"
                />
                <span>{exercise.unit}</span>
              </div>
              <button className="app-button app-button--primary" type="button" onClick={checkAnswer}>
                Comprobar respuesta
              </button>
            </div>
            <button
              className="hint-button"
              type="button"
              aria-expanded={isHintVisible}
              onClick={() => setIsHintVisible((currentValue) => !currentValue)}
            >
              {isHintVisible ? 'Ocultar pista' : 'Estoy atascado: mostrar pista'}
            </button>
          </div>

          <div id="answer-feedback" className="answer-feedback" aria-live="polite">
            {isHintVisible && feedback !== 'success' && (
              <p className="answer-feedback__hint"><strong>Pista</strong>{exercise.hint}</p>
            )}
            {feedback === 'error' && (
              <p className="answer-feedback__error"><strong>Revisa el planteamiento</strong>El resultado no coincide. Comprueba los signos, la sustitución y las unidades.</p>
            )}
            {feedback === 'success' && (
              <div className="answer-feedback__success">
                <span aria-hidden="true">✓</span>
                <p><strong>Respuesta correcta</strong>{exercise.success}</p>
                <button type="button" onClick={openNextExercise}>Siguiente problema →</button>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
