import { useFrame } from "@react-three/fiber";
import { Bedrock } from "lib/types/Bedrock";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const DEGREE_TO_RADIANS = Math.PI / 180;

// function old_prepFaceUV(uv: [number, number], size: [number, number, number]) {
//   const left = uv[0] / 16;
//   const right = 16 / 16;
//   const bottom = 1 - uv[1] / 16;
//   const top = 1 - 16 / 16;

//   // prettier-ignore
//   return [
//     left, bottom,
//     right, bottom,
//     left, top,
//     right, top
//   ];
// }

function prepFaceUV(u: number, v: number, w: number, h: number) {
  const left = u / 64;
  const right = left + w / 64;
  const bottom = 1 - v / 64;
  const top = 1 - h / 64;

  // prettier-ignore
  return [
    left, bottom, 
    right, bottom, 
    left, top, 
    right, top
  ];
}

function generateUVProperty(
  uv: [number, number],
  [sx, sy, sz]: [number, number, number]
) {
  return new THREE.BufferAttribute(
    new Float32Array([
      ...prepFaceUV(uv[0], uv[1], 64, 64), // 0 - East
      ...prepFaceUV(uv[0], uv[1], 64, 64), // 1 - West
      ...prepFaceUV(uv[0] + sz, uv[1], sz, sx), // 2 - Up
      ...prepFaceUV(uv[0], uv[1], 64, 64), // 3 - Down
      ...prepFaceUV(uv[0], uv[1], 64, 64), // 4 - South
      ...prepFaceUV(uv[0], uv[1], 64, 64), // 5 - North
    ]),
    2
  );
}

export function CuboidMesh(props: {
  cube: Bedrock.Cube;
  texture?: THREE.Texture;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BoxGeometry>(null);

  const origin = props.cube.origin ?? [0, 0, 0];
  const size = props.cube.size ?? [1, 1, 1];
  const uv = props.cube.uv ?? [0, 0];

  // North = -Z = Back
  // South = +Z = Front
  // Down = -Y = Down
  // Up = +Y = Up
  // East = +X = Right
  // West = -X = Left

  // TODO: Manually build faces based on spec
  // const geo = new THREE.BoxGeometry(1,1,1);
  // geo.

  useFrame(() => {
    if (!geometryRef.current) return;

    if (!Array.isArray(uv)) {
      return;
    }

    geometryRef.current.setAttribute("uv", generateUVProperty(uv, size));
  });

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
      // key={Math.random()}
      ref={meshRef}
      position={[
        origin[0] + size[0] / 2,
        origin[1] + size[1] / 2,
        origin[2] + size[2] / 2,
      ]}
    >
      <boxGeometry ref={geometryRef} args={size} />
      <meshStandardMaterial color="white" map={props.texture} />
    </mesh>
  );
}
