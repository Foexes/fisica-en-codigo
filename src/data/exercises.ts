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

const functionExercises: Exercise[] = [
  {
    id: 'function-evaluation',
    title: 'Ejecutar la regla',
    skill: 'Evaluar una función',
    prompt:
      'La función f(x) = 2x + 3 recibe la entrada x = 4. ¿Qué salida produce?',
    givenValues: [
      { symbol: 'f(x)', value: '2x + 3' },
      { symbol: 'x', value: '4' },
    ],
    expression: 'f(4)=2(4)+3',
    expressionLabel: 'f de cuatro es igual a dos por cuatro más tres',
    answer: 11,
    unit: '',
    hint: 'Sustituye cada aparición de x por 4 y respeta primero la multiplicación.',
    success: 'f(4) = 2 × 4 + 3 = 11. Evaluar una función equivale a llamar código con un argumento.',
  },
  {
    id: 'function-intercept',
    title: 'Salida inicial',
    skill: 'Identificar la intersección',
    prompt:
      'Para g(x) = −3x + 5, ¿cuál es la salida cuando la entrada vale cero?',
    givenValues: [
      { symbol: 'g(x)', value: '−3x + 5' },
      { symbol: 'x', value: '0' },
    ],
    expression: 'g(0)=-3(0)+5',
    expressionLabel: 'g de cero es igual a menos tres por cero más cinco',
    answer: 5,
    unit: '',
    hint: 'El término multiplicado por x desaparece cuando x = 0. Queda únicamente b.',
    success: 'g(0) = 5. En una función lineal, b es la intersección con el eje Y y la salida inicial.',
  },
  {
    id: 'function-slope',
    title: 'Cambio entre puntos',
    skill: 'Calcular pendiente',
    prompt:
      'Una recta pasa por los puntos (1, 3) y (4, 9). ¿Cuál es su pendiente?',
    givenValues: [
      { symbol: '(x₁, y₁)', value: '(1, 3)' },
      { symbol: '(x₂, y₂)', value: '(4, 9)' },
    ],
    expression: 'm=\\frac{y_2-y_1}{x_2-x_1}',
    expressionLabel: 'pendiente es cambio de y dividido por cambio de x',
    answer: 2,
    unit: '',
    hint: 'La salida cambia 9 − 3 = 6 mientras la entrada cambia 4 − 1 = 3.',
    success: 'm = 6 / 3 = 2. Por cada unidad que avanza x, la salida aumenta dos.',
  },
]

const forceExercises: Exercise[] = [
  {
    id: 'force-resultant',
    title: 'Empujes opuestos',
    skill: 'Calcular fuerza neta',
    prompt:
      'Un robot recibe 18 N hacia la derecha y una resistencia de 6 N hacia la izquierda. ¿Cuál es su fuerza neta horizontal?',
    givenValues: [
      { symbol: 'F→', value: '18 N' },
      { symbol: 'F←', value: '6 N' },
    ],
    expression: 'F_{net}=F_{\\rightarrow}-F_{\\leftarrow}',
    expressionLabel: 'fuerza neta es fuerza derecha menos fuerza izquierda',
    answer: 12,
    unit: 'N',
    hint: 'Elige la derecha como signo positivo. La fuerza opuesta entra con signo negativo.',
    success: 'Fnet = 18 − 6 = +12 N. El signo positivo indica que la resultante apunta a la derecha.',
  },
  {
    id: 'force-acceleration',
    title: 'Acelerar una caja',
    skill: 'Aplicar la segunda ley',
    prompt:
      'Una caja de 6 kg recibe una fuerza neta de 24 N. ¿Qué aceleración produce?',
    givenValues: [
      { symbol: 'Fnet', value: '24 N' },
      { symbol: 'm', value: '6 kg' },
    ],
    expression: 'a=\\frac{F_{net}}{m}',
    expressionLabel: 'aceleración es fuerza neta dividida por masa',
    answer: 4,
    unit: 'm/s²',
    hint: 'Despeja la aceleración dividiendo la fuerza neta entre la masa.',
    success: 'a = 24 / 6 = 4 m/s². Cada segundo, la velocidad cambia 4 m/s.',
  },
  {
    id: 'force-mass',
    title: 'Descubrir la masa',
    skill: 'Despejar masa',
    prompt:
      'Una fuerza neta de 18 N produce una aceleración de 3 m/s². ¿Cuál es la masa del objeto?',
    givenValues: [
      { symbol: 'Fnet', value: '18 N' },
      { symbol: 'a', value: '3 m/s²' },
    ],
    expression: 'm=\\frac{F_{net}}{a}',
    expressionLabel: 'masa es fuerza neta dividida por aceleración',
    answer: 6,
    unit: 'kg',
    hint: 'Reordena F = ma para dejar m sola: divide ambos lados entre a.',
    success: 'm = 18 / 3 = 6 kg. Has usado la misma relación, pero despejando otra variable.',
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
  functions: {
    title: 'Una regla, tres representaciones',
    description: 'Conecta cada fórmula con su entrada, su salida y su gráfica.',
    exercises: functionExercises,
  },
  forces: {
    title: 'Interacciones que cambian la velocidad',
    description: 'Suma primero las fuerzas; aplica la masa después.',
    exercises: forceExercises,
  },
}
