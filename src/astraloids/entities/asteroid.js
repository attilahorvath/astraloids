'use strict';

import Entity from '../entity';

const mat2 = require('gl-matrix').mat2;
const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

class Asteroid extends Entity {
  constructor(game, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    let vertices = [];

    let color = 0.2 + Math.random() * 0.5;

    for (let vertexAngle = 0.0; vertexAngle < Math.PI * 2.0; vertexAngle += (Math.PI * 2.0) / 8.0) {
      let vertexPosition = vec2.fromValues(0.0, -10.0 - Math.random() * 50.0);
      let rotation = mat2.create();
      mat2.rotate(rotation, rotation, vertexAngle);
      vec2.transformMat2(vertexPosition, vertexPosition, rotation);
      vertices.push(vertexPosition[0], vertexPosition[1], 0.0, color, color, color, 1.0);
    }

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.simpleShader = game.renderer.shaders.simpleShader;
  }

  draw(renderer, deltaTime, transformation = mat4.create()) {
    renderer.draw(this.simpleShader, transformation, this.vertexBuffer, renderer.gl.TRIANGLE_FAN, 8);
  }
}

export default Asteroid;
