export interface MotionParameters {
  initialPosition: number
  initialVelocity: number
  acceleration: number
}

export interface MotionState {
  time: number
  position: number
  velocity: number
}

export function calculateMotionState(
  parameters: MotionParameters,
  time: number,
): MotionState {
  const { initialPosition, initialVelocity, acceleration } = parameters

  return {
    time,
    position:
      initialPosition + initialVelocity * time + 0.5 * acceleration * time ** 2,
    velocity: initialVelocity + acceleration * time,
  }
}

export function formatNumber(value: number, decimals = 1): string {
  const rounded = Number(value.toFixed(decimals))
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: decimals,
  }).format(rounded)
}
