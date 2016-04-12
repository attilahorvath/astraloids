'use strict';

import Entity from '../entity';

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
    transformationMatrix = mat4.clone(transformationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, this.transformationMatrix);

    let position = vec2.create();
    vec2.transformMat4(position, position, transformationMatrix);

    this.vertexCount++;

    if (this.vertexCount > maxVertices) {
      this.vertexCount = maxVertices;
    }

    this.vertexIndex = (this.vertexIndex + 1) % maxVertices;

    let arrayIndex = this.vertexIndex * (this.particleShader.vertexSize / Float32Array.BYTES_PER_ELEMENT);

    this.vertices[arrayIndex++] = position[0];
    this.vertices[arrayIndex++] = position[1];
    this.vertices[arrayIndex++] = 0.0;
    this.vertices[arrayIndex++] = velocity[0];
    this.vertices[arrayIndex++] = velocity[1];
    this.vertices[arrayIndex++] = 0.0;
    this.vertices[arrayIndex++] = red;
    this.vertices[arrayIndex++] = green;
    this.vertices[arrayIndex++] = blue;
    this.vertices[arrayIndex++] = 1.0;
    this.vertices[arrayIndex++] = this.currentTime;

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
