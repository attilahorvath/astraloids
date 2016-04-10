'use strict';

const mat4 = require('gl-matrix').mat4;

const stars = 500;

import Entity from '../entity';

class BackgroundLayer extends Entity {
  constructor(game) {
    super();

    let vertices = [];

    for (let i = 0; i < stars; i++) {
      vertices.push(-160 + Math.random() * 320, -120 + Math.random() * 240, 0.0, 1.0, 1.0, 1.0, 1.0);
    }

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);
  }

  draw(renderer, transformationMatrix = mat4.create()) {
    renderer.draw(renderer.shaders.pointShader, transformationMatrix, this.vertexBuffer, renderer.gl.POINTS, stars);
  }
}

export default BackgroundLayer;
