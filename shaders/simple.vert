uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 vertexPosition;
attribute vec4 vertexColor;

varying vec4 color;

void main() {
  color = vertexColor;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
}
