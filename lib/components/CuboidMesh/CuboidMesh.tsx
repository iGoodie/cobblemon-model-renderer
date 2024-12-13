import { PivotGroup } from "lib/components/PivotGroup/PivotGroup";
import { Bedrock } from "lib/types/Bedrock";
import { thru } from "lib/utils/thru";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils";

function calcTexel(
  u: number,
  v: number,
  w: number,
  h: number,
  tw: number = 64,
  th: number = 64
) {
  const left = u / tw;
  const right = left + w / tw;
  const bottom = 1 - v / th;
  const top = bottom - h / th;
  return [left, right, bottom, top];
}

function generateUVAttrib(
  [u, v]: [number, number],
  [sx, sy, sz]: [number, number, number],
  [tw, th]: [number, number]
) {
  return new THREE.BufferAttribute(
    new Float32Array([
      ...thru(
        // 0 - East = +X = Right
        calcTexel(u + sz + sx, v + sz, sz, sy, tw, th),
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
        calcTexel(u, v + sz, sz, sy, tw, th),
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
        calcTexel(u + sz, v, sx, sz, tw, th),
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
        calcTexel(u + sx + sz, v, sx, sy, tw, th),
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
        calcTexel(u + sx + 2 * sz, v + sz, sx, sy, tw, th),
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
        calcTexel(u + sz, v + sz, sx, sy, tw, th),
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
  const mirror = props.cube.mirror ?? false;

  const inflation = props.cube.inflate ?? 0;
  const rotation = props.cube.rotation ?? [0, 0, 0];

  // TODO: Manually build faces based on spec
  // - Will fix cube edge gaps
  // - Will fix size=0 faces rendering a few pixels
  // const geo = new THREE.BoxGeometry(1,1,1);
  // geo.

  useEffect(() => {
    if (!geometryRef.current) return;

    if (!Array.isArray(uv)) {
      // TODO: Per-face attrib
      return;
    }

    geometryRef.current.setAttribute(
      "uv",
      generateUVAttrib(uv, size, [
        props.texture?.image.width,
        props.texture?.image.height,
      ])
    );
  }, []);

  return (
    <PivotGroup
      pivot={props.cube.pivot ?? [0, 0, 0]}
      rotation={[
        -degToRad(rotation[0]),
        degToRad(rotation[1]),
        -degToRad(rotation[2]),
      ]}
    >
      <mesh
        ref={meshRef}
        scale={[mirror ? -1 : 1, 1, 1]}
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
