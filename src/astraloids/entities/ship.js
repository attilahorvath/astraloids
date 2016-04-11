'use strict';

const mat2 = require('gl-matrix').mat2;
const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

import Entity from '../entity';
import ParticleEmitter from './particle_emitter';

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

    if (game.keyboardInput.keysDown[87]) {
      accelerationSize = 0.001;
    }

    if (game.keyboardInput.keysDown[83]) {
      accelerationSize = -0.0002;
    }

    if (game.keyboardInput.keysDown[65]) {
      this.angle -= deltaTime * 0.002;
      steeringLeft = true;
    }

    if (game.keyboardInput.keysDown[68]) {
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
    }

    if (steeringLeft) {
      for (let i = 0; i < 10; i++) {
        let particleVelocity = vec2.fromValues(0.2 + Math.random() * 0.2, -0.05 + Math.random() * 0.05);
        let rotationMatrix = mat2.create();
        mat2.rotate(rotationMatrix, rotationMatrix, this.angle);
        vec2.transformMat2(particleVelocity, particleVelocity, rotationMatrix);
        this.frontRightSteerer.emitParticle(game.renderer, particleVelocity, transformationMatrix, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);
      }

      for (let i = 0; i < 10; i++) {
        let particleVelocity = vec2.fromValues(-0.2 - Math.random() * 0.2, -0.05 + Math.random() * 0.05);
        let rotationMatrix = mat2.create();
        mat2.rotate(rotationMatrix, rotationMatrix, this.angle);
        vec2.transformMat2(particleVelocity, particleVelocity, rotationMatrix);
        this.backLeftSteerer.emitParticle(game.renderer, particleVelocity, transformationMatrix, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);
      }
    }

    if (steeringRight) {
      for (let i = 0; i < 10; i++) {
        let particleVelocity = vec2.fromValues(-0.2 - Math.random() * 0.2, -0.05 + Math.random() * 0.05);
        let rotationMatrix = mat2.create();
        mat2.rotate(rotationMatrix, rotationMatrix, this.angle);
        vec2.transformMat2(particleVelocity, particleVelocity, rotationMatrix);
        this.frontLeftSteerer.emitParticle(game.renderer, particleVelocity, transformationMatrix, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);
      }

      for (let i = 0; i < 10; i++) {
        let particleVelocity = vec2.fromValues(0.2 + Math.random() * 0.2, -0.05 + Math.random() * 0.05);
        let rotationMatrix = mat2.create();
        mat2.rotate(rotationMatrix, rotationMatrix, this.angle);
        vec2.transformMat2(particleVelocity, particleVelocity, rotationMatrix);
        this.backRightSteerer.emitParticle(game.renderer, particleVelocity, transformationMatrix, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);
      }
    }
  }

  draw(renderer, deltaTime, transformationMatrix = mat4.create()) {
    renderer.draw(this.simpleShader, transformationMatrix, this.vertexBuffer, renderer.gl.TRIANGLES, 3);
  }
}

export default Ship;
