import { useFrame, useLoader } from "@react-three/fiber";
import { CuboidMesh } from "lib/components/CuboidMesh/CuboidMesh";
import { Bedrock } from "lib/types/Bedrock";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import BulbasaurTexture from "../../../assets/textures/bulbasaur_m.png";
import CharmanderTexture from "../../../assets/textures/charmander.png";

export function PokemonMesh(props: {
  geo: Bedrock.ModelGeo;
  texture?: THREE.Texture;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const bones = props.geo["minecraft:geometry"].at(0)?.bones;

  const defaultTexture = useLoader(
    THREE.TextureLoader,
    props.geo["minecraft:geometry"].at(0)?.description.identifier ===
      "geometry.bulbasaur"
      ? BulbasaurTexture
      : CharmanderTexture
  );

  const texture = props.texture ?? defaultTexture;

  useEffect(() => {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
  }, [texture]);

  useFrame(() => {
    if (ref.current) {
      // ref.current.rotation.y = Math.PI / 4;
      // ref.current.rotation.x = (-3 * Math.PI) / 4;
      ref.current.rotation.y += 0.006;
    }
  });

  return (
    <mesh ref={ref} scale={[1, 1, 1]}>
      {bones
        ?.flatMap((bone) => (bone.cubes ?? []).map((c) => [bone, c] as const))
        .map(([bone, cube], i) => (
          <CuboidMesh key={i} cube={cube} texture={texture} />
        ))}
    </mesh>
  );
}
