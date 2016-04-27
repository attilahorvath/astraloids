'use strict';

import Entity from '../entity';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

class Projectile extends Entity {
  constructor(game, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    const vertices = [
      0.0,  0.0, 0.0, 0.3, 1.0, 1.0, 1.0,
      0.0, 25.0, 0.0, 0.3, 1.0, 1.0, 1.0
    ];

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.simpleShader = game.renderer.shaders.simpleShader;

    this.lifetime = 2000;
  }

  update(game, deltaTime) {
    this.integrateValues(deltaTime);
    this.calculateTransformation();

    game.gameState.asteroids.forEach(asteroid => asteroid.checkProjectile(this));

    this.lifetime -= deltaTime;

    if (this.lifetime <= 0) {
      this.alive = false;
    }
  }

  draw(renderer, deltaTime, transformation = mat4.create()) {
    renderer.setLineWidth(3.0);
    renderer.draw(this.simpleShader, transformation, this.vertexBuffer, null, renderer.gl.LINES, 2);
  }
}

export default Projectile;
