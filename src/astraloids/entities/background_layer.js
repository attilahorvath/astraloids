'use strict';

import Entity from '../entity';

const mat4 = require('gl-matrix').mat4;

class BackgroundLayer extends Entity {
  constructor(game, stars = 500, pointSize = 1.0, relativeVelocity = 1.0, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.stars = stars;
    this.pointSize = pointSize;
    this.relativeVelocity = relativeVelocity;

    let vertices = [];

    for (let i = 0; i < this.stars; i++) {
      vertices.push(-game.renderer.canvas.width / 2 + Math.random() * game.renderer.canvas.width, -game.renderer.canvas.height / 2 + Math.random() * game.renderer.canvas.height, 0.0, 1.0, 1.0, 1.0, 1.0);
    }

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.pointShader = game.renderer.shaders.pointShader;
  }

  draw(renderer, deltaTime, transformationMatrix = mat4.create()) {
    this.pointShader.pointSizeValue = this.pointSize;

    renderer.draw(renderer.shaders.pointShader, transformationMatrix, this.vertexBuffer, renderer.gl.POINTS, this.stars);
  }
}

export default BackgroundLayer;
