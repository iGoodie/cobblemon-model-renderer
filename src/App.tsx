import {
  Environment,
  PerspectiveCamera,
  View
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

// Rotating Cube Component
const RotatingCube: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

// Rotating Sphere Component
const RotatingSphere: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

function Common({ color }: { color?: string }) {
  return (
    <>
      {color && <color attach="background" args={[color]} />}
      <ambientLight intensity={0.5} />
      <pointLight position={[20, 30, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="blue" />
      <Environment preset="dawn" />
      <PerspectiveCamera makeDefault fov={20} position={[0, 0, 6]} />
    </>
  );
}

const App: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "space-around",
        height: "100vh",
      }}
    >
      {/* Canvas for Rotating Cube */}
      <div style={{ width: "45vw", height: "100vh" }}>
        <View id="cube" style={{ width: 500, height: 600 }}>
          <Common color="pink" />
          <RotatingCube />
        </View>
      </div>

      {/* Canvas for Rotating Sphere */}
      <div style={{ width: "45vw", height: "100vh" }}>
        <View id="sphere" style={{ width: 200, height: 200 }}>
          <Common color="pink" />
          <RotatingSphere />
        </View>
      </div>

      <Canvas
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflow: "hidden",
        }}
        eventSource={document.getElementById("root")!}
      >
        <View.Port />
      </Canvas>
    </div>
  );
};

export default App;
