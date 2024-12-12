import {
  Environment,
  Grid,
  OrthographicCamera,
  PerspectiveCamera,
  SoftShadows,
  View,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { CuboidMesh, PokemonMesh } from "lib/main";
import { Bedrock } from "lib/types/Bedrock";

import BulbasaurGeoJson from "../assets/models/bulbasaur.geo.json";
import CharmanderGeoJson from "../assets/models/charmander.geo.json";
import DebugGeoJson from "../assets/models/debug.geo.json";

import BulbasaurAnimJson from "../assets/animations/bulbasaur.animation.json";
import CharmanderAnimJson from "../assets/animations/charmander.animation.json";

import DebugTexture from "../assets/textures/debug.png";
import BulbasaurTexture from "../assets/textures/bulbasaur_m.png";
import CharmanderTexture from "../assets/textures/charmander.png";

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
      <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
        <View id="pokemon1" style={{ width: 400, height: 400 }}>
          {/* <Common color="pink" /> */}
          <color attach="background" args={["pink"]} />{" "}
          <ambientLight intensity={1.3} color={0xffffffff} />
          <directionalLight position={[-1, -1, 10]} />
          {/* <PerspectiveCamera
            makeDefault
            fov={1}
            zoom={0.05}
            position={[0, 0, 100]}
          /> */}
          <OrthographicCamera
            makeDefault
            position={[0, 75, 100]}
            zoom={8}
            rotation={[-0.6, 0, 0]}
          />
          <PokemonMesh
            geo={BulbasaurGeoJson as Bedrock.ModelGeoConfig}
            textureUrl={BulbasaurTexture}
          />
        </View>
        <View id="pokemon2" style={{ width: 400, height: 400 }}>
          {/* <Common color="pink" /> */}
          <color attach="background" args={["pink"]} />{" "}
          <ambientLight intensity={1.3} color={0xffffffff} />
          <directionalLight position={[-1, -1, 10]} />
          {/* <PerspectiveCamera
            makeDefault
            fov={1}
            zoom={0.0255}
            position={[0, 0, 100]}
          /> */}
          <OrthographicCamera
            makeDefault
            position={[0, 75, 100]}
            zoom={8}
            rotation={[-0.6, 0, 0]}
          />
          <PokemonMesh
            geo={CharmanderGeoJson as Bedrock.ModelGeoConfig}
            textureUrl={CharmanderTexture}
          />
        </View>
      </div>

      <div>
        <View id="sphere" style={{ width: 500, height: 500 }}>
          {/* <Common color="pink" /> */}
          <color attach="background" args={["pink"]} />{" "}
          <ambientLight intensity={1.3} color={0xffffffff} />
          <directionalLight position={[-1, -1, 10]} />
          <OrthographicCamera
            makeDefault
            position={[0, 75, 100]}
            zoom={8}
            rotation={[-0.6, 0, 0]}
          />
          <PokemonMesh
            geo={DebugGeoJson as Bedrock.ModelGeoConfig}
            textureUrl={DebugTexture}
          />
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
