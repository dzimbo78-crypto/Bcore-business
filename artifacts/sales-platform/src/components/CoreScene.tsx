import { useEffect, useRef, useState } from "react";
import { useMotionPreferences } from "./MotionPreferences";
import { useLanguage } from "@/i18n/context";
import land from "@/data/globe-land.json";
import { GlobeMotion } from "@/lib/globe-motion";

type Vector = [number, number, number];
const radians = Math.PI / 180;
const sphere = ([longitude, latitude]: number[]): Vector => {
  const lat = latitude * radians,
    lon = longitude * radians;
  return [
    Math.cos(lat) * Math.sin(lon),
    -Math.sin(lat),
    Math.cos(lat) * Math.cos(lon),
  ];
};
const coasts = land.coasts.map((ring) => ring.map(sphere));
const dots = land.dots.map(sphere);
const grid: Vector[][] = [];
for (let lon = -180; lon < 180; lon += 30) {
  grid.push(Array.from({ length: 91 }, (_, i) => sphere([lon, i * 2 - 90])));
}
for (let lat = -60; lat <= 60; lat += 30) {
  grid.push(Array.from({ length: 181 }, (_, i) => sphere([i * 2 - 180, lat])));
}
// Illustrative connections, not office locations or a claim about completed projects.
const markets = [
  [13, 52],
  [-74, 40],
  [55, 25],
  [103, 1],
  [139, 35],
  [18, -34],
].map(sphere);
const connections = markets.slice(1).map((destination) => {
  const origin = markets[0];
  const angle = Math.acos(
    Math.max(
      -1,
      Math.min(
        1,
        origin.reduce((sum, n, i) => sum + n * destination[i], 0),
      ),
    ),
  );
  return Array.from({ length: 65 }, (_, i): Vector => {
    const t = i / 64,
      lift = 1.012 + Math.sin(Math.PI * t) * 0.13;
    return origin.map(
      (n, j) =>
        ((n * Math.sin((1 - t) * angle) +
          destination[j] * Math.sin(t * angle)) /
          Math.sin(angle)) *
        lift,
    ) as Vector;
  });
});
const labels = {
  pl: "Interaktywny globus z symbolicznymi połączeniami biznesowymi. Przeciągnij lub użyj strzałek, aby obrócić.",
  en: "Interactive globe with illustrative business connections. Drag or use arrow keys to rotate.",
  da: "Interaktiv globus med illustrative forretningsforbindelser. Træk eller brug piletasterne for at rotere.",
  de: "Interaktiver Globus mit symbolischen Geschäftsverbindungen. Zum Drehen ziehen oder Pfeiltasten verwenden.",
};

