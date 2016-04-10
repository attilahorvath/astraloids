'use strict';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec4 = require('gl-matrix').vec4;

import Entity from '../entity';

class ParticleEmitter extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    let vertices = [];

    for (let i = 0; i < 5000; i++) {
      let velocity = vec2.create();
      vec2.random(velocity);
      vec2.scale(velocity, velocity, Math.random() * 2.0);

      vertices.push(0.0, 0.0, 0.0, velocity[0], velocity[1], 0.0, Math.random(), Math.random(), Math.random(), 1.0);
    }

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.particleShader = game.renderer.shaders.particleShader;

    this.currentTime = 0;
  }

  update(deltaTime) {
    this.currentTime += deltaTime * 0.02;
  }

  draw(renderer, transformationMatrix = mat4.create()) {
    this.particleShader.currentTimeValue = this.currentTime;

    renderer.draw(this.particleShader, transformationMatrix, this.vertexBuffer, renderer.gl.POINTS, 5000);
  }
}

export default ParticleEmitter;
