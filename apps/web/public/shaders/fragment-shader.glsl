
varying vec2 vUvs;

uniform vec2 resolution;
uniform float time;

vec3 YELLOW = vec3(1.0, 1.0, 0.5);
vec3 BLUE = vec3(0.25, 0.25, 1.0);
vec3 RED = vec3(1.0, 0.25, 0.25);
vec3 GREEN = vec3(0.25, 1.0, 0.25);
vec3 PURPLE = vec3(1.0, 0.25, 1.0);

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

vec3 BackgroundColor() {
  float distFromCenter = length(abs(vUvs - 0.5));
  float vignette = 1.0 - distFromCenter;
  vignette = smoothstep(0.0, 0.7, vignette);
  vignette = remap(vignette, 0.0, 1.0, 0.7, 1.0);

  return vec3(vignette);
}

vec3 drawGrid(vec3 color, vec3 lineColor, float cellSpacing, float lineWidth) {
  vec2 center = vUvs - 0.5;
  vec2 cells = abs(fract(center * resolution / cellSpacing) - 0.5);
  float distToCell = (0.5 - max(cells.x, cells.y)) * cellSpacing;
  float lines = smoothstep(0.0, lineWidth, distToCell);

  color = mix(lineColor, color, lines);

  return color;
}

void main() {
  vec3 color = BackgroundColor();

  color *= drawGrid(color, vec3(0.5), 10.0, 1.0);
  color *= drawGrid(color, vec3(0.0), 100.0, 2.0);

  gl_FragColor = vec4(color, 1.0);
}