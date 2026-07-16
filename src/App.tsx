import { useEffect, useState } from 'react'
import { LabWorkspace } from './components/LabWorkspace'
import { LearnWorkspace } from './components/LearnWorkspace'
import { ExercisePanel } from './components/ExercisePanel'
import {
  programmingLanguages,
  type ProgrammingLanguage,
} from './lib/codeExamples'

type StudyMode = 'learn' | 'lab' | 'practice'

interface StudyModeItem {
  id: StudyMode
  label: string
  shortLabel: string
  description: string
}

const studyModes: StudyModeItem[] = [
  {
    id: 'learn',
    label: 'Entender',
    shortLabel: '01',
    description: 'Construye la intuición',
  },
  {
    id: 'lab',
    label: 'Experimentar',
    shortLabel: '02',
    description: 'Toca las variables',
  },
  {
    id: 'practice',
    label: 'Practicar',
    shortLabel: '03',
    description: 'Comprueba lo aprendido',
  },
]

const modules = [
  { id: 'motion', number: '01', name: 'Movimiento', available: true },
  { id: 'vectors', number: '02', name: 'Vectores', available: false },
  { id: 'functions', number: '03', name: 'Funciones', available: false },
  { id: 'forces', number: '04', name: 'Fuerzas', available: false },
]

const storageKey = 'physics-in-code:completed-exercises'
const languageStorageKey = 'physics-in-code:programming-language'

export function App() {
  const [activeMode, setActiveMode] = useState<StudyMode>('lab')
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const [programmingLanguage, setProgrammingLanguage] = useState<ProgrammingLanguage>(() => {
    try {
      const storedLanguage = localStorage.getItem(languageStorageKey)
      const isSupported = programmingLanguages.some((item) => item.id === storedLanguage)
      return isSupported ? (storedLanguage as ProgrammingLanguage) : 'luau'
    } catch {
      return 'luau'
    }
  })
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(() => {
    try {
      const storedValue = localStorage.getItem(storageKey)
      return storedValue ? (JSON.parse(storedValue) as string[]) : []
    } catch {
      return []
    }
  })

  const activeModeItem = studyModes.find((mode) => mode.id === activeMode) ?? studyModes[0]
  const lessonProgress = Math.round((completedExerciseIds.length / 3) * 100)

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select')) return

      const modeIndex = Number(event.key) - 1
      const selectedMode = studyModes[modeIndex]
      if (selectedMode) setActiveMode(selectedMode.id)
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(languageStorageKey, programmingLanguage)
    } catch {
      // The selector still works when storage is unavailable.
    }
  }, [programmingLanguage])

  const completeExercise = (exerciseId: string) => {
    setCompletedExerciseIds((currentIds) => {
      if (currentIds.includes(exerciseId)) return currentIds
      const nextIds = [...currentIds, exerciseId]
      localStorage.setItem(storageKey, JSON.stringify(nextIds))
      return nextIds
    })
  }

  const selectMode = (mode: StudyMode) => {
    setActiveMode(mode)
    setIsNavigationOpen(false)
  }

  return (
    <div className="app-frame">
      <header className="app-header">
        <button
          className="mobile-menu-button"
          type="button"
          aria-expanded={isNavigationOpen}
          aria-controls="course-navigation"
          onClick={() => setIsNavigationOpen((current) => !current)}
        >
          <span aria-hidden="true">☰</span>
          Menú
        </button>

        <a className="app-brand" href="#workspace" aria-label="Física en Código, inicio">
          <span className="app-brand__symbol" aria-hidden="true">ƒ</span>
          <span className="app-brand__name">Física <b>en Código</b></span>
          <span className="prototype-tag">α 0.3</span>
        </a>

        <div className="header-context" aria-label="Contexto actual">
          <span className="header-context__path">Fundamentos / Movimiento</span>
          <span className="header-context__separator" aria-hidden="true" />
          <span>{activeModeItem.label}</span>
        </div>

        <div className="header-progress" aria-label={`Progreso de práctica registrado: ${lessonProgress}%`}>
          <span>{lessonProgress}%</span>
          <div className="header-progress__track">
            <div style={{ width: `${lessonProgress}%` }} />
          </div>
        </div>
      </header>

      <aside
        id="course-navigation"
        className={`course-navigation ${isNavigationOpen ? 'course-navigation--open' : ''}`}
      >
        <div className="course-navigation__heading">
          <span className="interface-label">Curso actual</span>
          <strong>Fundamentos de física</strong>
          <span>Ruta previa a ingeniería</span>
        </div>

        <nav aria-label="Módulos">
          <span className="navigation-section-label">Módulos</span>
          <ol className="module-navigation">
            {modules.map((module) => (
              <li key={module.id}>
                <button
                  className={`module-navigation__item ${module.available ? 'module-navigation__item--active' : ''}`}
                  type="button"
                  disabled={!module.available}
                >
                  <span>{module.number}</span>
                  <strong>{module.name}</strong>
                  {module.available ? (
                    <i aria-label="Módulo activo" />
                  ) : (
                    <small aria-label="Próximamente">—</small>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <nav className="mode-navigation" aria-label="Modos de estudio">
          <span className="navigation-section-label">Lección 01</span>
          {studyModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`mode-navigation__item ${mode.id === activeMode ? 'mode-navigation__item--active' : ''}`}
              aria-current={mode.id === activeMode ? 'page' : undefined}
              onClick={() => selectMode(mode.id)}
            >
              <span>{mode.shortLabel}</span>
              <span>
                <strong>{mode.label}</strong>
                <small>{mode.description}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="navigation-shortcut">
          <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd>
          <span>Cambia de modo</span>
        </div>
      </aside>

      {isNavigationOpen && (
        <button
          className="navigation-scrim"
          type="button"
          aria-label="Cerrar navegación"
          onClick={() => setIsNavigationOpen(false)}
        />
      )}

      <main id="workspace" className="study-workspace">
        <div className="workspace-heading">
          <div>
            <span className="interface-label">Movimiento · Lección 01</span>
            <h1>Movimiento en una dimensión</h1>
          </div>
          <p>{activeModeItem.description}</p>
        </div>

        <div className="mobile-mode-switcher" aria-label="Cambiar modo de estudio">
          {studyModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              aria-pressed={mode.id === activeMode}
              onClick={() => selectMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {activeMode === 'learn' && (
          <LearnWorkspace
            programmingLanguage={programmingLanguage}
            onLanguageChange={setProgrammingLanguage}
            onOpenLab={() => selectMode('lab')}
          />
        )}
        {activeMode === 'lab' && (
          <LabWorkspace
            programmingLanguage={programmingLanguage}
            onLanguageChange={setProgrammingLanguage}
          />
        )}
        {activeMode === 'practice' && (
          <ExercisePanel
            completedIds={completedExerciseIds}
            onComplete={completeExercise}
          />
        )}
      </main>
    </div>
  )
}
