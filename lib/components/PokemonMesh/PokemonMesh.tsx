import { Grid } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidMesh } from "lib/components/CuboidMesh/CuboidMesh";
import { Bedrock } from "lib/types/Bedrock";
import { useRef } from "react";
import * as THREE from "three";

export function PokemonMesh(props: { geo: Bedrock.ModelGeo }) {
  const ref = useRef<THREE.Group>(null);

  const bones = props.geo["minecraft:geometry"].at(0)?.bones;

  useFrame(() => {
    if (ref.current) {
      // ref.current.rotation.y = Math.PI;
      ref.current.rotation.y += 0.006;
      // ref.current.rotation.x = 0.3;
    }
  });

  return (
    <group ref={ref}>
      {bones
        ?.flatMap((bone) => (bone.cubes ?? []).map((c) => [bone, c] as const))
        .map(([bone, cube], i) => (
          <CuboidMesh key={i} bone={bone} cube={cube} />
        ))}
      <Grid cellSize={0.5} />
    </group>
  );
}
