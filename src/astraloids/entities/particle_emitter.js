'use strict';

import Entity from '../entity';
import Particle from '../particle';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;
const vec4 = require('gl-matrix').vec4;

const maxVertices = 1000;

class ParticleEmitter extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.vertexBuffer = game.renderer.createVertexBuffer(this.vertices);

    this.particleShader = game.renderer.shaders.particleShader;

    this.currentTime = 0;
    this.lifetime = this.particleShader.lifetimeValue;
    this.pointSize = this.particleShader.pointSizeValue;

    this.vertices = new Float32Array(maxVertices * (this.particleShader.vertexSize / Float32Array.BYTES_PER_ELEMENT));
    this.vertexCount = 0;
    this.vertexIndex = 0;
  }

  emitParticle(renderer, velocity, transformationMatrix = mat4.create(), red = Math.random(), green = Math.random(), blue = Math.random()) {
    this.emitParticles(renderer, [new Particle(velocity, red, green, blue)], transformationMatrix);
  }

  emitParticles(renderer, particles, transformationMatrix = mat4.create()) {
    transformationMatrix = mat4.clone(transformationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, this.transformationMatrix);

    this.vertexCount += particles.length;

    if (this.vertexCount > maxVertices) {
      this.vertexCount = maxVertices;
    }

    for (let particle of particles) {
      let position = vec2.create();
      vec2.transformMat4(position, position, transformationMatrix);

      this.vertexIndex = (++this.vertexIndex) % maxVertices;

      let arrayIndex = this.vertexIndex * (this.particleShader.vertexSize / Float32Array.BYTES_PER_ELEMENT);

      this.vertices[arrayIndex++] = position[0];
      this.vertices[arrayIndex++] = position[1];
      this.vertices[arrayIndex++] = 0.0;
      this.vertices[arrayIndex++] = particle.velocity[0];
      this.vertices[arrayIndex++] = particle.velocity[1];
      this.vertices[arrayIndex++] = 0.0;
      this.vertices[arrayIndex++] = particle.red;
      this.vertices[arrayIndex++] = particle.green;
      this.vertices[arrayIndex++] = particle.blue;
      this.vertices[arrayIndex++] = 1.0;
      this.vertices[arrayIndex++] = this.currentTime;
    }

    renderer.fillVertexBuffer(this.vertexBuffer, this.vertices);
  }

  update(game, deltaTime, transformationMatrix = mat4.create()) {
    this.currentTime += deltaTime;
  }

  draw(renderer, deltaTime, transformationMatrix = mat4.create()) {
    if (this.vertexCount > 0) {
      this.particleShader.currentTimeValue = this.currentTime;
      this.particleShader.lifetimeValue = this.lifetime;
      this.particleShader.pointSizeValue = this.pointSize;

      renderer.draw(this.particleShader, mat4.create(), this.vertexBuffer, renderer.gl.POINTS, this.vertexCount);
    }
  }
}

export default ParticleEmitter;
