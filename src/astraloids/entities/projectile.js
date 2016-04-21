'use strict';

import Entity from '../entity';

const mat4 = require('gl-matrix').mat4;

class Projectile extends Entity {
  constructor(game, velocity, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.velocity = velocity;

    const vertices = [
      0.0, -12.0, 0.0, 0.3, 1.0, 1.0, 1.0,
      0.0,  12.0, 0.0, 0.3, 1.0, 1.0, 1.0
    ];

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.simpleShader = game.renderer.shaders.simpleShader;
  }

  update(game, deltaTime, transformationMatrix = mat4.create()) {
    this.x += this.velocity[0] * deltaTime;
    this.y += this.velocity[1] * deltaTime;

    this.calculateTransformationMatrix();
  }

  draw(renderer, deltaTime, transformationMatrix = mat4.create()) {
    renderer.setLineWidth(3.0);
    renderer.draw(this.simpleShader, transformationMatrix, this.vertexBuffer, renderer.gl.LINES, 2);
  }
}

export default Projectile;
