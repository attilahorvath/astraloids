'use strict';

const mat4 = require('gl-matrix').mat4;
const vec4 = require('gl-matrix').vec4;

class Camera {
  constructor() {
    this.translationVector = vec4.fromValues(160.0, 120.0, 0.0, 1.0);

    this.modelViewMatrix = mat4.create();
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.translationVector);
  }
}

export default Camera;
