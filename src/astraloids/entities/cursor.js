'use strict';

import Entity from '../entity';

import { pointInTriangle } from '../math';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;

class Cursor extends Entity {
  constructor(game, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    this.vertices = [
        0.0,  0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
        0.0, 20.0, 0.0, 1.0, 1.0, 1.0, 1.0,
       20.0,  0.0, 0.0, 1.0, 1.0, 1.0, 1.0
    ];

    this.hoverVertices = [
        0.0,  0.0, 0.0, 0.0, 1.0, 0.0, 1.0,
        0.0, 20.0, 0.0, 0.0, 1.0, 0.0, 1.0,
       20.0,  0.0, 0.0, 0.0, 1.0, 0.0, 1.0
    ];

    this.hover = false;

    this.vertexBuffer = game.renderer.createVertexBuffer(this.vertices);

    this.simpleShader = game.renderer.shaders.simpleShader;
  }

  update(game, deltaTime, transformation = mat4.create()) {
    vec2.subtract(this.position, game.mouseInput.position, game.renderer.camera.position);

    this.integrateValues(deltaTime);
    this.calculateTransformation();

    this.hover = game.gameState.ship.containsPointInAll(this.position) || game.gameState.asteroids.some(asteroid => asteroid.containsPointInAll(this.position));

    if (this.hover) {
      game.renderer.fillVertexBuffer(this.vertexBuffer, this.hoverVertices);
    } else {
      game.renderer.fillVertexBuffer(this.vertexBuffer, this.vertices);
    }
  }

  draw(renderer, deltaTime, transformation = mat4.create()) {
    renderer.draw(this.simpleShader, transformation, this.vertexBuffer, null, renderer.gl.TRIANGLES, 3);
  }
}

export default Cursor;
