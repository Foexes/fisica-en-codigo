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

export const functionConceptSteps: ConceptStep[] = [
  {
    id: 'input-output',
    number: '01',
    name: 'Entrada y salida',
    question: '¿Qué hace una función?',
    explanation:
      'Una función recibe una entrada, aplica siempre una regla definida y devuelve una única salida. La notación f(x) nombra tanto la regla como su resultado para x.',
    expression: 'y=f(x)',
    expressionLabel: 'y es el resultado de aplicar la función f a la entrada x',
    codeId: 'input-output',
    unit: 'x es entrada; f(x) es salida',
    example: 'Si f(x) = 2x + 1, entonces f(3) = 7.',
    insight: 'Es la misma idea que llamar doublePlusOne(3) y recibir 7.',
  },
  {
    id: 'graph',
    number: '02',
    name: 'Gráfica',
    question: '¿Cómo se ve la regla?',
    explanation:
      'Cada entrada x produce el punto (x, f(x)). Al representar muchas entradas aparece una gráfica que permite ver el comportamiento completo de la función.',
    expression: '(x,f(x))',
    expressionLabel: 'cada punto contiene una entrada x y su salida f de x',
    codeId: 'graph',
    unit: 'pares de coordenadas (x, y)',
    example: 'Para f(x) = 2x + 1 aparecen los puntos (0, 1), (1, 3) y (2, 5).',
    insight: 'Una tabla, una gráfica y una función de código son tres representaciones de la misma regla.',
  },
  {
    id: 'slope',
    number: '03',
    name: 'Pendiente',
    question: '¿Cuánto cambia la salida?',
    explanation:
      'En una función lineal, la pendiente m indica cuánto cambia la salida cuando la entrada aumenta una unidad. El término b fija la salida inicial cuando x vale cero.',
    expression: 'f(x)=mx+b',
    expressionLabel: 'f de x es igual a pendiente por x más intersección b',
    codeId: 'slope',
    unit: 'm: cambio; b: valor inicial',
    example: 'En f(x) = 3x + 2, cada paso de x suma 3 a la salida y f(0) = 2.',
    insight: 'La pendiente prepara la intuición para velocidad, tasas de cambio y derivadas.',
  },
]
