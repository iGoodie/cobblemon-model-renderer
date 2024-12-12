import { useFrame } from "@react-three/fiber";
import { PivotGroup } from "lib/components/PivotGroup/PivotGroup";
import { Bedrock } from "lib/types/Bedrock";
import { thru } from "lib/utils/thru";
import { useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils";

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

  // TODO: inheritability from bone
  const origin = props.cube.origin ?? [0, 0, 0];
  const size = props.cube.size ?? [1, 1, 1];
  const uv = props.cube.uv ?? [0, 0];

  const inflation = props.cube.inflate ?? 0;
  const rotation = props.cube.rotation ?? [0, 0, 0];

  // TODO: Manually build faces based on spec
  // - Will fix cube edge gaps
  // - Will fix size=0 faces rendering a few pixels
  // const geo = new THREE.BoxGeometry(1,1,1);
  // geo.

  useFrame(() => {
    if (!geometryRef.current) return;

    if (!Array.isArray(uv)) {
      return;
    }

    geometryRef.current.setAttribute("uv", generateUVAttrib(uv, size));
  });

  return (
    <PivotGroup
      pivot={props.cube.pivot ?? [0, 0, 0]}
      rotation={[
        degToRad(rotation[0]),
        degToRad(rotation[1]),
        degToRad(rotation[2]),
      ]}
    >
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
    </PivotGroup>
  );
}
