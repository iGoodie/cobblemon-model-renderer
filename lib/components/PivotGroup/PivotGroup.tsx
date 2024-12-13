import { ComponentProps, forwardRef, useEffect, useRef } from "react";
import { Euler, Group, Vector3 } from "three";

interface Props extends ComponentProps<"group"> {
  pivot: [number, number, number];
}

export interface PivotGroupTransformation {
  position: Vector3;
  pivot: Vector3;
  rotation: Euler;
  scale: Vector3;
}

export const PivotGroup = forwardRef<PivotGroupTransformation, Props>(
  (props, ref) => {
    const { pivot, rotation, children, ...groupProps } = props;

    const rootRef = useRef<Group>(null);
    const pivotRef = useRef<Group>(null);

    useEffect(() => {
      const val: PivotGroupTransformation = {
        position: rootRef.current!.position,
        pivot: pivotRef.current!.position,
        rotation: pivotRef.current!.rotation,
        scale: rootRef.current!.scale,
      };
      if (typeof ref === "function") ref(val);
      else if (ref != null) ref.current = val;
    }, []);

    return (
      <group ref={rootRef} {...groupProps}>
        <group ref={pivotRef} position={pivot} rotation={rotation}>
          <group position={pivot.map((v) => -v) as [number, number, number]}>
            {children}
          </group>
        </group>
      </group>
    );
  }
);
