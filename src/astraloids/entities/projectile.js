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

    const hitVertices = [
      0.0,  0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, 25.0, 0.0, 1.0, 0.0, 0.0, 1.0
    ];

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);
    this.hitVertexBuffer = game.renderer.createVertexBuffer(hitVertices);

    this.simpleShader = game.renderer.shaders.simpleShader;

    this.active = true;
  }

  update(game, deltaTime, transformation = mat4.create()) {
    this.integrateValues(deltaTime);
    this.calculateTransformation();

    this.hit = game.gameState.asteroids.some(asteroid => asteroid.containsPointInAll(this.position));
  }

  draw(renderer, deltaTime, transformation = mat4.create()) {
    renderer.setLineWidth(3.0);

    if (this.hit) {
      renderer.draw(this.simpleShader, transformation, this.hitVertexBuffer, null, renderer.gl.LINES, 2);
    } else {
      renderer.draw(this.simpleShader, transformation, this.vertexBuffer, null, renderer.gl.LINES, 2);
    }
  }
}

export default Projectile;
