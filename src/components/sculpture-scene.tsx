"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  Color,
  ExtrudeGeometry,
  MathUtils,
  Path,
  Shape,
  type Group,
} from "three";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";

export type SculptureInput = {
  pointerX: number;
  pointerY: number;
  rotationX: number;
  rotationY: number;
  velocityX: number;
  velocityY: number;
  dragging: boolean;
  invalidate: () => void;
};

type SceneProps = {
  inputRef: RefObject<SculptureInput>;
  active: boolean;
  animated: boolean;
  onReady: () => void;
  onFailure: () => void;
};

function roundedRectangle<T extends Shape | Path>(
  path: T,
  width: number,
  height: number,
  radius: number,
): T {
  const x = -width / 2;
  const y = -height / 2;
  path.moveTo(x + radius, y);
  path.lineTo(x + width - radius, y);
  path.quadraticCurveTo(x + width, y, x + width, y + radius);
  path.lineTo(x + width, y + height - radius);
  path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  path.lineTo(x + radius, y + height);
  path.quadraticCurveTo(x, y + height, x, y + height - radius);
  path.lineTo(x, y + radius);
  path.quadraticCurveTo(x, y, x + radius, y);
  path.closePath();
  return path;
}

function MetalFrames({
  inputRef,
  animated,
}: Pick<SceneProps, "inputRef" | "animated">) {
  const group = useRef<Group>(null);
  const phase = useRef(0);
  const geometry = useMemo(() => {
    const outer = roundedRectangle(new Shape(), 2.25, 3.2, 0.58);
    outer.holes.push(roundedRectangle(new Path(), 1.55, 2.5, 0.27));
    const frame = new ExtrudeGeometry(outer, {
      depth: 0.29,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.095,
      bevelSize: 0.095,
      bevelSegments: 8,
      curveSegments: 24,
    });
    frame.center();
    return toCreasedNormals(frame, Math.PI / 3);
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, frameDelta) => {
    if (!group.current) return;
    const delta = Math.min(frameDelta, 0.05);
    const controls = inputRef.current;

    if (animated) {
      phase.current += delta;
      if (!controls.dragging) {
        controls.rotationX = MathUtils.clamp(
          controls.rotationX + controls.velocityX * delta,
          -0.7,
          0.7,
        );
        controls.rotationY += controls.velocityY * delta;
        const friction = Math.exp(-5 * delta);
        controls.velocityX *= friction;
        controls.velocityY *= friction;
      }
    }

    const x =
      -0.09 +
      controls.rotationX +
      controls.pointerY * 0.08 +
      Math.sin(phase.current * 0.22) * 0.055;
    const y =
      -0.18 +
      controls.rotationY +
      controls.pointerX * 0.12 +
      Math.sin(phase.current * 0.18) * 0.13;
    const easing = animated ? 1 - Math.exp(-4 * delta) : 1;
    group.current.rotation.x = MathUtils.lerp(
      group.current.rotation.x,
      x,
      easing,
    );
    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      y,
      easing,
    );
    group.current.rotation.z = 0.035 + Math.sin(phase.current * 0.16) * 0.025;
    group.current.position.y = Math.sin(phase.current * 0.35) * 0.045;
  });

  return (
    <group ref={group} rotation={[-0.09, -0.18, 0.035]}>
      <mesh
        geometry={geometry}
        rotation={[0.44, -0.52, -0.48]}
        position={[-0.22, 0.22, -0.3]}
      >
        <meshPhysicalMaterial
          color="#a6adb7"
          metalness={1}
          roughness={0.3}
          anisotropy={0.25}
          anisotropyRotation={Math.PI / 2}
          envMapIntensity={1.3}
        />
      </mesh>
      <mesh
        geometry={geometry}
        rotation={[-0.48, 0.68, 0.66]}
        position={[0.22, 0.02, 0]}
      >
        <meshPhysicalMaterial
          color="#b9c0c9"
          metalness={1}
          roughness={0.27}
          anisotropy={0.25}
          anisotropyRotation={Math.PI / 2}
          envMapIntensity={1.3}
        />
      </mesh>
      <mesh
        geometry={geometry}
        rotation={[0.89, 0.31, -0.77]}
        position={[0.04, -0.2, 0.3]}
        scale={0.94}
      >
        <meshPhysicalMaterial
          color="#c8cdd4"
          metalness={1}
          roughness={0.29}
          anisotropy={0.25}
          anisotropyRotation={Math.PI / 2}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

function SceneLifecycle({ onFailure }: Pick<SceneProps, "onFailure">) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    function contextLost(event: Event) {
      event.preventDefault();
      onFailure();
    }
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => canvas.removeEventListener("webglcontextlost", contextLost);
  }, [gl, onFailure]);
  return null;
}

export default function SculptureScene({
  inputRef,
  active,
  animated,
  onReady,
  onFailure,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.9], fov: 37, near: 0.1, far: 30 }}
      dpr={[
        1,
        typeof window !== "undefined" && window.innerWidth < 768 ? 1.25 : 1.5,
      ]}
      frameloop={animated ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      fallback="Abstract metal sculpture."
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor(new Color("#0b0d10"), 0);
        gl.toneMappingExposure = 1.18;
        inputRef.current.invalidate = invalidate;
        onReady();
      }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <SceneLifecycle onFailure={onFailure} />
      <MetalFrames inputRef={inputRef} animated={animated && active} />
      <Environment resolution={128} frames={1}>
        <color attach="background" args={["#45474c"]} />
        <Lightformer
          form="rect"
          intensity={4}
          color="#f4f7ff"
          position={[-3, 3, 4]}
          rotation={[0, 0.4, -0.4]}
          scale={[1.2, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#ffffff"
          position={[2.5, 3.5, 1]}
          rotation={[Math.PI / 2, 0, 0.3]}
          scale={[4, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.7}
          color="#dfeaff"
          position={[4, -1, 2]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[1, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#f2f5ff"
          position={[0, -4, 3]}
          rotation={[Math.PI / 3, 0, 0]}
          scale={[5, 1, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#f4f5f7"
          position={[0, -5, -1]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.65}
          color="#8ba6d6"
          position={[-3, 0, -4]}
          rotation={[0, Math.PI, 0]}
          scale={[3, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#ffffff"
          position={[0, 1, 5]}
          scale={[6, 6, 1]}
        />
      </Environment>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#f4f7ff" />
    </Canvas>
  );
}
