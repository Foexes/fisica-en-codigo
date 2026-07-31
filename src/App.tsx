import { useEffect, useState } from 'react'
import { LabWorkspace } from './components/LabWorkspace'
import { LearnWorkspace } from './components/LearnWorkspace'
import { ExercisePanel } from './components/ExercisePanel'
import { ForceLabWorkspace } from './components/ForceLabWorkspace'
import { FunctionLabWorkspace } from './components/FunctionLabWorkspace'
import { VectorLabWorkspace } from './components/VectorLabWorkspace'
import { exerciseSets } from './data/exercises'
import {
  getExampleFileName,
  programmingLanguages,
  type ProgrammingLanguage,
} from './lib/codeExamples'
import {
  courseModules,
  getCourseModule,
  type CourseModuleId,
} from './lib/course'
import { getModuleContent } from './lib/moduleContent'
import { usePwaInstall } from './hooks/usePwaInstall'

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

type ModuleProgress = Partial<Record<CourseModuleId, string[]>>

const legacyProgressStorageKey = 'physics-in-code:completed-exercises'
const moduleProgressStorageKey = 'physics-in-code:module-progress'
const languageStorageKey = 'physics-in-code:programming-language'

function sanitizeModuleProgress(value: unknown): ModuleProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  return courseModules.reduce<ModuleProgress>((progress, courseModule) => {
    const storedIds = (value as Record<string, unknown>)[courseModule.id]
    if (!Array.isArray(storedIds)) return progress

    progress[courseModule.id] = storedIds.filter(
      (storedId): storedId is string => typeof storedId === 'string',
    )
    return progress
  }, {})
}

function readModuleProgress(): ModuleProgress {
  try {
    const storedProgress = localStorage.getItem(moduleProgressStorageKey)
    if (storedProgress) return sanitizeModuleProgress(JSON.parse(storedProgress))

    const legacyProgress = localStorage.getItem(legacyProgressStorageKey)
    if (!legacyProgress) return {}

    const completedMotionExercises = JSON.parse(legacyProgress) as unknown
    return Array.isArray(completedMotionExercises)
      ? { motion: completedMotionExercises.filter((value): value is string => typeof value === 'string') }
      : {}
  } catch {
    return {}
  }
}

