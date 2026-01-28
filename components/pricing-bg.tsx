"use client";

import * as THREE from "three";

import { useRef, useMemo } from "react";
import { Float, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

function FloatingOrbs() {
  return (
    <group>
      <Float speed={3} rotationIntensity={3} floatIntensity={3}></Float>
    </group>
  );
}

function MovingGrid() {
  const meshRef = useRef<THREE.Points>(null);

  const count = 50;
  const sep = 2.5;

  const { positions } = useMemo(() => {
    const positions = [];
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        const x = sep * (xi - count / 2);
        const z = sep * (zi - count / 2);
        const y = 0;
        positions.push(x, y, z);
      }
    }
    return {
      positions: new Float32Array(positions),
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const posArr = meshRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < posArr.length; i += 3) {
      const x = posArr[i];
      const z = posArr[i + 2];
      posArr[i + 1] =
        Math.sin(x * 0.15 + time) * 0.8 + Math.cos(z * 0.15 + time) * 0.8;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points
      ref={meshRef}
      position={[0, -8, -10]}
      rotation={[-Math.PI / 8, 0, 0]}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffc700"
        transparent
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
}

export function PricingBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[20, 20, 20]} intensity={2} color="#ffc700" />
        <pointLight position={[-20, -20, -20]} intensity={1} color="#ffc700" />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <FloatingOrbs />
        <MovingGrid />
        <fog attach="fog" args={["#000", 20, 60]} />
      </Canvas>
    </div>
  );
}
