export interface ForceParameters {
  appliedForce: number
  resistanceForce: number
  mass: number
}

export interface ForceState extends ForceParameters {
  netForce: number
  acceleration: number
  weight: number
  normalForce: number
}

export const standardGravity = 9.81

export function calculateForceState(
  parameters: ForceParameters,
  gravity = standardGravity,
): ForceState {
  const netForce = parameters.appliedForce - parameters.resistanceForce
  const acceleration = parameters.mass > 0 ? netForce / parameters.mass : 0
  const weight = parameters.mass * gravity

  return {
    ...parameters,
    netForce,
    acceleration,
    weight,
    normalForce: weight,
  }
}
