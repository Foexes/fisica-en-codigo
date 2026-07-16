import type { MotionState } from '../lib/physics'
import { formatNumber } from '../lib/physics'

interface MotionTrackProps {
  state: MotionState
  range: { min: number; max: number }
}

export function MotionTrack({ state, range }: MotionTrackProps) {
  const width = Math.max(range.max - range.min, 1)
  const progress = ((state.position - range.min) / width) * 100
  const clampedProgress = Math.min(96, Math.max(4, progress))
  const zeroProgress = ((0 - range.min) / width) * 100

  return (
    <div
      className="motion-track"
      role="img"
      aria-label={`El objeto está en la posición ${formatNumber(state.position)} metros`}
    >
      <div className="motion-track__sky">
        <div className="motion-track__cloud motion-track__cloud--one" />
        <div className="motion-track__cloud motion-track__cloud--two" />
      </div>
      <div className="motion-track__road">
        <div
          className="motion-track__origin"
          style={{ left: `${Math.min(98, Math.max(2, zeroProgress))}%` }}
        >
          <span>0 m</span>
        </div>
        <div className="motion-track__object" style={{ left: `${clampedProgress}%` }}>
          <span className="motion-track__position">
            {formatNumber(state.position)} m
          </span>
          <span className="motion-track__robot" aria-hidden="true">
            <span className="motion-track__eye" />
          </span>
        </div>
      </div>
      <div className="motion-track__scale">
        <span>{formatNumber(range.min)} m</span>
        <span>{formatNumber(range.max)} m</span>
      </div>
    </div>
  )
}
