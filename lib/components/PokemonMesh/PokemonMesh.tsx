import { useFrame, useLoader } from "@react-three/fiber";
import { CuboidMesh } from "lib/components/CuboidMesh/CuboidMesh";
import { PivotGroup } from "lib/components/PivotGroup/PivotGroup";
import { Bedrock } from "lib/types/Bedrock";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils";
import { buildBoneTree } from "lib/utils/mesh";

function useBoneMesh(bones: Bedrock.GeoBone[], texture?: THREE.Texture) {
  const boneRefs = useRef<Record<string, THREE.Group | null>>({});

  const boneTree = useMemo(
    () =>
      buildBoneTree(
        bones,
        (bone) => bone.name,
        (bone) => bone.parent
      ),
    [bones]
  );

  const renderBoneTree = (tree: (typeof boneTree)[number]) => {
    return tree.children.map((boneNode) => {
      return (
        <group key={boneNode.name}>
          <group
            ref={(groupRef) => (boneRefs.current[boneNode.name] = groupRef)}
          >
            <PivotGroup
              pivot={boneNode.pivot ?? [0, 0, 0]}
              rotation={[
                -degToRad(boneNode.rotation?.[0] ?? 0),
                -degToRad(boneNode.rotation?.[1] ?? 0),
                -degToRad(boneNode.rotation?.[2] ?? 0),
              ]}
            >
              {boneNode.cubes?.map((cube, i) => (
                <CuboidMesh key={i} cube={cube} texture={texture} />
              ))}
            </PivotGroup>
          </group>
          {boneNode.children.length != 0 && renderBoneTree(boneNode)}
        </group>
      );
    });
  };

  return {
    boneRefs,
    meshJsx: renderBoneTree({ name: "$root", children: boneTree }),
  };
}

export function PokemonMesh(props: {
  geo: Bedrock.ModelGeoConfig;
  textureUrl: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const bonesConfig = props.geo["minecraft:geometry"].at(0)?.bones ?? [];

  const texture = useLoader(THREE.TextureLoader, props.textureUrl);

  const { boneRefs, meshJsx } = useBoneMesh(bonesConfig, texture);

  useEffect(() => {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
  }, [texture]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = (-3 * Math.PI) / 4;
      // ref.current.rotation.x = (-3 * Math.PI) / 4;
      // ref.current.rotation.y += 0.006;

      const bone = boneRefs.current["jaw"];
      if (bone) {
        // bone.scale.setY(Math.sin(Date.now()) / 2 + 1);
      }
    }
  });

  return <mesh ref={ref}>{meshJsx}</mesh>;
}
