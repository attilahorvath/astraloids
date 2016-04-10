'use strict';

const mat4 = require('gl-matrix').mat4;

import Entity from '../entity';

class BackgroundLayer extends Entity {
  constructor(game, stars = 500, pointSize = 1.0, relativeVelocity = 1.0, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.stars = stars;
    this.pointSize = pointSize;
    this.relativeVelocity = relativeVelocity;

    let vertices = [];

    for (let i = 0; i < this.stars; i++) {
      vertices.push((-game.renderer.canvas.width / 2 - 500.0) + Math.random() * (game.renderer.canvas.width + 1000.0), (-game.renderer.canvas.height / 2 - 500.0) + Math.random() * (game.renderer.canvas.height + 1000.0), 0.0, 1.0, 1.0, 1.0, 1.0);
    }

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.pointShader = game.renderer.shaders.pointShader;
  }

  update(game, deltaTime) {
    this.x = (game.ship.x - game.renderer.canvas.width / 2) * this.relativeVelocity;
    this.y = (game.ship.y - game.renderer.canvas.height / 2) * this.relativeVelocity;

    this.calculateTransformationMatrix();
  }

  draw(renderer, transformationMatrix = mat4.create()) {
    this.pointShader.pointSizeValue = this.pointSize;

    renderer.draw(renderer.shaders.pointShader, transformationMatrix, this.vertexBuffer, renderer.gl.POINTS, this.stars);
  }
}

export default BackgroundLayer;
