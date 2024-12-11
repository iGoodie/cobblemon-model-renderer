import { useFrame, useLoader } from "@react-three/fiber";
import { CuboidMesh } from "lib/components/CuboidMesh/CuboidMesh";
import { PivotGroup } from "lib/components/PivotGroup/PivotGroup";
import { Bedrock } from "lib/types/Bedrock";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils";
import BulbasaurTexture from "../../../assets/textures/bulbasaur_m.png";
import CharmanderTexture from "../../../assets/textures/charmander.png";

interface BoneTree extends Exclude<Bedrock.Bone, "parent"> {
  children: BoneTree[];
}

function buildBoneTree(bones: Bedrock.Bone[]) {
  const boneLookup: Record<string, BoneTree> = {};
  const tree: BoneTree = { name: "$root", children: [] };

  for (const bone of bones) {
    const boneNode: BoneTree = { ...bone, children: [] };
    boneLookup[bone.name] = boneNode;
  }

  for (const boneNode of Object.values(boneLookup)) {
    if (boneNode.parent != null) {
      boneLookup[boneNode.parent].children.push(boneNode);
    } else {
      tree.children.push(boneNode);
    }
    delete boneNode.parent;
  }

  return tree;
}

export function PokemonMesh(props: {
  geo: Bedrock.ModelGeo;
  texture?: THREE.Texture;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const bonesConfig = props.geo["minecraft:geometry"].at(0)?.bones ?? [];

  const boneTree = useMemo(() => buildBoneTree(bonesConfig), [bonesConfig]);

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
      ref.current.rotation.y = (-3 * Math.PI) / 4;
      // ref.current.rotation.x = (-3 * Math.PI) / 4;
      // ref.current.rotation.y += 0.006;
    }
  });

  console.log(boneTree);

  const renderBoneTree = (boneTree: BoneTree) => {
    return boneTree.children.map((boneNode) => {
      return (
        <group key={boneNode.name}>
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
          {boneNode.children.length != 0 && renderBoneTree(boneNode)}
        </group>
      );
    });
  };

  return (
    <mesh ref={ref} scale={1}>
      {renderBoneTree(boneTree)}
    </mesh>
  );
}
