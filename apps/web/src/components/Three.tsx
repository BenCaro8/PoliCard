import { FC, useState, useRef, useEffect, useCallback } from 'react';
// import { useAppSelector } from '../store';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  WebGLRenderer,
  ShaderMaterial,
  OrthographicCamera,
  Vector2,
  Scene,
  PlaneGeometry,
  Mesh,
} from 'three';

const Three: FC = () => {
  const renderer = useRef(new WebGLRenderer());
  const material = useRef(new ShaderMaterial());
  const camera = useRef(new OrthographicCamera(0, 1, 1, 0, 0.1, 1000));
  const canvasContainer = useRef<HTMLDivElement | null>(null);
  // const colors = useAppSelector((state) => state.settings.colors);
  const [divContainer, setDivContainer] = useState<HTMLDivElement | null>(null);
  const div = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setDivContainer(node);
    }
  }, []);

  useEffect(() => {
    const setRendererSize = () => {
      if (divContainer) {
        const [width, height] = [
          divContainer.getBoundingClientRect().width,
          divContainer.getBoundingClientRect().height,
        ];
        renderer.current.setSize(width, height);
        // camera.current.aspect = width / height;
        // camera.current.updateProjectionMatrix();
        material.current.uniforms.resolution.value = new Vector2(width, height);
      }
    };
    window.addEventListener('resize', setRendererSize, false);
    return () => {
      window.removeEventListener('resize', setRendererSize);
    };
  }, [divContainer]);

  useEffect(() => {
    const scene = new Scene();

    const [width, height] = [
      divContainer?.getBoundingClientRect()?.width || 250,
      divContainer?.getBoundingClientRect()?.height || 250,
    ];
    renderer.current.setSize(width, height);
    camera.current.position.set(0, 0, 1);
    // camera.current.aspect = width / height;
    // camera.current.updateProjectionMatrix();
    // camera.current.position.set(1, 0, 3);
    // use ref as a mount point of the Three.js scene instead of the document.body
    canvasContainer.current?.appendChild(renderer.current.domElement);

    let totalTime = 0.0;

    const shaderSetup = async () => {
      const vsh = await fetch('/public/shaders/vertex-shader.glsl');
      const fsh = await fetch('/public/shaders/fragment-shader.glsl');

      material.current = new ShaderMaterial({
        uniforms: {
          resolution: {
            value: new Vector2(
              divContainer?.getBoundingClientRect()?.width || 250,
              divContainer?.getBoundingClientRect()?.height || 250,
            ),
          },
          time: {
            value: 0.0,
          },
        },
        vertexShader: await vsh.text(),
        fragmentShader: await fsh.text(),
      });

      const geometry = new PlaneGeometry(1, 1);
      const plane = new Mesh(geometry, material.current);
      plane.position.set(0.5, 0.5, 0);
      scene.add(plane);
    };

    shaderSetup().catch(console.error);

    const step = (timeElapsed: number) => {
      const timeElapsedS = timeElapsed * 0.001;
      totalTime += timeElapsedS;
      if (material?.current?.uniforms?.time) {
        material.current.uniforms.time.value = totalTime;
      }
    };

    let previousRAF: number | null = null;
    const animate = (t: number) => {
      if (previousRAF === null) {
        previousRAF = t;
      }
      step(t - previousRAF);
      requestAnimationFrame((t) => animate(t));
      renderer.current.render(scene, camera.current);
      previousRAF = t;
    };
    animate(0.0);

    return () => {
      if (canvasContainer.current) {
        canvasContainer.current.removeChild(renderer.current.domElement);
      }
    };
  }, [divContainer]);

  return (
    <div className="grow shrink" ref={div}>
      <div className="absolute" ref={canvasContainer} />
    </div>
  );
};

export default Three;
