import { useFrame } from "@react-three/fiber";
import { Bedrock } from "lib/types/Bedrock";
import { thru } from "lib/utils/thru";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const DEGREE_TO_RADIANS = Math.PI / 180;

function calcTexel(u: number, v: number, w: number, h: number) {
  const left = u / 64;
  const right = left + w / 64;
  const bottom = 1 - v / 64;
  const top = bottom - h / 64;
  return [left, right, bottom, top];
}

function generateUVAttrib(
  uv: [number, number],
  [sx, sy, sz]: [number, number, number]
) {
  return new THREE.BufferAttribute(
    new Float32Array([
      ...thru(
        // 0 - East = +X = Right
        calcTexel(uv[0] + sz + sx, uv[1] + sz, sz, sy),
        // prettier-ignore
        ([left, right, bottom, top]) => [
          right, bottom,
          left, bottom,
          right, top,
          left,top,
        ]
      ),

      ...thru(
        // 1 - West = -X = Left
        calcTexel(uv[0], uv[1] + sz, sz, sy),
        // prettier-ignore
        ([left, right, bottom, top]) => [
          right, bottom,
          left, bottom,
          right, top,
          left,top,
        ]
      ),

      ...thru(
        // 2 - Up = +Y = Up
        calcTexel(uv[0] + sz, uv[1], sx, sz),
        // prettier-ignore
        ([left, right, bottom, top]) => [
          left,top,
          right, top,
          left, bottom,
          right, bottom,
        ]
      ),

      ...thru(
        // 3 - Down = -Y = Down
        calcTexel(uv[0] + sx + sz, uv[1], sx, sy),
        // prettier-ignore
        ([left, right, bottom, top]) => [
          left, bottom,
          right, bottom,
          left,top,
          right, top,
        ]
      ),

      ...thru(
        // 4 - North = -Z = Back
        calcTexel(uv[0] + sx + 2 * sz, uv[1] + sz, sx, sy),
        // prettier-ignore
        ([left, right, bottom, top]) => [
          left, bottom,
          right, bottom,
          left,top,
          right, top,
        ]
      ),

      ...thru(
        // 5 - South = +Z = Front
        calcTexel(uv[0] + sz, uv[1] + sz, sx, sy),
        // prettier-ignore
        ([left, right, bottom, top]) => [
          right, bottom,
          left, bottom,
          right, top,
          left,top,
        ]
      ),
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

  const inflation = props.cube.inflate ?? 0;

  // TODO: Manually build faces based on spec
  // const geo = new THREE.BoxGeometry(1,1,1);
  // geo.

  useFrame(() => {
    if (!geometryRef.current) return;

    if (!Array.isArray(uv)) {
      return;
    }

    geometryRef.current.setAttribute("uv", generateUVAttrib(uv, size));
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
        origin[0] - inflation + (size[0] + inflation * 2) / 2,
        origin[1] - inflation + (size[1] + inflation * 2) / 2,
        origin[2] - inflation + (size[2] + inflation * 2) / 2,
      ]}
    >
      <boxGeometry
        ref={geometryRef}
        args={[
          size[0] + inflation * 2,
          size[1] + inflation * 2,
          size[2] + inflation * 2,
        ]}
      />
      <meshStandardMaterial
        map={props.texture}
        transparent
        alphaTest={0.00000001}
      />
    </mesh>
  );
}
