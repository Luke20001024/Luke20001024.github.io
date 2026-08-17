"use client";

import { useEffect, useRef, useState } from "react";

const PORTRAIT_SOURCE = "/assets/yiyang-particle-portrait-cobalt-engraving-v1-transparent.png";
const MOTION_HOLD_MS = 100;
const BURST_ENTER_MS = 650;
const BURST_HOLD_MS = 900;
const BURST_RESTORE_MS = 550;

type LabPhase = "loading" | "baseline" | "dispersing" | "holding" | "regrouping" | "restoring";

type LabSettings = {
  tilt: number;
  scatter: number;
  regroup: number;
};

type PortraitParticle = {
  homeX: number;
  homeY: number;
  alpha: number;
  size: number;
  dash: boolean;
  scatterX: number;
  scatterY: number;
  lowerWeight: number;
  binaryDigit: "0" | "1" | null;
  binarySize: number;
  binaryAlpha: number;
};

const DEFAULT_SETTINGS: LabSettings = {
  tilt: 1,
  scatter: 0.9,
  regroup: 2.8,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function damp(current: number, target: number, lambda: number, deltaSeconds: number) {
  return target + (current - target) * Math.exp(-lambda * deltaSeconds);
}

function smoothstep(edgeStart: number, edgeEnd: number, value: number) {
  const progress = clamp((value - edgeStart) / (edgeEnd - edgeStart), 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - clamp(value, 0, 1), 3);
}

function smootherstep(value: number) {
  const progress = clamp(value, 0, 1);
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
}

function seededValue(x: number, y: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export default function ParticlePortrait() {
  const figureRef = useRef<HTMLButtonElement>(null);
  const planeRef = useRef<HTMLSpanElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);
  const upperRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef(DEFAULT_SETTINGS);
  const cycleStartedAtRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const [portraitReady, setPortraitReady] = useState(false);
  const [cycleActive, setCycleActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const triggerParticleCycle = () => {
    if (reducedMotionRef.current || !portraitReady || cycleStartedAtRef.current !== null) return;
    cycleStartedAtRef.current = performance.now();
    setCycleActive(true);
  };

  useEffect(() => {
    const figure = figureRef.current;
    const plane = planeRef.current;
    const fallback = fallbackRef.current;
    const upper = upperRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!figure || !plane || !fallback || !upper || !canvas || !context) return;

    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionMedia.matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    let motionEnabled = !reducedMotion && !coarsePointer;
    reducedMotionRef.current = reducedMotion;
    setPrefersReducedMotion(reducedMotion);

    const sourceImage = new Image();
    let particles: PortraitParticle[] = [];
    let sourcePixels: Uint8ClampedArray | null = null;
    let sourceWidth = 0;
    let sourceHeight = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let resizeFrame = 0;
    let isVisible = true;
    let disposed = false;
    let lastFrameAt = 0;
    let hasBuiltPortrait = false;
    let currentPhase: LabPhase = "loading";

    const effect = {
      fullAmount: 0,
      scatterAmount: 0,
      lastRenderedScatter: Number.NEGATIVE_INFINITY,
      lastRenderedFull: Number.NEGATIVE_INFINITY,
    };

    const pointer = {
      inside: false,
      lastX: 0,
      lastY: 0,
      targetX: 0,
      targetY: 0,
      velocityX: 0,
      velocityY: 0,
      motionX: 0,
      motionY: 0,
      activity: 0,
      lastMovedAt: Number.NEGATIVE_INFINITY,
    };

    const changePhase = (nextPhase: LabPhase) => {
      if (currentPhase === nextPhase) return;
      currentPhase = nextPhase;
    };

    const resetToBaseline = () => {
      pointer.inside = false;
      pointer.targetX = 0;
      pointer.targetY = 0;
      pointer.velocityX = 0;
      pointer.velocityY = 0;
      pointer.motionX = 0;
      pointer.motionY = 0;
      pointer.activity = 0;
      pointer.lastMovedAt = Number.NEGATIVE_INFINITY;
      effect.fullAmount = 0;
      effect.scatterAmount = 0;
      effect.lastRenderedScatter = Number.NEGATIVE_INFINITY;
      effect.lastRenderedFull = Number.NEGATIVE_INFINITY;
      lastFrameAt = 0;
      cycleStartedAtRef.current = null;
      setCycleActive(false);
      plane.style.transform = "";
      fallback.style.opacity = "0";
      upper.style.opacity = "1";
      canvas.style.opacity = "1";

      changePhase("baseline");
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      motionEnabled = !reducedMotion && !coarsePointer;
      reducedMotionRef.current = reducedMotion;
      if (!disposed) setPrefersReducedMotion(reducedMotion);
      if (reducedMotion) resetToBaseline();
    };
    reducedMotionMedia.addEventListener("change", handleReducedMotionChange);

    const renderParticlePortrait = (scatterScale = 0, fullAmount = 0) => {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.fillStyle = "#2b31e8";
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (const portraitParticle of particles) {
        const coverage =
          portraitParticle.lowerWeight + (1 - portraitParticle.lowerWeight) * fullAmount;
        if (coverage <= 0.001) continue;
        const x = portraitParticle.homeX + portraitParticle.scatterX * scatterScale;
        const y = portraitParticle.homeY + portraitParticle.scatterY * scatterScale;
        const activeUpperBoost = 1 + (1 - portraitParticle.lowerWeight) * fullAmount * 0.65;
        context.globalAlpha = portraitParticle.alpha * coverage * activeUpperBoost;
        if (portraitParticle.dash) {
          context.fillRect(
            x,
            y,
            portraitParticle.size * 1.72,
            Math.max(0.5, portraitParticle.size * 0.42),
          );
        } else {
          context.fillRect(
            x,
            y,
            portraitParticle.size,
            portraitParticle.size,
          );
        }
      }

      for (const portraitParticle of particles) {
        if (!portraitParticle.binaryDigit) continue;
        const x = portraitParticle.homeX + portraitParticle.scatterX * scatterScale * 0.35;
        const y = portraitParticle.homeY + portraitParticle.scatterY * scatterScale * 0.35;
        context.globalAlpha = portraitParticle.binaryAlpha;
        context.font = `${portraitParticle.binarySize.toFixed(2)}px "JetBrains Mono", "SFMono-Regular", monospace`;
        context.fillText(portraitParticle.binaryDigit, x, y);
      }
      context.globalAlpha = 1;
    };

    const rebuildParticles = () => {
      const bounds = figure.getBoundingClientRect();
      canvasWidth = Math.max(1, Math.round(bounds.width));
      canvasHeight = Math.max(1, Math.round(bounds.height));
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(canvasWidth * pixelRatio);
      canvas.height = Math.round(canvasHeight * pixelRatio);

      const sampleCanvas = document.createElement("canvas");
      sourceWidth = Math.min(480, sourceImage.naturalWidth);
      sourceHeight = Math.round(sourceWidth * (sourceImage.naturalHeight / sourceImage.naturalWidth));
      sampleCanvas.width = sourceWidth;
      sampleCanvas.height = sourceHeight;

      const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;
      sampleContext.clearRect(0, 0, sourceWidth, sourceHeight);
      sampleContext.drawImage(sourceImage, 0, 0, sourceWidth, sourceHeight);
      sourcePixels = sampleContext.getImageData(0, 0, sourceWidth, sourceHeight).data;

      const spacing = Math.max(3, Math.round(Math.sqrt((sourceWidth * sourceHeight) / 30000)));
      const nextParticles: PortraitParticle[] = [];

      for (let sampleY = 0; sampleY < sourceHeight; sampleY += spacing) {
        for (let sampleX = 0; sampleX < sourceWidth; sampleX += spacing) {
          const offset = (sampleY * sourceWidth + sampleX) * 4;
          const sourceAlpha = sourcePixels[offset + 3] / 255;
          if (sourceAlpha <= 0.035) continue;

          const luminance =
            sourcePixels[offset] * 0.2126 +
            sourcePixels[offset + 1] * 0.7152 +
            sourcePixels[offset + 2] * 0.0722;
          const ink = (255 - luminance) / 255;
          const density = Math.max(sourceAlpha * 0.25, sourceAlpha * ink * 1.18);
          const seed = seededValue(sampleX, sampleY);
          if (seed > clamp(0.68 + density * 0.28, 0.68, 0.97)) continue;

          const homeX = ((sampleX + (seed - 0.5) * spacing * 0.22) / sourceWidth) * canvasWidth;
          const homeY =
            ((sampleY + (seededValue(sampleY, sampleX) - 0.5) * spacing * 0.22) / sourceHeight) *
            canvasHeight;
          const spreadSeedX = seededValue(sampleX + 91.7, sampleY + 47.3);
          const spreadSeedY = seededValue(sampleY + 163.1, sampleX + 29.9);
          const normalizedY = homeY / canvasHeight;
          const lowerWeight = smoothstep(0.62, 0.78, normalizedY);
          const waterfallDepth = smoothstep(0.68, 0.96, normalizedY);
          const bodyDepth =
            smoothstep(0.68, 0.75, normalizedY) * (1 - smoothstep(0.95, 0.99, normalizedY));
          const binarySeed = seededValue(sampleX + 211.3, sampleY + 137.9);
          const digitSeed = seededValue(sampleY + 73.1, sampleX + 307.7);
          const binaryChance = bodyDepth * (0.075 + waterfallDepth * 0.055);
          const binaryDigit =
            sourceAlpha > 0.08 && binarySeed > 1 - binaryChance ? (digitSeed > 0.5 ? "1" : "0") : null;
          const radialScale = 0.012 + seed * 0.014;

          nextParticles.push({
            homeX,
            homeY,
            alpha: 0.19 + density * 0.76,
            size: 0.52 + density * 1.16 + seed * 0.2,
            dash: seed > 0.34,
            scatterX: (homeX - canvasWidth * 0.5) * radialScale + (spreadSeedX - 0.5) * 7,
            scatterY:
              (homeY - canvasHeight * 0.48) * radialScale * 0.85 +
              (spreadSeedY - 0.5) * 7 +
              smoothstep(0.65, 0.96, normalizedY) * 4,
            lowerWeight,
            binaryDigit,
            binarySize: (4.7 + waterfallDepth * 8.6) * (0.82 + digitSeed * 0.36),
            binaryAlpha:
              (0.2 + waterfallDepth * 0.23 + digitSeed * 0.07) *
              (1 - smoothstep(0.965, 0.995, normalizedY)),
          });
        }
      }

      particles = nextParticles;
      const visibleScatter =
        effect.scatterAmount *
        settingsRef.current.scatter *
        smoothstep(0.42, 0.92, effect.fullAmount);
      renderParticlePortrait(visibleScatter, effect.fullAmount);
      effect.lastRenderedScatter = visibleScatter;
      effect.lastRenderedFull = effect.fullAmount;
      if (!hasBuiltPortrait) {
        hasBuiltPortrait = true;
        resetToBaseline();
        renderParticlePortrait(0, 0);
      }
      pointer.inside = false;
      pointer.lastX = 0;
      pointer.lastY = 0;
      pointer.velocityX = 0;
      pointer.velocityY = 0;
      if (!disposed) setPortraitReady(true);
    };

    const draw = (time: number) => {
      if (!isVisible || disposed) {
        animationFrame = 0;
        return;
      }

      const deltaSeconds = lastFrameAt ? clamp((time - lastFrameAt) / 1000, 0.001, 0.05) : 1 / 60;
      lastFrameAt = time;

      const { tilt, scatter, regroup } = settingsRef.current;
      const cycleStartedAt = cycleStartedAtRef.current;
      const cycleRunning = cycleStartedAt !== null;
      const activelyMoving =
        motionEnabled && !cycleRunning && pointer.inside && time - pointer.lastMovedAt < MOTION_HOLD_MS;

      if (cycleStartedAt !== null) {
        const elapsed = Math.max(0, time - cycleStartedAt);
        const regroupDuration = regroup * 1000;
        const regroupStartsAt = BURST_ENTER_MS + BURST_HOLD_MS;
        const restoreStartsAt = regroupStartsAt + regroupDuration;
        const cycleEndsAt = restoreStartsAt + BURST_RESTORE_MS;

        if (elapsed < BURST_ENTER_MS) {
          const progress = elapsed / BURST_ENTER_MS;
          effect.fullAmount = easeOutCubic(progress);
          effect.scatterAmount = smoothstep(0.32, 1, progress);
          changePhase("dispersing");
        } else if (elapsed < regroupStartsAt) {
          effect.fullAmount = 1;
          effect.scatterAmount = 1;
          changePhase("holding");
        } else if (elapsed < restoreStartsAt) {
          const progress = (elapsed - regroupStartsAt) / regroupDuration;
          effect.fullAmount = 1;
          effect.scatterAmount = 1 - smootherstep(progress);
          changePhase("regrouping");
        } else if (elapsed < cycleEndsAt) {
          const progress = (elapsed - restoreStartsAt) / BURST_RESTORE_MS;
          effect.fullAmount = 1 - smootherstep(progress);
          effect.scatterAmount = 0;
          changePhase("restoring");
        } else {
          effect.fullAmount = 0;
          effect.scatterAmount = 0;
          cycleStartedAtRef.current = null;
          if (!disposed) setCycleActive(false);
          changePhase("baseline");
        }
      } else {
        effect.fullAmount = 0;
        effect.scatterAmount = 0;
        changePhase("baseline");
      }

      pointer.activity = damp(
        pointer.activity,
        activelyMoving ? 1 : 0,
        activelyMoving ? 12 : 3.8,
        deltaSeconds,
      );

      const composedTargetX = (pointer.targetX * 0.74 + pointer.velocityX * 0.26) * pointer.activity;
      const composedTargetY = (pointer.targetY * 0.74 + pointer.velocityY * 0.26) * pointer.activity;
      pointer.motionX = damp(pointer.motionX, composedTargetX, 6.7, deltaSeconds);
      pointer.motionY = damp(pointer.motionY, composedTargetY, 6.7, deltaSeconds);
      const velocityDecay = Math.exp(-15 * deltaSeconds);
      pointer.velocityX *= velocityDecay;
      pointer.velocityY *= velocityDecay;

      const translateX = pointer.motionX * 4.2;
      const translateY = pointer.motionY * 2.5;
      const tiltX = -pointer.motionY * tilt * 0.82;
      const tiltY = pointer.motionX * tilt * 1.28;
      const scale = 1 + pointer.activity * 0.002;

      if (pointer.activity > 0.001 || Math.abs(pointer.motionX) + Math.abs(pointer.motionY) > 0.001) {
        plane.style.transform =
          `perspective(1200px) translate3d(${translateX.toFixed(3)}px, ${translateY.toFixed(3)}px, 0)` +
          ` rotateX(${tiltX.toFixed(3)}deg) rotateY(${tiltY.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
      } else {
        plane.style.transform = "";
      }

      const visibleScatter =
        effect.scatterAmount * scatter * smoothstep(0.42, 0.92, effect.fullAmount);
      if (
        Math.abs(visibleScatter - effect.lastRenderedScatter) > 0.0004 ||
        Math.abs(effect.fullAmount - effect.lastRenderedFull) > 0.0004
      ) {
        renderParticlePortrait(visibleScatter, effect.fullAmount);
        effect.lastRenderedScatter = visibleScatter;
        effect.lastRenderedFull = effect.fullAmount;
      }

      canvas.style.opacity = "1";
      fallback.style.opacity = "0";
      upper.style.opacity = (1 - smoothstep(0.05, 0.9, effect.fullAmount)).toFixed(3);

      animationFrame = window.requestAnimationFrame(draw);
    };

    const startDrawing = () => {
      if (isVisible && !animationFrame && !disposed) animationFrame = window.requestAnimationFrame(draw);
    };

    const getPointerHit = (event: PointerEvent) => {
      if (!sourcePixels || !sourceWidth || !sourceHeight) return null;
      const bounds = figure.getBoundingClientRect();
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;

      if (localX < 0 || localY < 0 || localX >= bounds.width || localY >= bounds.height) {
        return { inside: false, localX, localY, width: bounds.width, height: bounds.height };
      }

      const sampleX = Math.floor((localX / bounds.width) * sourceWidth);
      const sampleY = Math.floor((localY / bounds.height) * sourceHeight);
      const hitRadius = Math.max(4, Math.round(sourceWidth * 0.012));
      const minX = Math.max(0, sampleX - hitRadius);
      const maxX = Math.min(sourceWidth - 1, sampleX + hitRadius);
      const minY = Math.max(0, sampleY - hitRadius);
      const maxY = Math.min(sourceHeight - 1, sampleY + hitRadius);

      for (let y = minY; y <= maxY; y += 2) {
        for (let x = minX; x <= maxX; x += 2) {
          const alpha = sourcePixels[(y * sourceWidth + x) * 4 + 3];
          if (alpha > 18) return { inside: true, localX, localY, width: bounds.width, height: bounds.height };
        }
      }

      return { inside: false, localX, localY, width: bounds.width, height: bounds.height };
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!motionEnabled) return;
      const hit = getPointerHit(event);
      if (!hit) return;

      if (!hit.inside) {
        pointer.inside = false;
        return;
      }

      const deltaX = pointer.inside ? hit.localX - pointer.lastX : 0;
      const deltaY = pointer.inside ? hit.localY - pointer.lastY : 0;
      const movement = pointer.inside ? Math.hypot(deltaX, deltaY) : 2;
      pointer.inside = true;
      pointer.lastX = hit.localX;
      pointer.lastY = hit.localY;

      if (movement < 0.45) return;
      pointer.targetX = clamp((hit.localX / hit.width - 0.5) * 2, -1, 1);
      pointer.targetY = clamp((hit.localY / hit.height - 0.5) * 2, -1, 1);
      pointer.velocityX = clamp(deltaX / Math.max(16, hit.width * 0.04), -1, 1);
      pointer.velocityY = clamp(deltaY / Math.max(16, hit.height * 0.04), -1, 1);
      pointer.lastMovedAt = performance.now();
    };

    const handlePointerLeave = () => {
      pointer.inside = false;
    };

    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(rebuildParticles);
    });

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startDrawing();
        else pointer.inside = false;
      },
      { rootMargin: "120px" },
    );

    sourceImage.onload = () => {
      if (disposed) return;
      rebuildParticles();
      resizeObserver.observe(figure);
      visibilityObserver.observe(figure);
      startDrawing();
    };
    sourceImage.src = PORTRAIT_SOURCE;

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      disposed = true;
      plane.style.transform = "";
      fallback.style.opacity = "1";
      upper.style.opacity = "0";
      canvas.style.opacity = "0";
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      reducedMotionMedia.removeEventListener("change", handleReducedMotionChange);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  const portraitFigure = (
    <figure
      className={`particle-lab-figure particle-portrait-hero-figure${portraitReady ? " is-ready" : ""}${cycleActive ? " is-cycling" : ""}`}
      aria-label="Luke Shi 的人物肖像"
      aria-busy={!portraitReady}
    >
      <button
        ref={figureRef}
        className="particle-lab-portrait-toggle"
        type="button"
        data-cursor="plain"
        aria-label={prefersReducedMotion ? "Luke Shi 的黑白人物肖像" : cycleActive ? "Luke Shi 人物粒子动画播放中" : "播放 Luke Shi 人物粒子动画"}
        disabled={!portraitReady || cycleActive || prefersReducedMotion}
        onClick={triggerParticleCycle}
      >
        <span ref={planeRef} className="particle-lab-portrait-plane">
          {/* The intact portrait, clear upper mask and lower particle field share one 3D plane. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={fallbackRef}
            className="particle-lab-fallback"
            src={PORTRAIT_SOURCE}
            alt=""
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={upperRef}
            className="particle-lab-upper"
            src={PORTRAIT_SOURCE}
            alt=""
            aria-hidden="true"
          />
          <canvas ref={canvasRef} className="particle-lab-canvas" data-particle-canvas aria-hidden="true" />
        </span>
      </button>
    </figure>
  );

  return (
    <div className="hero-portrait hero-particle-portrait reveal" data-particle-surface="hero">
      {portraitFigure}
    </div>
  );
}
