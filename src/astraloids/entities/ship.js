'use strict';

import Entity from '../entity';
import ParticleEmitter from './particle_emitter';

const mat2 = require('gl-matrix').mat2;
const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

class Ship extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.acceleration = vec2.create();
    this.velocity = vec2.create();

    const vertices = [
        0.0, -30.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      -25.0,  30.0, 0.0, 1.0, 0.0, 0.0, 1.0,
       25.0,  30.0, 0.0, 1.0, 0.0, 0.0, 1.0
    ];

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.simpleShader = game.renderer.shaders.simpleShader;

    this.thruster = new ParticleEmitter(game, 0.0, 30.0, 0.0);
    this.thruster.pointSize = 5.0;
    this.thruster.lifetime = 500.0;

    this.frontLeftSteerer = new ParticleEmitter(game, -5.0, -20.0, 0.0);
    this.frontLeftSteerer.pointSize = 3.0;
    this.frontLeftSteerer.lifetime = 100.0;

    this.frontRightSteerer = new ParticleEmitter(game, 5.0, -20.0, 0.0);
    this.frontRightSteerer.pointSize = 3.0;
    this.frontRightSteerer.lifetime = 100.0;

    this.backLeftSteerer = new ParticleEmitter(game, -20.0, 20.0, 0.0);
    this.backLeftSteerer.pointSize = 3.0;
    this.backLeftSteerer.lifetime = 100.0;

    this.backRightSteerer = new ParticleEmitter(game, 20.0, 20.0, 0.0);
    this.backRightSteerer.pointSize = 3.0;
    this.backRightSteerer.lifetime = 100.0;

    this.children.push(this.thruster);
    this.children.push(this.frontLeftSteerer);
    this.children.push(this.frontRightSteerer);
    this.children.push(this.backLeftSteerer);
    this.children.push(this.backRightSteerer);
  }

  update(game, deltaTime, transformationMatrix = mat4.create()) {
    let accelerationSize = 0.0;
    let steeringLeft = false;
    let steeringRight = false;

    if (game.keyboardInput.keysDown[87] || game.keyboardInput.keysDown[38]) {
      accelerationSize = 0.001;
    }

    if (game.keyboardInput.keysDown[83] || game.keyboardInput.keysDown[40]) {
      accelerationSize = -0.0002;
    }

    if (game.keyboardInput.keysDown[65] || game.keyboardInput.keysDown[37]) {
      this.angle -= deltaTime * 0.002;
      steeringLeft = true;
    }

    if (game.keyboardInput.keysDown[68] || game.keyboardInput.keysDown[39]) {
      this.angle += deltaTime * 0.002;
      steeringRight = true;
    }

    let accelerationMatrix = mat2.create();
    mat2.rotate(accelerationMatrix, accelerationMatrix, this.angle);

    vec2.set(this.acceleration, 0.0, -accelerationSize);
    vec2.transformMat2(this.acceleration, this.acceleration, accelerationMatrix);

    vec2.set(this.velocity, this.velocity[0] + this.acceleration[0] * deltaTime, this.velocity[1] + this.acceleration[1] * deltaTime);

    if (vec2.length(this.velocity) > 0.2) {
      vec2.normalize(this.velocity, this.velocity);
      vec2.scale(this.velocity, this.velocity, 0.2);
    }

    this.x += this.velocity[0] * deltaTime;
    this.y += this.velocity[1] * deltaTime;

    this.calculateTransformationMatrix();

    if (accelerationSize > 0.0) {
      this.thruster.emitParticle(game.renderer, vec2.create(), transformationMatrix, 0.5 + Math.random() * 0.5, 0, 0);
    } else if (accelerationSize < 0.0) {
      this.emitSteeringParticles(this.frontLeftSteerer, game.renderer, 10, 0.0, -1.0, transformationMatrix);
      this.emitSteeringParticles(this.frontRightSteerer, game.renderer, 10, 0.0, -1.0, transformationMatrix);
    }

    if (steeringLeft) {
      this.emitSteeringParticles(this.frontRightSteerer, game.renderer, 10, 1.0, 0.0, transformationMatrix);
      this.emitSteeringParticles(this.backLeftSteerer, game.renderer, 10, -1.0, 0.0, transformationMatrix);
    }

    if (steeringRight) {
      this.emitSteeringParticles(this.frontLeftSteerer, game.renderer, 10, -1.0, 0.0, transformationMatrix);
      this.emitSteeringParticles(this.backRightSteerer, game.renderer, 10, 1.0, 0.0, transformationMatrix);
    }
  }

  draw(renderer, deltaTime, transformationMatrix = mat4.create()) {
    renderer.draw(this.simpleShader, transformationMatrix, this.vertexBuffer, renderer.gl.TRIANGLES, 3);
  }

  emitSteeringParticles(emitter, renderer, count, velocityX, velocityY, transformationMatrix) {
    for (let i = 0; i < count; i++) {
      let particleVelocityX = velocityX === 0 ? -0.05 + Math.random() * 0.1 : (0.2 + Math.random() * 0.2) * velocityX;
      let particleVelocityY = velocityY === 0 ? -0.05 + Math.random() * 0.1 : (0.2 + Math.random() * 0.2) * velocityY;
      let particleVelocity = vec2.fromValues(particleVelocityX, particleVelocityY);
      let rotationMatrix = mat2.create();
      mat2.rotate(rotationMatrix, rotationMatrix, this.angle);
      vec2.transformMat2(particleVelocity, particleVelocity, rotationMatrix);
      vec2.add(particleVelocity, particleVelocity, this.velocity);
      emitter.emitParticle(renderer, particleVelocity, transformationMatrix, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);
    }
  }
}

export default Ship;