export function App() {
  const { canInstall, install, isOnline } = usePwaInstall()
  const [activeModuleId, setActiveModuleId] = useState<CourseModuleId>('motion')
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
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(readModuleProgress)

  const activeModule = getCourseModule(activeModuleId)
  const activeModuleContent = getModuleContent(activeModuleId)
  const activeModeItem = studyModes.find((mode) => mode.id === activeMode) ?? studyModes[0]
  const activeExerciseSet = exerciseSets[activeModuleId] ?? exerciseSets.motion
  const completedExerciseIds = moduleProgress[activeModuleId] ?? []
  const completedExerciseCount =
    activeExerciseSet?.exercises.filter((exercise) => completedExerciseIds.includes(exercise.id)).length ?? 0
  const lessonProgress = activeExerciseSet
    ? Math.round((completedExerciseCount / activeExerciseSet.exercises.length) * 100)
    : 0
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

  useEffect(() => {
    try {
      localStorage.setItem(moduleProgressStorageKey, JSON.stringify(moduleProgress))
    } catch {
      // Progress remains available for the current session.
    }
  }, [moduleProgress])

  const completeExercise = (exerciseId: string) => {
    setModuleProgress((currentProgress) => {
      const currentIds = currentProgress[activeModuleId] ?? []
      if (currentIds.includes(exerciseId)) return currentProgress

      return {
        ...currentProgress,
        [activeModuleId]: [...currentIds, exerciseId],
      }
    })
  }

  const selectMode = (mode: StudyMode) => {
    setActiveMode(mode)
    setIsNavigationOpen(false)
  }

  const selectModule = (moduleId: CourseModuleId) => {
    const selectedModule = getCourseModule(moduleId)
    if (!selectedModule.available) return

    setActiveModuleId(moduleId)
    setActiveMode('learn')
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
          <span className="prototype-tag">α 0.7</span>
        </a>

        <div className="header-context" aria-label="Contexto actual">
          <span className="header-context__path">Fundamentos / {activeModule.name}</span>
          <span className="header-context__separator" aria-hidden="true" />
          <span>{activeModeItem.label}</span>
        </div>

        <div className="header-actions">
          {!isOnline && (
            <span className="offline-indicator" role="status">
              Sin conexión
            </span>
          )}
          {canInstall && (
            <button className="install-button" type="button" onClick={() => void install()}>
              <span aria-hidden="true">↓</span>
              Instalar app
            </button>
          )}
          <div className="header-progress" aria-label={`Progreso de práctica registrado: ${lessonProgress}%`}>
            <span>{lessonProgress}%</span>
            <div className="header-progress__track">
              <div style={{ width: `${lessonProgress}%` }} />
            </div>
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
            {courseModules.map((courseModule) => (
              <li key={courseModule.id}>
                <button
                  className={[
                    'module-navigation__item',
                    courseModule.available ? 'module-navigation__item--available' : '',
                    courseModule.id === activeModuleId ? 'module-navigation__item--active' : '',
                  ].filter(Boolean).join(' ')}
                  type="button"
                  disabled={!courseModule.available}
                  aria-current={courseModule.id === activeModuleId ? 'page' : undefined}
                  onClick={() => selectModule(courseModule.id)}
                >
                  <span>{courseModule.number}</span>
                  <strong>{courseModule.name}</strong>
                  {courseModule.id === activeModuleId ? (
                    <i aria-label="Módulo activo" />
                  ) : courseModule.available ? (
                    <small aria-label="Abrir módulo">→</small>
                  ) : (
                    <small aria-label="Próximamente">—</small>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <nav className="mode-navigation" aria-label="Modos de estudio">
          <span className="navigation-section-label">Lección {activeModule.number}</span>
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
            <span className="interface-label">{activeModule.lessonLabel}</span>
            <h1>{activeModule.title}</h1>
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
            key={activeModuleId}
            steps={activeModuleContent.concepts}
            getCode={activeModuleContent.getConceptCode}
            getFileName={(language) =>
              getExampleFileName(activeModuleContent.exampleModuleId, language)
            }
            ariaLabel={`Conceptos fundamentales de ${activeModule.name.toLowerCase()}`}
            translation={activeModuleContent.translation}
            programmingLanguage={programmingLanguage}
            onLanguageChange={setProgrammingLanguage}
            onOpenLab={() => selectMode('lab')}
          />
        )}
        {activeMode === 'lab' && activeModuleId === 'motion' && (
          <LabWorkspace
            programmingLanguage={programmingLanguage}
            onLanguageChange={setProgrammingLanguage}
          />
        )}
        {activeMode === 'lab' && activeModuleId === 'vectors' && (
          <VectorLabWorkspace
            programmingLanguage={programmingLanguage}
            onLanguageChange={setProgrammingLanguage}
          />
        )}
        {activeMode === 'lab' && activeModuleId === 'functions' && (
          <FunctionLabWorkspace
            programmingLanguage={programmingLanguage}
            onLanguageChange={setProgrammingLanguage}
          />
        )}
        {activeMode === 'lab' && activeModuleId === 'forces' && (
          <ForceLabWorkspace
            programmingLanguage={programmingLanguage}
            onLanguageChange={setProgrammingLanguage}
          />
        )}
        {activeMode === 'practice' && activeExerciseSet && (
          <ExercisePanel
            key={activeModuleId}
            title={activeExerciseSet.title}
            description={activeExerciseSet.description}
            exercises={activeExerciseSet.exercises}
            completedIds={completedExerciseIds}
            onComplete={completeExercise}
          />
        )}
      </main>
    </div>
  )
}
