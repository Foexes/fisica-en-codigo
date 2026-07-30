export interface Vector2 {
  x: number
  y: number
}

export interface VectorState extends Vector2 {
  magnitude: number
  angleDegrees: number
  normalized: Vector2
}

export function calculateVectorState(vector: Vector2): VectorState {
  const magnitude = Math.hypot(vector.x, vector.y)
  const angleDegrees =
    magnitude === 0 ? 0 : (Math.atan2(vector.y, vector.x) * 180) / Math.PI

  return {
    ...vector,
    magnitude,
    angleDegrees,
    normalized:
      magnitude === 0
        ? { x: 0, y: 0 }
        : { x: vector.x / magnitude, y: vector.y / magnitude },
  }
}
