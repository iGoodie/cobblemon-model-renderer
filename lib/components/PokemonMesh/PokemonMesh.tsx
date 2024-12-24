import { useTexture } from "@react-three/drei";
import { useAnimationPlayer } from "lib/hooks/useAnimationPlayer";
import { useBoneMesh } from "lib/hooks/useBoneMesh";
import { Bedrock } from "lib/types/Bedrock";
import { forwardRef, useEffect } from "react";
import * as THREE from "three";

interface Props {
  geo: Bedrock.ModelGeoConfig;
  animations?: Bedrock.ActorAnimationConfig;
  initialAnimation?: string;
  textureUrl: string;
}

export const PokemonMesh = forwardRef<THREE.Mesh, Props>((props, ref) => {
  const bonesConfig = props.geo["minecraft:geometry"].at(0)?.bones ?? [];

  const texture = useTexture(props.textureUrl, (texture) => {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
  });

  const { boneRefs, meshJsx } = useBoneMesh(bonesConfig, texture);

  const { playAnimation } = useAnimationPlayer(
    boneRefs.current,
    props.animations?.animations || {}
  );

  useEffect(() => {
    // TODO: Better abstraction over external animation controls
    if (props.initialAnimation) {
      playAnimation(props.initialAnimation);
    }
  }, []);

  return (
    <mesh ref={ref} rotation-y={Math.PI}>
      {meshJsx}
    </mesh>
  );
});
