import { useFrame, useThree } from "@react-three/fiber";
import { PivotGroupTransformation } from "lib/components/PivotGroup/PivotGroup";
import { Bedrock } from "lib/types/Bedrock";
import { MolangExpression } from "lib/utils/molang";
import { mapValues } from "lib/utils/object";
import { useRef } from "react";
import { degToRad } from "three/src/math/MathUtils";

interface Animator {
  update(animTime: number): void;
  calc(): [number, number, number];
}

function createAnimator(config?: Bedrock.Animation): Animator | null | void {
  if (config == null) return null;

  if (typeof config === "string") {
    const expr = new MolangExpression(config);
    return {
      update(animTime) {
        expr.updateAnimTime(animTime);
      },
      calc() {
        const scalar = expr.eval();
        if (typeof scalar !== "number")
          throw new Error("Expected number, found ->" + scalar);
        return [scalar, scalar, scalar];
      },
    };
  }

  if (Array.isArray(config)) {
    const exprX = new MolangExpression(config[0].toString());
    const exprY = new MolangExpression(config[1].toString());
    const exprZ = new MolangExpression(config[2].toString());
    return {
      update(animTime) {
        exprX.updateAnimTime(animTime);
        exprY.updateAnimTime(animTime);
        exprZ.updateAnimTime(animTime);
      },
      calc() {
        const x = exprX.eval();
        const y = exprY.eval();
        const z = exprZ.eval();
        if (typeof x !== "number")
          throw new Error("Expected number, found ->" + x);
        if (typeof y !== "number")
          throw new Error("Expected number, found ->" + x);
        if (typeof z !== "number")
          throw new Error("Expected number, found ->" + x);
        return [x, y, z];
      },
    };
  }

  // TODO: Impl timed keyframes & lerp modes
}

function loadAnimation(config: Bedrock.ActorAnimation) {
  return mapValues(config.bones ?? {}, (anim) => ({
    position: createAnimator(anim.position),
    rotation: createAnimator(anim.rotation),
    scale: createAnimator(anim.scale),
  }));
}

export function useAnimationPlayer(
  bones: Record<string, PivotGroupTransformation | null>,
  animations: Record<string, Bedrock.ActorAnimation>
) {
  const activeAnim = useRef<ReturnType<typeof loadAnimation>>();

  const { clock } = useThree();

  // TODO: Allow pause/play
  // TODO: Allow playing multiple animations
  // TODO: A way to reset to T-Pose

  useFrame(() => {
    if (activeAnim.current != null) {
      const now = clock.elapsedTime;

      Object.entries(activeAnim.current).forEach(([k, v]) => {
        const bone = bones[k];
        if (bone == null) return;

        v.position?.update(now);
        v.rotation?.update(now);
        v.scale?.update(now);

        const [xRot, yRot, zRot] = v.rotation?.calc() ?? [0, 0, 0];
        bone.position.set(...(v.position?.calc() ?? [0, 0, 0]));
        bone.rotation.set(-degToRad(xRot), degToRad(yRot), -degToRad(zRot));
        bone.scale.set(...(v.scale?.calc() ?? [1, 1, 1]));
      });
    }
  });

  return {
    playAnimation(animationName: string) {
      const animation = animations[animationName];

      if (animation == null) return;
      activeAnim.current = loadAnimation(animation);
    },
  };
}
