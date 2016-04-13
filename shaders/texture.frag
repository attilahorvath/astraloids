precision mediump float;

uniform sampler2D sampler;

varying vec2 textureCoordinate;

void main() {
  vec4 color = texture2D(sampler, vec2(textureCoordinate.s, textureCoordinate.t));
  color += texture2D(sampler, vec2(textureCoordinate.s + 0.002, textureCoordinate.t));
  color += texture2D(sampler, vec2(textureCoordinate.s - 0.002, textureCoordinate.t));
  color += texture2D(sampler, vec2(textureCoordinate.s, textureCoordinate.t + 0.002));
  color += texture2D(sampler, vec2(textureCoordinate.s, textureCoordinate.t - 0.002));
  color /= 5.0;
  gl_FragColor = color;
}
