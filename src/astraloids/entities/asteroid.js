'use strict';

import Entity from '../entity';

const mat2 = require('gl-matrix').mat2;
const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

class Asteroid extends Entity {
  constructor(game, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    this.vertices = [];

    let color = 0.2 + Math.random() * 0.5;

    for (let vertexAngle = 0.0; vertexAngle < Math.PI * 2.0; vertexAngle += Math.PI / (3.0 + Math.random() * 6.0)) {
      let vertexPosition = vec2.fromValues(0.0, -10.0 - Math.random() * 50.0);
      let rotation = mat2.create();
      mat2.rotate(rotation, rotation, vertexAngle);
      vec2.transformMat2(vertexPosition, vertexPosition, rotation);
      this.vertices.push(vertexPosition[0], vertexPosition[1], 0.0, 0.0, 1.0, 0.5, 1.0);
    }

    this.vertexBuffer = game.renderer.createVertexBuffer(this.vertices);

    this.pointShader = game.renderer.shaders.pointShader;

    this.angularVelocity = -0.0005 + Math.random() * 0.001;
  }

  draw(renderer, deltaTime, transformation = mat4.create()) {
    this.pointShader.pointSizeValue = 8.0;
    renderer.draw(this.pointShader, transformation, this.vertexBuffer, renderer.gl.POINTS, this.vertices.length / 7);
    renderer.draw(this.pointShader, transformation, this.vertexBuffer, renderer.gl.LINE_LOOP, this.vertices.length / 7);
  }
}

export default Asteroid;
