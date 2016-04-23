'use strict';

import Entity from '../entity';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

class BackgroundLayer extends Entity {
  constructor(game, stars = 500, pointSize = 1.0, relativeVelocity = 1.0, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    this.stars = stars;
    this.pointSize = pointSize;
    this.relativeVelocity = relativeVelocity;

    let vertices = [];

    for (let i = 0; i < this.stars; i++) {
      vertices.push(-game.renderer.dimensions[0] / 2 + Math.random() * game.renderer.dimensions[0], -game.renderer.dimensions[1] / 2 + Math.random() * game.renderer.dimensions[1], 0.0, 1.0, 1.0, 1.0, 1.0);
    }

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.pointShader = game.renderer.shaders.pointShader;
  }

  draw(renderer, deltaTime, transformation = mat4.create()) {
    this.pointShader.pointSizeValue = this.pointSize;

    renderer.draw(this.pointShader, transformation, this.vertexBuffer, renderer.gl.POINTS, this.stars);
  }
}

export default BackgroundLayer;
