precision mediump float;

const float pi = 3.14159265;

uniform sampler2D sampler;
uniform vec2 textureSize;
uniform vec2 direction;
uniform float radius;

varying vec2 textureCoordinate;

void main() {
  vec2 textureStep = (1.0 / textureSize) * direction * radius;
  vec4 color = vec4(0.0);

  color += texture2D(sampler, textureCoordinate - 4.0 * textureStep) * 0.0162162162;
  color += texture2D(sampler, textureCoordinate - 3.0 * textureStep) * 0.0540540541;
  color += texture2D(sampler, textureCoordinate - 2.0 * textureStep) * 0.1216216216;
  color += texture2D(sampler, textureCoordinate - 1.0 * textureStep) * 0.1945945946;
  color += texture2D(sampler, textureCoordinate + 0.0 * textureStep) * 0.2270270270;
  color += texture2D(sampler, textureCoordinate + 1.0 * textureStep) * 0.1945945946;
  color += texture2D(sampler, textureCoordinate + 2.0 * textureStep) * 0.1216216216;
  color += texture2D(sampler, textureCoordinate + 3.0 * textureStep) * 0.0540540541;
  color += texture2D(sampler, textureCoordinate + 4.0 * textureStep) * 0.0162162162;

  gl_FragColor = color;
}
