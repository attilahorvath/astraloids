'use strict';

const mat4 = require('gl-matrix').mat4;
const vec4 = require('gl-matrix').vec4;

class Entity {
  constructor(game = null, x = 0.0, y = 0.0, angle = 0.0) {
    this.x = x;
    this.y = y;
    this.angle = angle;

    this.calculateTransformationMatrix();

    this.children = [];
  }

  updateAll(game, deltaTime, transformationMatrix = mat4.create()) {
    transformationMatrix = mat4.clone(transformationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, this.transformationMatrix);

    for (let child of this.children) {
      child.updateAll(game, deltaTime, transformationMatrix);
    }

    this.update(game, deltaTime, transformationMatrix);
  }

  update(game, deltaTime, transformationMatrix = mat4.create()) {}

  drawAll(renderer, deltaTime, transformationMatrix = mat4.create()) {
    transformationMatrix = mat4.clone(transformationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, this.transformationMatrix);

    for (let child of this.children) {
      child.drawAll(renderer, deltaTime, transformationMatrix);
    }

    this.draw(renderer, deltaTime, transformationMatrix);
  }

  draw(renderer, deltaTime, transformationMatrix = mat4.create()) {}

  calculateTransformationMatrix() {
    let translationVector = vec4.fromValues(this.x, this.y, 0.0, 1.0);

    this.transformationMatrix = mat4.create();
    mat4.translate(this.transformationMatrix, this.transformationMatrix, translationVector);
    mat4.rotateZ(this.transformationMatrix, this.transformationMatrix, this.angle);
  }
}

export default Entity;
