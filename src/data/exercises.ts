import type { CourseModuleId } from '../lib/course'

export interface Exercise {
  id: string
  title: string
  skill: string
  prompt: string
  givenValues: Array<{ symbol: string; value: string }>
  expression: string
  expressionLabel: string
  answer: number
  tolerance?: number
  unit: string
  hint: string
  success: string
}

export interface ExerciseSet {
  title: string
  description: string
  exercises: Exercise[]
}

const motionExercises: Exercise[] = [
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

const vectorExercises: Exercise[] = [
  {
    id: 'vector-magnitude',
    title: 'Velocidad diagonal',
    skill: 'Calcular magnitud',
    prompt:
      'Un personaje se mueve con una velocidad de 3 m/s en X y 4 m/s en Y. ¿Cuál es la magnitud de su velocidad?',
    givenValues: [
      { symbol: 'vₓ', value: '3 m/s' },
      { symbol: 'vᵧ', value: '4 m/s' },
    ],
    expression: '|\\vec{v}|=\\sqrt{v_x^2+v_y^2}',
    expressionLabel: 'magnitud del vector es la raíz de la suma de sus componentes al cuadrado',
    answer: 5,
    unit: 'm/s',
    hint: 'Forma un triángulo rectángulo: √(3² + 4²). Es el mismo patrón del teorema de Pitágoras.',
    success: '|v| = √(9 + 16) = 5 m/s. Las componentes describen los catetos y la magnitud, la hipotenusa.',
  },
  {
    id: 'vector-resultant',
    title: 'Input más viento',
    skill: 'Sumar vectores',
    prompt:
      'El input produce el vector (2, 1) y el viento añade (1, 3). ¿Cuál es la magnitud del vector resultante?',
    givenValues: [
      { symbol: 'a', value: '(2, 1)' },
      { symbol: 'b', value: '(1, 3)' },
    ],
    expression: '\\vec{r}=\\vec{a}+\\vec{b}=(3,4)',
    expressionLabel: 'el vector resultante suma cada componente y queda tres coma cuatro',
    answer: 5,
    unit: 'u',
    hint: 'Suma primero X con X e Y con Y. Después calcula la magnitud del vector (3, 4).',
    success: 'r = (2 + 1, 1 + 3) = (3, 4), por tanto |r| = 5. La suma se hace componente a componente.',
  },
  {
    id: 'vector-angle',
    title: 'Apuntar hacia arriba',
    skill: 'Interpretar dirección',
    prompt:
      'Una cámara recibe el vector de dirección (0, 6). ¿Qué ángulo forma respecto al eje X positivo?',
    givenValues: [
      { symbol: 'dₓ', value: '0' },
      { symbol: 'dᵧ', value: '6' },
    ],
    expression: '\\theta=\\operatorname{atan2}(d_y,d_x)',
    expressionLabel: 'theta es el ángulo calculado con atan dos de componente y y componente x',
    answer: 90,
    tolerance: 0.1,
    unit: '°',
    hint: 'El eje X positivo representa 0°. Un vector vertical hacia arriba gira un cuarto de vuelta.',
    success: 'atan2(6, 0) = 90°. atan2 conserva el cuadrante; por eso es más seguro que dividir Y entre X.',
  },
]

export const exerciseSets: Partial<Record<CourseModuleId, ExerciseSet>> = {
  motion: {
    title: 'Tres problemas, una misma idea',
    description: 'Identifica qué cambia, qué conoces y qué ecuación conecta ambos.',
    exercises: motionExercises,
  },
  vectors: {
    title: 'Componentes que construyen una dirección',
    description: 'Resuelve primero por ejes; combina las componentes al final.',
    exercises: vectorExercises,
  },
}
