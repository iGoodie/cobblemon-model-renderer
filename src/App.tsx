import { OrthographicCamera, PerspectiveCamera, View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PokemonMesh } from "lib/main";
import { Bedrock } from "lib/types/Bedrock";
import React, { useRef } from "react";
import { degToRad } from "three/src/math/MathUtils";

import BulbasaurGeoJson from "../assets/models/bulbasaur.geo.json";
import CharmanderGeoJson from "../assets/models/charmander.geo.json";
import DebugGeoJson from "../assets/models/debug.geo.json";

import BulbasaurAnimJson from "../assets/animations/bulbasaur.animation.json";
import CharmanderAnimJson from "../assets/animations/charmander.animation.json";

import BulbasaurTexture from "../assets/textures/bulbasaur_m.png";
import CharmanderTexture from "../assets/textures/charmander.png";
import DebugTexture from "../assets/textures/debug.png";

const App: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        boxSizing: "border-box",
        padding: 20,
        display: "flex",
        justifyContent: "space-around",
        gap: 10,
        height: "100vh",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <View id="sphere" style={{ width: 350, height: "50%" }}>
          {/* <Common color="pink" /> */}
          <color attach="background" args={["pink"]} />{" "}
          <ambientLight intensity={1.3} color={0xffffffff} />
          <directionalLight position={[-1, -1, 10]} />
          <PerspectiveCamera
            makeDefault
            fov={90}
            zoom={4}
            position={[0, 20, 70]}
            rotation={[degToRad(-15), 0, 0]}
          />
          <PokemonMesh
            geo={DebugGeoJson as Bedrock.ModelGeoConfig}
            textureUrl={DebugTexture}
          />
        </View>
        <View id="sphere" style={{ width: 350, height: "50%" }}>
          {/* <Common color="pink" /> */}
          <color attach="background" args={["pink"]} />{" "}
          <ambientLight intensity={1.3} color={0xffffffff} />
          <directionalLight position={[-1, -1, 10]} />
          <OrthographicCamera
            makeDefault
            position={[0, 70, 100]}
            zoom={16}
            rotation={[-0.6, 0, 0]}
          />
          <PokemonMesh
            geo={DebugGeoJson as Bedrock.ModelGeoConfig}
            textureUrl={DebugTexture}
          />
        </View>
      </div>

      <div>
        <View id="pokemon1" style={{ width: 450, height: "100%" }}>
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
            zoom={12}
            rotation={[-0.6, 0, 0]}
          />
          <PokemonMesh
            geo={BulbasaurGeoJson as Bedrock.ModelGeoConfig}
            animations={
              BulbasaurAnimJson as unknown as Bedrock.ActorAnimationConfig
            }
            textureUrl={BulbasaurTexture}
          />
        </View>
      </div>

      <div>
        <View id="pokemon2" style={{ width: 450, height: "100%" }}>
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
            position={[-2, 80, 100]}
            zoom={12}
            rotation={[-0.6, 0, 0]}
          />
          <PokemonMesh
            geo={CharmanderGeoJson as Bedrock.ModelGeoConfig}
            animations={
              CharmanderAnimJson as unknown as Bedrock.ActorAnimationConfig
            }
            textureUrl={CharmanderTexture}
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
