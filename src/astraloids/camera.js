'use strict';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec4 = require('gl-matrix').vec4;

class Camera {
  constructor(position = vec2.create()) {
    this.position = position;

    this.calculateModelViewMatrix();
  }

  calculateModelViewMatrix() {
    this.translationVector = vec4.fromValues(this.position[0], this.position[1], 0.0, 1.0);
    this.modelViewMatrix = mat4.create();
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.translationVector);
  }
}

export default Camera;
