'use strict';

const mat4 = require('gl-matrix').mat4;
const vec4 = require('gl-matrix').vec4;

class Camera {
  constructor(game) {
    this.setPosition(0, 0);
  }

  setPosition(x, y) {
    this.translationVector = vec4.fromValues(x, y, 0.0, 1.0);
    this.modelViewMatrix = mat4.create();
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.translationVector);
  }
}

export default Camera;
