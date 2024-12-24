import { View } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { PokemonPortrait } from "cobblemon-model-renderer";
import { Bedrock } from "lib/types/Bedrock";
import React, { useEffect, useRef } from "react";

import BulbasaurGeoJson from "../assets/models/bulbasaur.geo.json";
import CharizardGeoJson from "../assets/models/charizard.geo.json";
import CharmanderGeoJson from "../assets/models/charmander.geo.json";
import SquirtleGeoJson from "../assets/models/squirtle.geo.json";

import BulbasaurAnimJson from "../assets/animations/bulbasaur.animation.json";
import CharizardAnimJson from "../assets/animations/charizard.animation.json";
import CharmanderAnimJson from "../assets/animations/charmander.animation.json";
import SquirtleAnimJson from "../assets/animations/squirtle.animation.json";

import BulbasaurTexture from "../assets/textures/bulbasaur_m.png";
import CharizardTexture from "../assets/textures/charizard.png";
import CharmanderTexture from "../assets/textures/charmander.png";
import SquirtleTexture from "../assets/textures/squirtle.png";

const App: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        boxSizing: "border-box",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        gap: 10,
        height: "100vh",
      }}
    >
      {Array.from({ length: 75 }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 10 }}>
          <PokemonPortrait
            pokemonProps={{
              geo: BulbasaurGeoJson as Bedrock.ModelGeoConfig,
              animations:
                BulbasaurAnimJson as unknown as Bedrock.ActorAnimationConfig,
              textureUrl: BulbasaurTexture,
              initialAnimation: "animation.bulbasaur.ground_idle",
            }}
            viewportProps={{
              style: { width: 350, height: "calc(100vh - 40px)" },
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <PokemonPortrait
              pokemonProps={{
                geo: CharmanderGeoJson as Bedrock.ModelGeoConfig,
                animations:
                  CharmanderAnimJson as unknown as Bedrock.ActorAnimationConfig,
                textureUrl: CharmanderTexture,
                initialAnimation: "animation.charmander.ground_idle",
              }}
              viewportProps={{
                style: { width: 500, height: "calc(35vh - 30px)" },
              }}
            />

            <PokemonPortrait
              pokemonProps={{
                geo: CharizardGeoJson as Bedrock.ModelGeoConfig,
                animations:
                  CharizardAnimJson as unknown as Bedrock.ActorAnimationConfig,
                textureUrl: CharizardTexture,
                initialAnimation: "animation.charizard.ground_idle",
              }}
              viewportProps={{
                style: { width: 500, height: "calc(65vh - 20px)" },
              }}
            />
          </div>

          <PokemonPortrait
            pokemonProps={{
              geo: SquirtleGeoJson as Bedrock.ModelGeoConfig,
              animations:
                SquirtleAnimJson as unknown as Bedrock.ActorAnimationConfig,
              textureUrl: SquirtleTexture,
              initialAnimation: "animation.squirtle.ground_idle",
            }}
            viewportProps={{
              style: { width: 350, height: "calc(100vh - 40px)" },
            }}
          />
        </div>
      ))}

      {/* <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <View id="sphere" style={{ width: 350, height: "50%" }}>
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
        </div> */}

      <Canvas
        performance={{
          current: 1,
          min: 0.1,
          max: 1,
          debounce: 200,
        }}
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
        <X />
      </Canvas>
    </div>
  );
};

function X() {
  const { gl } = useThree();

  useEffect(() => {
    setTimeout(() => {
      console.log(gl.info);
    }, 10);
  });

  return null;
}

export default App;
