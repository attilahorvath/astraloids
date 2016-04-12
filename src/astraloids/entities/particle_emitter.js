'use strict';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;
const vec4 = require('gl-matrix').vec4;

const maxVertices = 1000;

import Entity from '../entity';

class ParticleEmitter extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.vertices = new Float32Array(maxVertices * 11);
    this.vertexCount = 0;
    this.vertexIndex = 0;

    this.vertexBuffer = game.renderer.createVertexBuffer(this.vertices);

    this.particleShader = game.renderer.shaders.particleShader;

    this.currentTime = 0;
    this.lifetime = this.particleShader.lifetimeValue;
    this.pointSize = this.particleShader.pointSizeValue;
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

    this.vertices[this.vertexIndex * 11]      = position[0];
    this.vertices[this.vertexIndex * 11 + 1]  = position[1];
    this.vertices[this.vertexIndex * 11 + 2]  = 0.0;
    this.vertices[this.vertexIndex * 11 + 3]  = velocity[0];
    this.vertices[this.vertexIndex * 11 + 4]  = velocity[1];
    this.vertices[this.vertexIndex * 11 + 5]  = 0.0;
    this.vertices[this.vertexIndex * 11 + 6]  = red;
    this.vertices[this.vertexIndex * 11 + 7]  = green;
    this.vertices[this.vertexIndex * 11 + 8]  = blue;
    this.vertices[this.vertexIndex * 11 + 9]  = 1.0;
    this.vertices[this.vertexIndex * 11 + 10] = this.currentTime;

    renderer.fillVertexBuffer(this.vertexBuffer, this.vertices);
  }

  update(game, deltaTime, transformationMatrix = mat4.create()) {
    this.currentTime += deltaTime;
  }

  draw(renderer, deltaTime, transformationMatrix = mat4.create()) {
    if (this.vertices.length > 0) {
      this.particleShader.currentTimeValue = this.currentTime;
      this.particleShader.lifetimeValue = this.lifetime;
      this.particleShader.pointSizeValue = this.pointSize;

      renderer.draw(this.particleShader, mat4.create(), this.vertexBuffer, renderer.gl.POINTS, this.vertexCount);
    }
  }
}

export default ParticleEmitter;
