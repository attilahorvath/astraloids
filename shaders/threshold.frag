precision mediump float;

uniform sampler2D sampler;
uniform float threshold;

varying vec2 textureCoordinate;

void main() {
  vec4 color = texture2D(sampler, textureCoordinate);
  float luminance = dot(color.rgb, vec3(0.3, 0.59, 0.11));
  luminance = max(0.0, luminance - threshold);
  color.rgb *= sign(luminance);

  gl_FragColor = color;
}
