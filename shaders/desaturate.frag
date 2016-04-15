precision mediump float;

uniform sampler2D sampler;
uniform float intensity;

varying vec2 textureCoordinate;

void main() {
  vec4 color = texture2D(sampler, textureCoordinate);
  float luminance = dot(color.rgb, vec3(0.3, 0.59, 0.11));
  color.rgb = mix(color.rgb, vec3(luminance), intensity);

  gl_FragColor = color;
}
