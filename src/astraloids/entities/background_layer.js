'use strict';

import Entity from '../entity';

const vec2 = require('gl-matrix').vec2;

class BackgroundLayer extends Entity {
  constructor(game, background, stars = 500, pointSize = 1.0, relativeVelocity = 1.0, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    this.background = background;

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

  update(game) {
    vec2.scaleAndAdd(this.position, this.position, this.background.ship.deltaPosition, 1.0 / this.relativeVelocity);

    for (let i = 0; i <= 1; i++) {
      if (this.position[i] - game.renderer.dimensions[i] / 2 > this.background.ship.position[i]) {
        this.position[i] -= game.renderer.dimensions[i];
      } else if (this.position[i] + game.renderer.dimensions[i] / 2 < this.background.ship.position[i]) {
        this.position[i] += game.renderer.dimensions[i];
      }
    }

    this.calculateTransformation();
  }

  draw(renderer) {
    this.pointShader.pointSizeValue = this.pointSize;

    let position = vec2.clone(this.position);

    for (let i = 0; i < 4; i++) {
      if (i % 2 === 1) {
        if (this.background.ship.position[0] <= this.position[0]) {
          this.position[0] -= renderer.dimensions[0];
        } else {
          this.position[0] += renderer.dimensions[0];
        }
      }

      if (i >= 2) {
        if (this.background.ship.position[1] <= this.position[1]) {
          this.position[1] -= renderer.dimensions[1];
        } else {
          this.position[1] += renderer.dimensions[1];
        }
      }

      this.calculateTransformation();

      renderer.draw(this.pointShader, this.transformation, this.vertexBuffer, null, renderer.gl.POINTS, this.stars);

      this.position = vec2.clone(position);
    }

    this.calculateTransformation();
  }
}

export default BackgroundLayer;
