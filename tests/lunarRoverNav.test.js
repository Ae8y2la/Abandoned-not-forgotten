import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Pure calculation logic mirroring LunarRoverSim dead-reckoning navigation
 * (NASA TN D-7469).
 */
export function driveStep({ posX, posY, headingDeg, odometerKm, distanceDeltaKm, turnDeltaDeg = 0 }) {
  const newHeading = (headingDeg + turnDeltaDeg + 360) % 360;
  if (distanceDeltaKm === 0) {
    return {
      posX,
      posY,
      headingDeg: newHeading,
      odometerKm,
      rangeToLm: Math.hypot(posX, posY),
    };
  }

  const rad = (newHeading * Math.PI) / 180;
  const dx = distanceDeltaKm * Math.sin(rad);
  const dy = distanceDeltaKm * Math.cos(rad);
  const stepDist = Math.hypot(dx, dy);

  const nextX = posX + dx;
  const nextY = posY + dy;
  const nextOdometer = odometerKm + stepDist; // exact float accumulator
  const nextRange = Math.hypot(nextX, nextY);

  return {
    posX: nextX,
    posY: nextY,
    headingDeg: newHeading,
    odometerKm: nextOdometer,
    rangeToLm: nextRange,
  };
}

describe('LunarRoverSim Navigation & Odometer Physics', () => {
  it('Range to LM should never exceed odometer distance (triangle inequality)', () => {
    let state = { posX: 0, posY: 0, headingDeg: 45, odometerKm: 0, rangeToLm: 0 };

    // Simulate 5000 varied driving operations
    for (let i = 0; i < 5000; i++) {
      const dist = (Math.random() - 0.2) * 0.2; // both forward and reverse movements
      const turn = (Math.random() - 0.5) * 45;
      state = driveStep({ ...state, distanceDeltaKm: dist, turnDeltaDeg: turn });

      // Range to LM can NEVER exceed odometer distance (no Math.min masking)
      assert.ok(
        state.rangeToLm <= state.odometerKm + 1e-12,
        `Step ${i}: Range (${state.rangeToLm}) exceeded odometer (${state.odometerKm})`
      );
    }
  });

  it('Straight-line driving has range equal to odometer within floating point limits', () => {
    let state = { posX: 0, posY: 0, headingDeg: 30, odometerKm: 0, rangeToLm: 0 };
    for (let i = 0; i < 20; i++) {
      state = driveStep({ ...state, distanceDeltaKm: 0.25, turnDeltaDeg: 0 });
    }
    assert.equal(state.rangeToLm.toFixed(2), state.odometerKm.toFixed(2));
    assert.equal(state.odometerKm.toFixed(2), '5.00');
  });

  it('Reverse and turning maneuvers increase odometer while range stays within boundary', () => {
    let state = { posX: 0, posY: 0, headingDeg: 0, odometerKm: 0, rangeToLm: 0 };
    // Drive out 1 km north
    state = driveStep({ ...state, distanceDeltaKm: 1.0, turnDeltaDeg: 0 });
    assert.equal(state.rangeToLm.toFixed(2), '1.00');
    assert.equal(state.odometerKm.toFixed(2), '1.00');

    // Turn 180 degrees and drive back 0.5 km toward LM
    state = driveStep({ ...state, distanceDeltaKm: 0.5, turnDeltaDeg: 180 });
    assert.equal(state.rangeToLm.toFixed(2), '0.50');
    assert.equal(state.odometerKm.toFixed(2), '1.50');
    assert.ok(state.rangeToLm < state.odometerKm);
  });
});
