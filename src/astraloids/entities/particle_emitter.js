'use strict';

import Entity from '../entity';
import Particle from '../particle';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;

const maxVertices = 1000;

class ParticleEmitter extends Entity {
  constructor(game, lifetime = 100.0, pointSize = 1.5, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    this.renderer = game.renderer;
    this.particleShader = this.renderer.shaders.particleShader;

    this.currentTime = 0;
    this.lifetime = lifetime;
    this.pointSize = pointSize;

    this.vertices = new Float32Array(maxVertices * (this.particleShader.vertexSize / Float32Array.BYTES_PER_ELEMENT));
    this.vertexCount = 0;
    this.vertexIndex = 0;

    this.vertexBuffer = this.renderer.createVertexBuffer(this.vertices);
  }

  emitParticle(velocity, transformation = mat4.create(), color = vec3.fromValues(Math.random(), Math.random(), Math.random())) {
    this.emitParticles([new Particle(velocity, color)], transformation);
  }

  emitParticles(particles, transformation = mat4.create()) {
    transformation = mat4.clone(transformation);
    mat4.multiply(transformation, transformation, this.transformation);

    this.vertexCount += particles.length;

    if (this.vertexCount > maxVertices) {
      this.vertexCount = maxVertices;
    }

    for (let particle of particles) {
      let position = vec2.create();
      vec2.transformMat4(position, position, transformation);

      this.vertexIndex = (++this.vertexIndex) % maxVertices;

      let arrayIndex = this.vertexIndex * (this.particleShader.vertexSize / Float32Array.BYTES_PER_ELEMENT);

      this.vertices[arrayIndex++] = position[0];
      this.vertices[arrayIndex++] = position[1];
      this.vertices[arrayIndex++] = 0.0;
      this.vertices[arrayIndex++] = particle.velocity[0];
      this.vertices[arrayIndex++] = particle.velocity[1];
      this.vertices[arrayIndex++] = 0.0;
      this.vertices[arrayIndex++] = particle.color[0];
      this.vertices[arrayIndex++] = particle.color[1];
      this.vertices[arrayIndex++] = particle.color[2];
      this.vertices[arrayIndex++] = 1.0;
      this.vertices[arrayIndex++] = this.currentTime;
    }

    this.renderer.fillVertexBuffer(this.vertexBuffer, this.vertices);
  }

  update(game, deltaTime) {
    this.currentTime += deltaTime;

    this.integrateValues(deltaTime);
    this.calculateTransformation();
  }

  draw(renderer) {
    if (this.vertexCount > 0) {
      this.particleShader.currentTimeValue = this.currentTime;
      this.particleShader.lifetimeValue = this.lifetime;
      this.particleShader.pointSizeValue = this.pointSize;

      renderer.draw(this.particleShader, mat4.create(), this.vertexBuffer, null, renderer.gl.POINTS, this.vertexCount);
    }
  }
}

export default ParticleEmitter;
