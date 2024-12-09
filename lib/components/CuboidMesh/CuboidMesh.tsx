import { Bedrock } from "lib/types/Bedrock";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const DEGREE_TO_RADIANS = Math.PI / 180;

export function CuboidMesh(props: { bone?: Bedrock.Bone; cube: Bedrock.Cube }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BoxGeometry>(null);

  const origin = props.cube.origin ?? [0, 0, 0];
  const size = props.cube.size ?? [1, 1, 1];

  useEffect(() => {
    if (!meshRef.current) return;

    const rotation = props.cube.rotation ?? [0, 0, 0];

    const pivot = props.cube.pivot ?? [
      (size[0] - origin[0]) / 2,
      (size[1] - origin[1]) / 2,
      (size[2] - origin[2]) / 2,
    ];

    const translation = [
      pivot[0] - origin[0] - size[0] / 2,
      pivot[1] - origin[1] - size[1] / 2,
      pivot[2] - origin[2] - size[2] / 2,
    ] as const;
    meshRef.current.translateX(translation[0]);
    meshRef.current.translateY(translation[1]);
    meshRef.current.translateZ(translation[2]);
    meshRef.current.setRotationFromEuler(
      new THREE.Euler(
        rotation[0] * DEGREE_TO_RADIANS,
        rotation[1] * DEGREE_TO_RADIANS,
        rotation[2] * DEGREE_TO_RADIANS,
        "XYZ"
      )
    );
    meshRef.current.translateX(-translation[0]);
    meshRef.current.translateY(-translation[1]);
    meshRef.current.translateZ(-translation[2]);
  }, []);

  return (
    <mesh
      key={Math.random()}
      ref={meshRef}
      position={[
        origin[0] + size[0] / 2,
        origin[1] + size[1] / 2,
        origin[2] + size[2] / 2,
      ]}
    >
      <boxGeometry ref={geometryRef} args={size} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}
