'use strict';

import Entity from '../entity';
import Particle from '../particle';
import ParticleEmitter from './particle_emitter';

import { pointInTriangle, triangulate } from '../math';

const mat2 = require('gl-matrix').mat2;
const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;

class Asteroid extends Entity {
  constructor(game, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    this.points = [];

    for (let vertexAngle = 0.0; vertexAngle < Math.PI * 2.0; vertexAngle += Math.PI / (3.0 + Math.random() * 6.0)) {
      let vertexPosition = vec2.fromValues(0.0, -10.0 - Math.random() * 50.0);
      let rotation = mat2.create();
      mat2.rotate(rotation, rotation, vertexAngle);
      vec2.transformMat2(vertexPosition, vertexPosition, rotation);
      this.points.push(vertexPosition);
    }

    this.triangleVertices = [];
    this.triangleIndices = triangulate(this.points);

    for (let point of this.points) {
      this.triangleVertices.push(point[0], point[1], 0.0, 1.0, 1.0, 1.0, 1.0);
    }

    this.triangleVertexBuffer = game.renderer.createVertexBuffer(this.triangleVertices);
    this.triangleIndexBuffer = game.renderer.createIndexBuffer(this.triangleIndices);

    this.simpleShader = game.renderer.shaders.simpleShader;

    this.vertices = [];

    for (let point of this.points) {
      this.vertices.push(point[0], point[1], 0.0, 0.0, 1.0, 0.5, 1.0);
    }

    this.vertexBuffer = game.renderer.createVertexBuffer(this.vertices);

    this.pointShader = game.renderer.shaders.pointShader;

    this.angularVelocity = -0.0005 + Math.random() * 0.001;

    this.emitter = new ParticleEmitter(game, 500.0, 5.0);

    this.children.push(this.emitter);
  }

  draw(renderer, deltaTime, transformation = mat4.create()) {
    renderer.draw(this.simpleShader, transformation, this.triangleVertexBuffer, this.triangleIndexBuffer, renderer.gl.TRIANGLES, this.triangleIndices.length);

    this.pointShader.pointSizeValue = 8.0;
    renderer.draw(this.pointShader, transformation, this.vertexBuffer, null, renderer.gl.POINTS, this.vertices.length / 7);
    renderer.draw(this.pointShader, transformation, this.vertexBuffer, null, renderer.gl.LINE_LOOP, this.vertices.length / 7);
  }

  containsPoint(point, transformation = mat4.create()) {
    for (let i = 0; i < this.triangleIndices.length; i += 3) {
      let a = vec2.transformMat4(vec2.create(), this.points[this.triangleIndices[i]], transformation);
      let b = vec2.transformMat4(vec2.create(), this.points[this.triangleIndices[i + 1]], transformation);
      let c = vec2.transformMat4(vec2.create(), this.points[this.triangleIndices[i + 2]], transformation);

      if (pointInTriangle(point, a, b, c)) {
        return true;
      }
    }

    return false;
  }

  checkProjectile(projectile) {
    if (this.containsPointInAll(projectile.position)) {
      vec2.add(this.velocity, this.velocity, vec2.scale(vec2.create(), projectile.velocity, 0.001));
      this.emitParticles(25, vec2.scale(vec2.create(), projectile.velocity, -0.5), projectile.transformation);

      projectile.alive = false;
    }
  }

  emitParticles(count, velocity, transformation) {
    let particles = [];

    for (let i = 0; i < count; i++) {
      let particleVelocityX = (0.2 + Math.random() * 0.2) * velocity[0];
      let particleVelocityY = (0.2 + Math.random() * 0.2) * velocity[1];
      let particleVelocity = vec2.fromValues(particleVelocityX, particleVelocityY);

      let rotationMatrix = mat2.rotate(mat2.create(), mat2.create(), -0.2 + Math.random() * 0.4);
      vec2.transformMat2(particleVelocity, particleVelocity, rotationMatrix);

      particles.push(new Particle(particleVelocity, vec3.fromValues(0.2 + Math.random() * 0.3, 0.2 + Math.random() * 0.3, 0.3 + Math.random() * 0.3)));
    }

    this.emitter.emitParticles(particles, transformation);
  }
}

export default Asteroid;
