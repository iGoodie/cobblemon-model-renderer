import { ComponentProps } from "react";

interface Props extends ComponentProps<"group"> {
  pivot: [number, number, number];
}

export function PivotGroup(props: Props) {
  const { pivot, rotation, ...groupProps } = props;

  return (
    <group position={pivot} rotation={rotation}>
      <group position={pivot.map((v) => -v) as [number, number, number]}>
        <group {...groupProps} />
      </group>
    </group>
  );
}
