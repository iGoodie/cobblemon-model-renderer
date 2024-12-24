import { OrthographicCamera, View } from "@react-three/drei";
import { PokemonMesh } from "lib/components/PokemonMesh/PokemonMesh";
import {
  ComponentProps,
  FC,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

function DefaultEnvironment() {
  return (
    <>
      {/* <color attach="background" args={["pink"]} /> */}
      <ambientLight intensity={1.6} color={0xffffffff} />
      <directionalLight position={[10, 10, -5]} />
      <OrthographicCamera
        makeDefault
        position={[0, 0, 100]}
        zoom={10}
        rotation={[0, 0, 0]}
      />
    </>
  );
}

interface Props {
  viewportProps?: ComponentProps<typeof View>;
  pokemonProps: ComponentProps<typeof PokemonMesh>;
  environment?: FC;
}

export function PokemonPortrait(props: Props) {
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
      <View ref={ref} {...props.viewportProps}>
        {enteredScreen && (
          <>
            {props.environment ? <props.environment /> : <DefaultEnvironment />}
            <Suspense fallback="WIP: Loading..">
              <PokemonMesh {...props.pokemonProps} />
            </Suspense>
          </>
        )}
      </View>
    </div>
  );
}
