/** Rotation uses seconds rather than frame counts, including on slower devices. */
export const GLOBE_AUTO_SPEED = (Math.PI * 2) / 120;
const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));
export class GlobeMotion {
  yaw = -0.26;
  tilt = 0.27;
  dragging = false;
  private velocityX = GLOBE_AUTO_SPEED;
  private velocityY = 0;
  private lastMove = 0;

  begin(now: number) {
    this.dragging = true;
    this.velocityX = this.velocityY = 0;
    this.lastMove = now;
  }
  drag(dx: number, dy: number, now: number, radius: number) {
    if (!this.dragging) return;
    const sensitivity = 1 / Math.max(110, radius);
    const x = dx * sensitivity,
      y = dy * sensitivity;
    const dt = Math.max(0.008, (now - this.lastMove) / 1000);
    this.yaw += x;
    this.tilt = clamp(this.tilt + y, 1.05);
    this.velocityX = clamp(this.velocityX * 0.35 + (x / dt) * 0.65, 1.15);
    this.velocityY = clamp(this.velocityY * 0.35 + (y / dt) * 0.65, 0.65);
    this.lastMove = now;
  }
  release(now: number, cancelled = false) {
    if (!this.dragging) return;
    this.dragging = false;
    if (cancelled || now - this.lastMove > 100)
      this.velocityX = this.velocityY = 0;
  }
  nudge(x: number, y: number) {
    this.yaw += x;
    this.tilt = clamp(this.tilt + y, 1.05);
    this.velocityX = GLOBE_AUTO_SPEED;
    this.velocityY = 0;
  }
  advance(seconds: number, paused: boolean) {
    if (this.dragging) return;
    if (paused) {
      this.velocityX = GLOBE_AUTO_SPEED;
      this.velocityY = 0;
      return;
    }
    const dt = Math.max(0, Math.min(seconds, 0.1));
    // Integrate exponential damping exactly so momentum settles at the same pace at 30/60 Hz.
    const decayX = Math.exp(-dt * 2.4),
      decayY = Math.exp(-dt * 3.6);
    this.yaw +=
      GLOBE_AUTO_SPEED * dt +
      ((this.velocityX - GLOBE_AUTO_SPEED) * (1 - decayX)) / 2.4;
    this.tilt = clamp(this.tilt + (this.velocityY * (1 - decayY)) / 3.6, 1.05);
    this.velocityX =
      GLOBE_AUTO_SPEED + (this.velocityX - GLOBE_AUTO_SPEED) * decayX;
    this.velocityY *= decayY;
  }
}
