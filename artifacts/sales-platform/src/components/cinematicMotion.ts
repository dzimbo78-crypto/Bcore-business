/**
 * B-CORE cinematic motion, v3.
 * Scroll reveals a scene, then a 3.6 s, time-based composition plays inside
 * the sticky frame. Fast trackpad/wheel movement cannot jump to the last frame.
 * No scroll lock, new dependencies, React state updates or perpetual RAF loop.
 * RAF runs only while the chapter is visible and its sequence is playing.
 */
export const CINEMATIC_DURATION_MS = 3600;

export const easeSegment = (p: number, start: number, end: number) => {
  const v = Math.max(0, Math.min(1, (p - start) / (end - start)));
  return v * v * (3 - 2 * v);
};

export function bindCinematicMotion(
  section: HTMLElement,
  stage: HTMLElement,
  render: (progress: number) => void,
  paused: boolean,
  duration = CINEMATIC_DURATION_MS,
): () => void {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  let watcher = 0;
  let elapsed = 0;
  let previousTime = 0;
  let playing = false;
  let finished = false;
  let active = false;
  let disposed = false;

  function stopFrame() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    previousTime = 0;
  }
  function draw(progress: number) {
    render(Math.min(1, Math.max(0, progress)));
  }
  function complete() {
    stopFrame();
    playing = false;
    finished = true;
    elapsed = duration;
    draw(1);
  }
  function reset() {
    stopFrame();
    playing = false;
    finished = false;
    elapsed = 0;
    draw(0);
  }
  function tick(now: number) {
    raf = 0;
    if (disposed || document.hidden || !active || motionQuery.matches) {
      previousTime = 0;
      return;
    }
    if (previousTime) elapsed += Math.min(90, Math.max(0, now - previousTime));
    previousTime = now;
    const p = Math.min(1, elapsed / duration);
    draw(p);
    if (p >= 1) complete();
    else raf = requestAnimationFrame(tick);
  }
  function resume() {
    if (finished || !playing || raf || document.hidden || motionQuery.matches || !active) return;
    previousTime = 0;
    raf = requestAnimationFrame(tick);
  }
  function checkPosition() {
    if (disposed) return;
    if (paused || motionQuery.matches) {
      active = false;
      complete();
      return;
    }
    const rect = stage.getBoundingClientRect();
    // If the entire scene is below the viewport, prepare for the next descent.
    if (rect.top >= window.innerHeight - 1) {
      active = false;
      if (playing || finished || elapsed) reset();
      return;
    }
    // A skipped chapter does not keep rendering out of view. If the user
    // returns from below, the complete composition is already legible.
    if (rect.bottom <= 0) {
      active = false;
      if (!finished) complete();
      return;
    }
    active = rect.bottom > window.innerHeight * .16 && rect.top < window.innerHeight * .88;
    if (!active) {
      stopFrame();
      return;
    }
    // Begin when the central composition is meaningfully visible. The sequence
    // then uses elapsed time, NOT the scroll offset, for its actual movement.
    if (!playing && !finished && rect.top <= window.innerHeight * .55) playing = true;
    resume();
  }
  function scheduleCheck() {
    if (watcher) return;
    watcher = requestAnimationFrame(() => {
      watcher = 0;
      checkPosition();
    });
  }
  function onVisibility() {
    if (document.hidden) stopFrame();
    else scheduleCheck();
  }
  function onMotionChange() {
    if (motionQuery.matches) complete();
    else {
      // Switching out of reduced motion shouldn't suddenly explode elements.
      if (finished) draw(1);
      scheduleCheck();
    }
  }

  if (paused || motionQuery.matches) complete();
  else draw(0);
  const observer = new IntersectionObserver(scheduleCheck, {
    threshold: [0, .15, .35, .55, .8],
  });
  observer.observe(stage);
  window.addEventListener('scroll', scheduleCheck, { passive: true });
  window.addEventListener('resize', scheduleCheck, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  motionQuery.addEventListener('change', onMotionChange);
  scheduleCheck();

  return () => {
    disposed = true;
    observer.disconnect();
    window.removeEventListener('scroll', scheduleCheck);
    window.removeEventListener('resize', scheduleCheck);
    document.removeEventListener('visibilitychange', onVisibility);
    motionQuery.removeEventListener('change', onMotionChange);
    if (watcher) cancelAnimationFrame(watcher);
    stopFrame();
  };
}
