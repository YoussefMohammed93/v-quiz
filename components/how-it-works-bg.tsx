"use client";

import * as THREE from "three";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function DigitalGrid() {
  const meshRef = useRef<THREE.Points>(null);

  // Grid parameters
  const count = 100; // grid density
  const sep = 4;

  const { positions, originalPositions } = useMemo(() => {
    const positions = [];
    const originalPositions = [];

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        const x = sep * (xi - count / 2);
        const z = sep * (zi - count / 2);
        const y = 0;
        positions.push(x, y, z);
        originalPositions.push(x, y, z);
      }
    }

    return {
      positions: new Float32Array(positions),
      originalPositions: new Float32Array(originalPositions),
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position
      .array as Float32Array;

    // Mouse interaction - convert normalized to world approx
    const mouseX = state.pointer.x * 50;
    const mouseY = state.pointer.y * 50;

    for (let i = 0; i < positions.length; i += 3) {
      const origX = originalPositions[i];
      const origZ = originalPositions[i + 2];

      // Cyber wave motion
      let y =
        Math.sin(origX * 0.2 + time) * 1.5 +
        Math.cos(origZ * 0.1 + time * 0.5) * 1.5;

      // Mouse ripple
      const dx = origX - mouseX;
      const dz = origZ - -mouseY; // Flip Y for 3D space
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 20) {
        const force = (1 - dist / 20) * 4;
        y += Math.sin(dist * 0.5 - time * 8) * force;
      }

      positions[i + 1] = y;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02; // Slow rotation
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        color="#fff"
        transparent
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
}

function Rig() {
  useFrame((state) => {
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HowItWorksBG() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 40, 50], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Rig />
        <fog attach="fog" args={["#000", 50, 200]} />
        <DigitalGrid />
      </Canvas>
    </div>
  );
}
