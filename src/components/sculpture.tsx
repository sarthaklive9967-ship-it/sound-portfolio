"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type ReactNode,
} from "react";
import styles from "./sculpture.module.css";
import type { SculptureInput } from "./sculpture-scene";

const SculptureScene = dynamic(() => import("./sculpture-scene"), {
  ssr: false,
});

type SculptureState = "loading" | "ready" | "fallback";

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const getDocumentVisible = () => !document.hidden;
const getServerSnapshot = () => false;

function supportsWebGL() {
  try {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Sculpture() {
  const container = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SculptureState>("loading");
  const [shouldLoad, setShouldLoad] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    getReducedMotion,
    getServerSnapshot,
  );
  const documentVisible = useSyncExternalStore(
    subscribeVisibility,
    getDocumentVisible,
    getServerSnapshot,
  );
  const descriptionId = useId();
  const input = useRef<SculptureInput>({
    pointerX: 0,
    pointerY: 0,
    rotationX: 0,
    rotationY: 0,
    velocityX: 0,
    velocityY: 0,
    dragging: false,
    invalidate: () => {},
  });
  const drag = useRef<{
    id: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    time: number;
    horizontal: boolean;
  } | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    function loadScene() {
      if (supportsWebGL()) setShouldLoad(true);
      else setState("fallback");
    }

    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => {
        loadScene();
        setInView(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadScene();
          preload.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    const visibility = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 },
    );
    preload.observe(element);
    visibility.observe(element);
    return () => {
      preload.disconnect();
      visibility.disconnect();
    };
  }, []);

  const onReady = useCallback(() => setState("ready"), []);
  const onFailure = useCallback(() => setState("fallback"), []);
  const active = inView && documentVisible;
  const animated = active && !paused && !reducedMotion;

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      state !== "ready" ||
      event.button !== 0 ||
      (event.target as HTMLElement).closest("button")
    ) {
      return;
    }
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      time: event.timeStamp,
      horizontal: event.pointerType === "mouse",
    };
    input.current.dragging = true;
    input.current.velocityX = 0;
    input.current.velocityY = 0;
    if (event.pointerType === "mouse") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.pointerType === "mouse" && !reducedMotion) {
      input.current.pointerX =
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      input.current.pointerY =
        ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    }

    const current = drag.current;
    if (current?.id === event.pointerId) {
      const distanceX = event.clientX - current.startX;
      const distanceY = event.clientY - current.startY;
      if (
        !current.horizontal &&
        Math.abs(distanceX) > 8 &&
        Math.abs(distanceX) > Math.abs(distanceY)
      ) {
        current.horizontal = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      if (current.horizontal) {
        const dx = (event.clientX - current.lastX) * 0.005;
        const dy = (event.clientY - current.lastY) * 0.003;
        const elapsed = Math.max(
          (event.timeStamp - current.time) / 1000,
          0.016,
        );
        input.current.rotationY += dx;
        input.current.rotationX = Math.max(
          -0.7,
          Math.min(0.7, input.current.rotationX + dy),
        );
        input.current.velocityY = Math.max(-2, Math.min(2, dx / elapsed));
        input.current.velocityX = Math.max(-1, Math.min(1, dy / elapsed));
      }
      current.lastX = event.clientX;
      current.lastY = event.clientY;
      current.time = event.timeStamp;
    }
    if (active) input.current.invalidate();
  }

  function stopDragging(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    input.current.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function rotate(direction: number) {
    input.current.rotationY += direction * 0.35;
    input.current.velocityX = 0;
    input.current.velocityY = 0;
    input.current.invalidate();
  }

  return (
    <div
      ref={container}
      className={styles.sculpture}
      data-sculpture-state={state}
      data-motion={animated ? "active" : "paused"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onLostPointerCapture={stopDragging}
      onPointerLeave={() => {
        input.current.pointerX = 0;
        input.current.pointerY = 0;
        if (active) input.current.invalidate();
      }}
    >
      <div className={styles.fallback} aria-hidden="true">
        <span className={`${styles.frame} ${styles.frameBack}`} />
        <span className={`${styles.frame} ${styles.frameMiddle}`} />
        <span className={`${styles.frame} ${styles.frameFront}`} />
      </div>
      {shouldLoad && state !== "fallback" && (
        <div className={styles.canvas} aria-hidden="true">
          <SceneBoundary onFailure={onFailure}>
            <SculptureScene
              inputRef={input}
              active={active}
              animated={animated}
              onReady={onReady}
              onFailure={onFailure}
            />
          </SceneBoundary>
        </div>
      )}
      <p id={descriptionId} className={styles.srOnly} role="status">
        {state === "loading"
          ? "Loading interactive metal sculpture. A still illustration is displayed."
          : state === "fallback"
            ? "Metal sculpture displayed as a still illustration."
            : "Interactive metal sculpture. Drag horizontally or use the rotation buttons."}
      </p>
      {state === "ready" && (
        <div
          className={styles.controls}
          role="group"
          aria-label="Sculpture controls"
          aria-describedby={descriptionId}
        >
          <span className={styles.hint} aria-hidden="true">
            DRAG TO EXPLORE
          </span>
          <button
            type="button"
            aria-label="Rotate sculpture left"
            onClick={() => rotate(-1)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m11.5 5-5 5 5 5M7 10h9" />
            </svg>
          </button>
          {!reducedMotion && (
            <button
              type="button"
              aria-label={
                paused ? "Resume sculpture motion" : "Pause sculpture motion"
              }
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                {paused ? (
                  <path d="m7 5 7 5-7 5V5Z" />
                ) : (
                  <path d="M7 5v10M13 5v10" />
                )}
              </svg>
            </button>
          )}
          <button
            type="button"
            aria-label="Rotate sculpture right"
            onClick={() => rotate(1)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m8.5 5 5 5-5 5M13 10H4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
