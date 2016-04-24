'use strict';

import Entity from '../entity';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

class Cursor extends Entity {
  constructor(game, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    const vertices = [
        0.0,   0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
        0.0, 20.0, 0.0, 1.0, 1.0, 1.0, 1.0,
       20.0,  0.0, 0.0, 1.0, 1.0, 1.0, 1.0
    ];

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.simpleShader = game.renderer.shaders.simpleShader;
  }

  update(game, deltaTime, transformation = mat4.create()) {
    this.position = vec2.fromValues(game.mouseInput.position[0] - game.renderer.dimensions[0] / 2, game.mouseInput.position[1] - game.renderer.dimensions[1] / 2);

    this.integrateValues(deltaTime);
    this.calculateTransformation();
  }

  draw(renderer, deltaTime, transformation = mat4.create()) {
    renderer.draw(this.simpleShader, transformation, this.vertexBuffer, renderer.gl.TRIANGLES, 3);
  }
}

export default Cursor;
