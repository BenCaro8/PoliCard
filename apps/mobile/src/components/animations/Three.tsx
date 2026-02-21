import { FC, useRef, memo } from 'react';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import {
  ShaderMaterial,
  OrthographicCamera,
  Vector2,
  Scene,
  PlaneGeometry,
  Mesh,
} from 'three';
import { useAssets } from 'expo-asset';
import { readAsStringAsync } from 'expo-file-system';

const Three: FC = () => {
  const material = useRef(new ShaderMaterial());
  const camera = useRef(new OrthographicCamera(0, 1, 1, 0, 0.1, 1000));
  const [assets, error] = useAssets([
    require('../../../assets/shaders/vertex-shader.glsl'),
    require('../../../assets/shaders/fragment-shader.glsl'),
  ]);
  const [vshAsset, fshAsset] = assets || [];
  const [vshAssetURI, fshAssetURI] = [vshAsset?.localUri, fshAsset?.localUri];

  if (error || !vshAssetURI || !fshAssetURI) {
    if (error) console.error('Error loading assets:', error);
    return;
  }

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const scene = new Scene();
    camera.current.position.set(0, 0, 1);

    let totalTime = 0.0;

    const [vsh, fsh] = await Promise.all([
      readAsStringAsync(vshAssetURI),
      readAsStringAsync(fshAssetURI),
    ]);

    material.current = new ShaderMaterial({
      uniforms: {
        resolution: {
          value: new Vector2(gl.drawingBufferWidth, gl.drawingBufferHeight),
        },
        time: { value: 0.0 },
      },
      vertexShader: vsh,
      fragmentShader: fsh,
    });

    const geometry = new PlaneGeometry(1, 1);
    const plane = new Mesh(geometry, material.current);
    plane.position.set(0.5, 0.5, 0);
    scene.add(plane);

    let previousTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - previousTime) * 0.001;
      previousTime = currentTime;

      totalTime += deltaTime;
      if (material.current?.uniforms?.time) {
        material.current.uniforms.time.value = totalTime;
      }

      renderer.render(scene, camera.current);
      gl.endFrameEXP();
      requestAnimationFrame(animate);
    };
    animate(0);
  };

  return (
    <GLView
      style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}
      onContextCreate={onContextCreate}
    />
  );
};

export default memo(Three);
