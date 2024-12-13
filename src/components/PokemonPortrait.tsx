import { OrthographicCamera, View } from "@react-three/drei";
import { PokemonMesh } from "cobblemon-model-renderer";
import { ComponentProps, Suspense, useEffect, useRef, useState } from "react";

export function PokemonPortrait(
  props: ComponentProps<"div"> & {
    viewportProps?: ComponentProps<typeof View>;
    pokemonProps: ComponentProps<typeof PokemonMesh>;
  }
) {
  const ref = useRef<HTMLElement>(null);

  const [enteredScreen, setEnteredScreen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setEnteredScreen(true);
          observer.disconnect();
        }
      });
    });

    observer.observe(ref.current!);
  }, []);

  return (
    <div>
      {/* <p>Enter cnt = {enterCount}</p> */}
      <View ref={ref} {...props.viewportProps}>
        {enteredScreen && (
          <>
            {/* <color attach="background" args={["pink"]} />{" "} */}
            <ambientLight intensity={1.6} color={0xffffffff} />
            <directionalLight position={[10, 10, -5]} />
            <OrthographicCamera
              makeDefault
              position={[-2, 66, 100]}
              zoom={10}
              rotation={[-0.5, 0, 0]}
            />
            <Suspense fallback="WIP: Loading..">
              <PokemonMesh {...props.pokemonProps} />
            </Suspense>
          </>
        )}
      </View>
    </div>
  );
}
