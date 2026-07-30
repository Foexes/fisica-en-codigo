export interface ConceptStep {
  id: string
  number: string
  name: string
  question: string
  explanation: string
  expression: string
  expressionLabel: string
  codeId: string
  unit: string
  example: string
  insight: string
}

export const motionConceptSteps: ConceptStep[] = [
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

export const vectorConceptSteps: ConceptStep[] = [
  {
    id: 'components',
    number: '01',
    name: 'Componentes',
    question: '¿Cuánto aporta cada eje?',
    explanation:
      'Un vector 2D guarda dos cambios a la vez. La componente X describe izquierda y derecha; la componente Y, abajo y arriba.',
    expression: '\\vec{v}=(v_x,v_y)',
    expressionLabel: 'vector v formado por su componente x y su componente y',
    codeId: 'components',
    unit: 'dos componentes, una dirección',
    example: 'v = (3, 4) avanza tres unidades en X y cuatro en Y.',
    insight: 'Es el mismo par de valores que Vector2. Atención: en muchas pantallas el eje Y positivo apunta hacia abajo.',
  },
  {
    id: 'magnitude',
    number: '02',
    name: 'Magnitud',
    question: '¿Qué tan largo es?',
    explanation:
      'La magnitud ignora hacia dónde apunta el vector y mide únicamente su longitud. Las componentes forman un triángulo rectángulo.',
    expression: '|\\vec{v}|=\\sqrt{v_x^2+v_y^2}',
    expressionLabel: 'magnitud del vector es la raíz de x al cuadrado más y al cuadrado',
    codeId: 'magnitude',
    unit: 'la unidad original del vector',
    example: 'El vector (3, 4) tiene magnitud 5 por el triángulo 3-4-5.',
    insight: 'Los motores suelen llamarlo length o Magnitude.',
  },
  {
    id: 'direction',
    number: '03',
    name: 'Dirección',
    question: '¿Hacia dónde apunta?',
    explanation:
      'La dirección se expresa como un ángulo. atan2 usa ambas componentes y conserva el cuadrante, incluso cuando X vale cero.',
    expression: '\\theta=\\operatorname{atan2}(v_y,v_x)',
    expressionLabel: 'theta se calcula con atan dos de componente y y componente x',
    codeId: 'direction',
    unit: 'grados (°) o radianes (rad)',
    example: 'El vector (0, 5) apunta a 90°: vertical hacia arriba.',
    insight: 'atan2(y, x) es el patrón habitual para orientar cámaras, sprites y proyectiles.',
  },
]
