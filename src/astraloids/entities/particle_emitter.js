'use strict';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;
const vec4 = require('gl-matrix').vec4;

import Entity from '../entity';

class ParticleEmitter extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.vertices = [];

    this.vertexBuffer = game.renderer.createVertexBuffer(this.vertices);

    this.particleShader = game.renderer.shaders.particleShader;

    this.currentTime = 0;
  }

  emitParticle(renderer, velocity) {
    this.vertices.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, Math.random(), Math.random(), Math.random(), 1.0);

    renderer.fillVertexBuffer(this.vertexBuffer, this.vertices);
  }

  update(game, deltaTime) {
    this.currentTime += deltaTime * 0.02;
  }

  draw(renderer, transformationMatrix = mat4.create()) {
    if (this.vertices.length > 0) {
      this.particleShader.currentTimeValue = this.currentTime;

      renderer.draw(this.particleShader, transformationMatrix, this.vertexBuffer, renderer.gl.POINTS, this.vertices.length / 10);
    }
  }
}

export default ParticleEmitter;
