import { useFrame, useLoader } from "@react-three/fiber";
import { CuboidMesh } from "lib/components/CuboidMesh/CuboidMesh";
import { Bedrock } from "lib/types/Bedrock";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import BulbasaurTexture from "../../../assets/textures/bulbasaur_m.png";
import CharmanderTexture from "../../../assets/textures/charmander.png";

export function PokemonMesh(props: { geo: Bedrock.ModelGeo }) {
  const ref = useRef<THREE.Group>(null);

  const bones = props.geo["minecraft:geometry"].at(0)?.bones;

  const texture = useLoader(
    THREE.TextureLoader,
    props.geo["minecraft:geometry"].at(0)?.description.identifier ===
      "geometry.bulbasaur"
      ? BulbasaurTexture
      : CharmanderTexture
  );

  useEffect(() => {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
  }, [texture]);

  useFrame(() => {
    if (ref.current) {
      // ref.current.rotation.y = Math.PI;
      ref.current.rotation.y += 0.006;
    }
  });

  return (
    <group ref={ref}>
      {bones
        ?.flatMap((bone) => (bone.cubes ?? []).map((c) => [bone, c] as const))
        .map(([bone, cube], i) => (
          <CuboidMesh key={i} cube={cube} texture={texture} />
        ))}
    </group>
  );
}
