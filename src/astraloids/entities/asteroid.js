'use strict';

import Entity from '../entity';

const mat2 = require('gl-matrix').mat2;
const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

class Asteroid extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    let vertices = [];

    let color = 0.2 + Math.random() * 0.5;

    for (let angle = 0.0; angle < Math.PI * 2.0; angle += (Math.PI * 2.0) / 8.0) {
      let position = vec2.fromValues(0.0, -10.0 - Math.random() * 50.0);
      let rotationMatrix = mat2.create();
      mat2.rotate(rotationMatrix, rotationMatrix, angle);
      vec2.transformMat2(position, position, rotationMatrix);
      vertices.push(position[0], position[1], 0.0, color, color, color, 1.0);
    }

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.simpleShader = game.renderer.shaders.simpleShader;
  }

  draw(renderer, deltaTime, transformationMatrix = mat4.create()) {
    renderer.draw(this.simpleShader, transformationMatrix, this.vertexBuffer, renderer.gl.TRIANGLE_FAN, 8);
  }
}

export default Asteroid;
