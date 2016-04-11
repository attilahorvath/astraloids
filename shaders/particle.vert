uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float currentTime;
uniform float lifetime;
uniform float pointSize;

attribute vec3 vertexPosition;
attribute vec3 vertexVelocity;
attribute vec4 vertexColor;

varying vec4 color;

void main() {
  color = vertexColor;
  color.a = 1.0 - currentTime / lifetime;

  vec3 currentPosition = vec3(vertexPosition + vertexVelocity * currentTime);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(currentPosition, 1.0);
  gl_PointSize = pointSize;
}
