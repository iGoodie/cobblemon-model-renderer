import { Bedrock, CuboidMesh } from "cobblemon-model-renderer";
import {
  PivotGroup,
  PivotGroupTransformation,
} from "lib/components/PivotGroup/PivotGroup";
import { buildBoneTree } from "lib/utils/mesh";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils";

export function useBoneMesh(bones: Bedrock.GeoBone[], texture?: THREE.Texture) {
  const boneRefs = useRef<Record<string, PivotGroupTransformation | null>>({});

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
        <PivotGroup
          ref={(groupRef) => (boneRefs.current[boneNode.name] = groupRef)}
          name={boneNode.name}
          key={boneNode.name}
          pivot={boneNode.pivot ?? [0, 0, 0]}
        >
          <PivotGroup
            pivot={boneNode.pivot ?? [0, 0, 0]}
            rotation={[
              -degToRad(boneNode.rotation?.[0] ?? 0),
              degToRad(boneNode.rotation?.[1] ?? 0),
              -degToRad(boneNode.rotation?.[2] ?? 0),
            ]}
          >
            {boneNode.children.length != 0 && renderBoneTree(boneNode)}
            {boneNode.cubes?.map((cube, i) => (
              <CuboidMesh key={i} cube={cube} texture={texture} />
            ))}
          </PivotGroup>
        </PivotGroup>
      );
    });
  };

  return {
    boneRefs,
    meshJsx: renderBoneTree({ name: "$root", children: boneTree }),
  };
}
