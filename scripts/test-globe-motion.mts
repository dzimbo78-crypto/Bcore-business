import assert from "node:assert/strict";
import test from "node:test";
import {
  GlobeMotion,
  GLOBE_AUTO_SPEED,
} from "../artifacts/sales-platform/src/lib/globe-motion.ts";
function advance(
  motion: GlobeMotion,
  seconds: number,
  hz: number,
  paused = false,
) {
  for (let i = 0; i < seconds * hz; i++) motion.advance(1 / hz, paused);
}
test("automatic rotation takes two minutes at both 30 and 144 Hz", () => {
  for (const hz of [30, 144]) {
    const motion = new GlobeMotion(),
      initial = motion.yaw;
    advance(motion, 120, hz);
    assert.ok(Math.abs(motion.yaw - initial - Math.PI * 2) < 1e-9);
  }
});
test("drag overrides automatic motion; release keeps momentum then resumes slow rotation", () => {
  const motion = new GlobeMotion();
  motion.begin(100);
  const initial = motion.yaw;
  motion.drag(-50, 20, 116, 200);
  assert.ok(motion.yaw < initial);
  assert.ok(motion.tilt > 0.27);
  const dragged = motion.yaw;
  advance(motion, 1, 60);
  assert.equal(motion.yaw, dragged);
  motion.release(120);
  advance(motion, 0.1, 60);
  assert.ok(
    motion.yaw < dragged,
    "momentum follows the drag rather than snapping back",
  );
  advance(motion, 6, 60);
  const settled = motion.yaw;
  advance(motion, 1, 60);
  assert.ok(Math.abs(motion.yaw - settled - GLOBE_AUTO_SPEED) < 0.00001);
});
test("inertia settles consistently at different frame rates", () => {
  const results = [30, 144].map((hz) => {
    const motion = new GlobeMotion();
    motion.begin(100);
    motion.drag(80, -12, 116, 200);
    motion.release(120);
    advance(motion, 4, hz);
    return [motion.yaw, motion.tilt];
  });
  assert.ok(Math.abs(results[0][0] - results[1][0]) < 1e-9);
  assert.ok(Math.abs(results[0][1] - results[1][1]) < 1e-9);
});
test("pause stops automatic movement while retaining manual and keyboard interaction", () => {
  const motion = new GlobeMotion(),
    initial = motion.yaw;
  advance(motion, 3, 60, true);
  assert.equal(motion.yaw, initial);
  motion.begin(100);
  motion.drag(50, 0, 120, 200);
  motion.release(125);
  const dragged = motion.yaw;
  advance(motion, 2, 60, true);
  assert.equal(motion.yaw, dragged);
  motion.nudge(0.18, 0);
  assert.ok(motion.yaw > dragged);
  const nudged = motion.yaw;
  advance(motion, 1, 60);
  assert.ok(Math.abs(motion.yaw - nudged - GLOBE_AUTO_SPEED) < 1e-9);
});
test("cancelled gestures do not fling the globe; tilt stays bounded", () => {
  const motion = new GlobeMotion();
  motion.begin(100);
  motion.drag(200, 3000, 110, 180);
  motion.release(120, true);
  assert.equal(motion.tilt, 1.05);
  const released = motion.yaw;
  advance(motion, 1, 60);
  assert.ok(motion.yaw > released && motion.yaw - released < GLOBE_AUTO_SPEED);
  motion.nudge(0, -100);
  assert.equal(motion.tilt, -1.05);
});
