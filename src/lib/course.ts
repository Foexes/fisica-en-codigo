export type CourseModuleId = 'motion' | 'vectors' | 'functions' | 'forces'

export interface CourseModuleDefinition {
  id: CourseModuleId
  number: string
  name: string
  lessonLabel: string
  title: string
  available: boolean
}

export const courseModules: CourseModuleDefinition[] = [
  {
    id: 'motion',
    number: '01',
    name: 'Movimiento',
    lessonLabel: 'Movimiento · Lección 01',
    title: 'Movimiento en una dimensión',
    available: true,
  },
  {
    id: 'vectors',
    number: '02',
    name: 'Vectores',
    lessonLabel: 'Vectores · Lección 02',
    title: 'Dirección y magnitud en 2D',
    available: true,
  },
  {
    id: 'functions',
    number: '03',
    name: 'Funciones',
    lessonLabel: 'Funciones · Lección 03',
    title: 'Entradas, salidas y gráficas',
    available: false,
  },
  {
    id: 'forces',
    number: '04',
    name: 'Fuerzas',
    lessonLabel: 'Fuerzas · Lección 04',
    title: 'Interacciones y movimiento',
    available: false,
  },
]

export function getCourseModule(moduleId: CourseModuleId): CourseModuleDefinition {
  return courseModules.find((courseModule) => courseModule.id === moduleId) ?? courseModules[0]
}
