precision mediump float;

const float pi = 3.14159265;

uniform sampler2D sampler;
uniform vec2 textureSize;
uniform vec2 direction;
uniform float intensity;

varying vec2 textureCoordinate;

void main() {
  // TODO Fix this

  // float sigma = intensity;
  //
  // vec3 incrementalGaussian;
  // incrementalGaussian.x = 1.0 / (sqrt(2.0 * pi) * sigma);
  // incrementalGaussian.y = exp(-0.5 / (sigma * sigma));
  // incrementalGaussian.z = incrementalGaussian.y * incrementalGaussian.y;
  //
  vec2 textureStep = (1.0 / textureSize) * direction;
  vec4 color = vec4(0.0);
  // float coefficientSum = 0.0;
  //
  // color += texture2D(sampler, textureCoordinate) * incrementalGaussian.x;
  //
  // coefficientSum += incrementalGaussian.x;
  // incrementalGaussian.xy *= incrementalGaussian.yz;
  //
  // for (float i = 1.0; i <= 4.0; i++) {
  //   color += texture2D(sampler, textureCoordinate - i * textureStep) * incrementalGaussian.x;
  //   color += texture2D(sampler, textureCoordinate + i * textureStep) * incrementalGaussian.x;
  //   coefficientSum += 2.0 * incrementalGaussian.x;
  //   incrementalGaussian.xy *= incrementalGaussian.yz;
  // }
  //
  // gl_FragColor = color / coefficientSum;

  color += texture2D(sampler, textureCoordinate - 4.0 * intensity * textureStep) * 0.0162162162;
  color += texture2D(sampler, textureCoordinate - 3.0 * intensity * textureStep) * 0.0540540541;
  color += texture2D(sampler, textureCoordinate - 2.0 * intensity * textureStep) * 0.1216216216;
  color += texture2D(sampler, textureCoordinate - 1.0 * intensity * textureStep) * 0.1945945946;
  color += texture2D(sampler, textureCoordinate + 0.0 * intensity * textureStep) * 0.2270270270;
  color += texture2D(sampler, textureCoordinate + 1.0 * intensity * textureStep) * 0.1945945946;
  color += texture2D(sampler, textureCoordinate + 2.0 * intensity * textureStep) * 0.1216216216;
  color += texture2D(sampler, textureCoordinate + 3.0 * intensity * textureStep) * 0.0540540541;
  color += texture2D(sampler, textureCoordinate + 4.0 * intensity * textureStep) * 0.0162162162;

  gl_FragColor = color;
}
