import { Environment, Grid, PerspectiveCamera, View } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

import BulbasaurGeoJson from "../assets/models/bulbasaur.geo.json";
import { CuboidMesh, PokemonMesh } from "lib/main";
import { Bedrock } from "lib/types/Bedrock";

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
// const RotatingSphere: React.FC = () => {
//   const ref = useRef<THREE.Mesh>(null);

//   useFrame(() => {
//     if (ref.current) {
//       ref.current.rotation.y += 0.01;
//       ref.current.rotation.x += 0.01;
//     }
//   });

//   return (
//     <mesh ref={ref}>
//       <sphereGeometry args={[0.5, 32, 32]} />
//       <meshStandardMaterial color="blue" />
//     </mesh>
//   );
// };

function Common({ color }: { color?: string }) {
  return (
    <>
      {color && <color attach="background" args={[color]} />}
      <ambientLight intensity={0.5} />
      {/* <pointLight position={[20, 30, 10]} intensity={1} /> */}
      {/* <pointLight position={[-10, -10, -10]} color="blue" /> */}
      {/* <pointLight position={[10, 10, 10]} color="white" intensity={1000} /> */}
      <ambientLight intensity={0.25} color={0xffffffff} />
      <directionalLight position={[-1, -1, 10]} />
      {/* <Environment preset="dawn" /> */}
      <PerspectiveCamera makeDefault fov={2} position={[0, 0, 100]} />
      {/* <OrthographicCamera
        makeDefault
        position={[0, 0, 6]}
        // args={[-10, -10, 10, 10, 1, 1000]}
      /> */}
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
        gap: 10,
        height: "100vh",
      }}
    >
      {/* Canvas for Rotating Cube */}
      <div>
        <View id="cube" style={{ width: 300, height: 400 }}>
          <Common color="pink" />
          <RotatingCube />
        </View>
      </div>

      {/* Canvas for Bulbasaur Model */}
      <div>
        <View id="sphere" style={{ width: 500, height: 500 }}>
          {/* <Common color="pink" /> */}
          <color attach="background" args={["pink"]} />{" "}
          <ambientLight intensity={0.5} color={0xffffffff} />
          <directionalLight position={[-1, -1, 10]} />
          <PerspectiveCamera
            makeDefault
            fov={2}
            zoom={0.1}
            position={[0, 0, 100]}
          />
          <PokemonMesh geo={BulbasaurGeoJson as Bedrock.ModelGeo} />
        </View>
      </div>

      <div>
        <View id="sphere" style={{ width: 500, height: 500 }}>
          {/* <Common color="pink" /> */}
          <color attach="background" args={["pink"]} />{" "}
          <ambientLight intensity={0.5} color={0xffffffff} />
          <directionalLight position={[-1, -1, 10]} />
          <PerspectiveCamera
            makeDefault
            fov={2}
            zoom={0.1}
            position={[0, 0, 100]}
          />
          <group rotation={[0.4, Math.PI, 0]}>
            <CuboidMesh
              cube={{
                origin: [-8, 0, -8],
                size: [16, 1, 16],
              }}
            />
            <CuboidMesh
              cube={{
                origin: [6, 1, 6],
                size: [2, 1, 2],
                pivot: [7, 1, 7],
                rotation: [0, 0, 30],
              }}
            />
            <CuboidMesh
              cube={{
                origin: [-8, 1, -8],
                size: [2, 2, 2],
                pivot: [-7, 1, -7],
                rotation: [30, 0, 0],
              }}
            />
          </group>
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
