
varying vec2 vUvs;

uniform float time;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUvs = uv;
}