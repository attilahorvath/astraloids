uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 vertexPosition;
attribute vec2 vertexTextureCoordinate;

varying vec2 textureCoordinate;

void main() {
  textureCoordinate = vertexTextureCoordinate;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
}
