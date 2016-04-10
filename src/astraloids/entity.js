'use strict';

const mat4 = require('gl-matrix').mat4;
const vec4 = require('gl-matrix').vec4;

class Entity {
  constructor(game = null, x = 0.0, y = 0.0, angle = 0.0) {
    let translationVector = vec4.fromValues(x, y, 0.0, 1.0);

    this.transformationMatrix = mat4.create();
    mat4.translate(this.transformationMatrix, this.transformationMatrix, translationVector);
    mat4.rotateZ(this.transformationMatrix, this.transformationMatrix, angle);

    this.children = [];
  }

  updateAll(deltaTime) {
    for (let child of this.children) {
      child.update(deltaTime);
    }

    this.update(deltaTime);
  }

  update(deltaTime) {}

  drawAll(renderer, transformationMatrix = mat4.create()) {
    transformationMatrix = mat4.clone(transformationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, this.transformationMatrix);

    for (let child of this.children) {
      child.draw(renderer, transformationMatrix);
    }

    this.draw(renderer, transformationMatrix);
  }

  draw(renderer, transformationMatrix = mat4.create()) {}
}

export default Entity;
