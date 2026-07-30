import {
  functionConceptSteps,
  motionConceptSteps,
  vectorConceptSteps,
  type ConceptStep,
} from '../data/concepts'
import {
  getConceptCode,
  getFunctionConceptCode,
  getVectorConceptCode,
  type ConceptCodeId,
  type ExampleModuleId,
  type FunctionConceptCodeId,
  type ProgrammingLanguage,
  type VectorConceptCodeId,
} from './codeExamples'
import type { CourseModuleId } from './course'

export interface CourseModuleContent {
  concepts: ConceptStep[]
  exampleModuleId: ExampleModuleId
  translation: string
  getConceptCode: (codeId: string, language: ProgrammingLanguage) => string
}

export const moduleContent: Partial<Record<CourseModuleId, CourseModuleContent>> = {
  motion: {
    concepts: motionConceptSteps,
    exampleModuleId: 'motion',
    translation: 'El código conserva exactamente la misma relación entre estado, cambio y tiempo.',
    getConceptCode: (codeId, language) =>
      getConceptCode(codeId as ConceptCodeId, language),
  },
  vectors: {
    concepts: vectorConceptSteps,
    exampleModuleId: 'vectors',
    translation:
      'El código utiliza las mismas componentes, magnitud y dirección que aparecen en la fórmula.',
    getConceptCode: (codeId, language) =>
      getVectorConceptCode(codeId as VectorConceptCodeId, language),
  },
  functions: {
    concepts: functionConceptSteps,
    exampleModuleId: 'functions',
    translation:
      'La llamada de código recibe la misma entrada x y devuelve exactamente la salida f(x).',
    getConceptCode: (codeId, language) =>
      getFunctionConceptCode(codeId as FunctionConceptCodeId, language),
  },
}

export function getModuleContent(moduleId: CourseModuleId): CourseModuleContent {
  return moduleContent[moduleId] ?? moduleContent.motion!
}
