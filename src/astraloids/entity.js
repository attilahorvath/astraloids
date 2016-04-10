'use strict';

const mat4 = require('gl-matrix').mat4;

class Entity {
  constructor() {
    this.transformationMatrix = mat4.create();

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
    mat4.multiply(transformationMatrix, transformationMatrix, this.transformationMatrix);

    for (let child of this.children) {
      child.draw(renderer, transformationMatrix);
    }

    this.draw(renderer, transformationMatrix);
  }

  draw(renderer, transformationMatrix = mat4.create()) {}
}

export default Entity;