/** Geographic 3D projection rendered locally; works without WebGL or remote textures. */
export function CoreScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotionPreferences();
  const { lang } = useLanguage();
  const pausedRef = useRef(paused);
  const redraw = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    pausedRef.current = paused;
    redraw.current();
  }, [paused]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let width = 0,
      height = 0,
      radius = 0,
      frame = 0,
      last = 0,
      elapsed = 0;
    let active = true,
      visible = !document.hidden,
      dirty = true;
    const motion = new GlobeMotion();
    let pointerX = 0,
      pointerY = 0,
      previousX = 0,
      previousY = 0;
    let activePointer: number | null = null;
    let targetX = 0,
      targetY = 0;
    const draw = () => {
      if (!width || !height || !radius) return;
      ctx.clearRect(0, 0, width, height);
      if (import.meta.env.DEV) {
        canvas.dataset.rotation = motion.yaw.toFixed(5);
        canvas.dataset.tilt = motion.tilt.toFixed(5);
      }
      const cx = width * 0.5 + pointerX * 5,
        cy = height * 0.49 + pointerY * 4;
      const c = Math.cos(motion.yaw),
        s = Math.sin(motion.yaw),
        ct = Math.cos(motion.tilt),
        st = Math.sin(motion.tilt);
      const project = ([x, y, z]: Vector): Vector => {
        const xx = x * c + z * s,
          zz = z * c - x * s;
        return [
          cx + xx * radius,
          cy + (y * ct + zz * st) * radius,
          zz * ct - y * st,
        ];
      };
      const path = (points: Vector[], color: string, lineWidth: number) => {
        ctx.beginPath();
        let pen = false;
        for (const point of points) {
          const [x, y, z] = project(point);
          if (z > 0.005) {
            if (pen) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            pen = true;
          } else pen = false;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      };
      const halo = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.92,
        cx,
        cy,
        radius * 1.22,
      );
      halo.addColorStop(0, "#b9783823");
      halo.addColorStop(0.52, "#bc87520a");
      halo.addColorStop(1, "#bc875200");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.translate(cx, cy + radius * 1.16);
      ctx.scale(1, 0.13);
      const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.85);
      shadow.addColorStop(0, "#00000060");
      shadow.addColorStop(1, "#00000000");
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      const body = ctx.createRadialGradient(
        cx - radius * 0.38,
        cy - radius * 0.45,
        radius * 0.05,
        cx,
        cy,
        radius * 1.03,
      );
      body.addColorStop(0, "#303839");
      body.addColorStop(0.45, "#1b2426");
      body.addColorStop(0.82, "#141c1e");
      body.addColorStop(1, "#080e10");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      grid.forEach((line) => path(line, "#c8a47916", 0.65));
      coasts.forEach((line) => path(line, "#bb8b5982", 0.65));
      for (const point of dots) {
        const [x, y, z] = project(point);
        if (z <= 0.01) continue;
        const light = Math.max(
          0,
          Math.min(
            1,
            0.55 + ((cx - x) / radius) * 0.22 + ((cy - y) / radius) * 0.27,
          ),
        );
        ctx.fillStyle = `rgba(${Math.round(180 + light * 60)},${Math.round(123 + light * 57)},${Math.round(74 + light * 59)},${0.25 + z * 0.7})`;
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          (0.56 + z * 0.4) * Math.max(0.7, radius / 220),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.strokeStyle = "#c394604d";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      connections.forEach((route, index) => {
        path(route, "#dca96b60", 0.8);
        const particle =
          route[
            Math.floor(
              ((elapsed * 0.095 + index * 0.19) % 1) * (route.length - 1),
            )
          ];
        const [x, y, z] = project(particle);
        if (z > 0.02) {
          ctx.shadowColor = "#e6b888";
          ctx.shadowBlur = 9;
          ctx.fillStyle = "#f1ceaa";
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      markets.forEach((point, index) => {
        const [x, y, z] = project(point);
        if (z < 0.07) return;
        ctx.strokeStyle = `rgba(221,177,129,${0.25 + z * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, index ? 4.3 : 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#e8c5a0";
        ctx.beginPath();
        ctx.arc(x, y, index ? 1.7 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    const tick = (now: number) => {
      frame = 0;
      if (!active || !visible) {
        last = 0;
        return;
      }
      const moving = !pausedRef.current;
      if (!last || now - last >= 32 || dirty) {
        const dt = last ? Math.min(now - last, 70) / 1000 : 0;
        if (moving) {
          elapsed += dt;
        }
        motion.advance(dt, !moving);
        pointerX += (targetX - pointerX) * 0.14;
        pointerY += (targetY - pointerY) * 0.14;
        last = now;
        dirty = false;
        draw();
      }
      if (moving || dirty) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      dirty = true;
      if (!frame && active && visible) frame = requestAnimationFrame(tick);
    };
    redraw.current = wake;
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width * 0.405, height * 0.39);
      wake();
    };
    const finish = (event?: PointerEvent, cancelled = false) => {
      if (event && event.pointerId !== activePointer) return;
      const id = activePointer;
      activePointer = null;
      motion.release(performance.now(), cancelled);
      canvas.classList.remove("is-dragging");
      if (id !== null && canvas.hasPointerCapture(id))
        canvas.releasePointerCapture(id);
      wake();
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || activePointer !== null)
        return;
      activePointer = event.pointerId;
      previousX = event.clientX;
      previousY = event.clientY;
      motion.begin(performance.now());
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add("is-dragging");
      if (event.pointerType === "mouse") {
        event.preventDefault();
        canvas.focus({ preventScroll: true });
      }
      wake();
    };
    const move = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      const bounds = canvas.getBoundingClientRect();
      targetX = pausedRef.current
        ? 0
        : (event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5;
      targetY = pausedRef.current
        ? 0
        : (event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5;
      if (activePointer === event.pointerId) {
        // Horizontal touch gestures rotate the globe; vertical gestures still scroll the page.
        motion.drag(
          event.clientX - previousX,
          event.pointerType === "touch" ? 0 : event.clientY - previousY,
          performance.now(),
          radius,
        );
        previousX = event.clientX;
        previousY = event.clientY;
      }
      wake();
    };
    const up = (event: PointerEvent) => finish(event);
    const cancel = (event: PointerEvent) => finish(event, true);
    const leave = () => {
      targetX = targetY = 0;
      wake();
    };
    const blur = () => {
      finish(undefined, true);
      last = 0;
    };
    const key = (event: KeyboardEvent) => {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      if (event.key === "ArrowLeft") motion.nudge(-0.18, 0);
      if (event.key === "ArrowRight") motion.nudge(0.18, 0);
      if (event.key === "ArrowUp") motion.nudge(0, -0.1);
      if (event.key === "ArrowDown") motion.nudge(0, 0.1);
      wake();
    };
    const visibility = () => {
      visible = !document.hidden;
      if (!visible) finish(undefined, true);
      last = 0;
      wake();
    };
    const sizing = new ResizeObserver(resize);
    sizing.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      last = 0;
      wake();
    });
    intersection.observe(canvas);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", cancel);
    canvas.addEventListener("lostpointercapture", cancel);
    window.addEventListener("blur", blur);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    resize();
    setReady(true);
    return () => {
      cancelAnimationFrame(frame);
      sizing.disconnect();
      intersection.disconnect();
      redraw.current = () => {};
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", cancel);
      canvas.removeEventListener("lostpointercapture", cancel);
      window.removeEventListener("blur", blur);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <div className="core-scene globe-scene">
      <div
        className={`globe-fallback ${ready ? "is-hidden" : ""}`}
        aria-hidden="true"
      />
      <canvas
        ref={ref}
        className={ready ? "is-ready" : ""}
        role="img"
        tabIndex={0}
        aria-label={labels[lang]}
      />
      <span className="scene-coordinate coordinate-top" aria-hidden="true">
        <span className="scene-dot" /> AN INTERNATIONAL PERSPECTIVE
      </span>
      <span className="scene-cross" aria-hidden="true">
        +
      </span>
    </div>
  );
}
