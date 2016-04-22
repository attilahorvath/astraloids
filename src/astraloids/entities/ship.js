'use strict';

import Entity from '../entity';
import Particle from '../particle';
import ParticleEmitter from './particle_emitter';
import Projectile from './projectile';

const mat2 = require('gl-matrix').mat2;
const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

class Ship extends Entity {
  constructor(game, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    const vertices = [
        0.0, -30.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      -25.0,  30.0, 0.0, 1.0, 0.0, 0.0, 1.0,
       25.0,  30.0, 0.0, 1.0, 0.0, 0.0, 1.0
    ];

    this.vertexBuffer = game.renderer.createVertexBuffer(vertices);

    this.simpleShader = game.renderer.shaders.simpleShader;

    this.thruster = new ParticleEmitter(game, 500.0, 5.0, vec2.fromValues(0.0, 30.0));
    
    this.frontLeftSteerer = new ParticleEmitter(game, 100.0, 3.0, vec2.fromValues(-5.0, -20.0));
    this.frontRightSteerer = new ParticleEmitter(game, 100.0, 3.0, vec2.fromValues(5.0, -20.0));
    this.backLeftSteerer = new ParticleEmitter(game, 100.0, 3.0, vec2.fromValues(-20.0, 20.0));
    this.backRightSteerer = new ParticleEmitter(game, 100.0, 3.0, vec2.fromValues(20.0, 20.0));

    this.children.push(this.thruster);
    this.children.push(this.frontLeftSteerer);
    this.children.push(this.frontRightSteerer);
    this.children.push(this.backLeftSteerer);
    this.children.push(this.backRightSteerer);

    this.laserTimer = 0;
  }

  update(game, deltaTime, transformation = mat4.create()) {
    let accelerationSize = 0.0;

    let accelerating = false;
    let decelerating = false;
    let steeringLeft = false;
    let steeringRight = false;

    if (game.keyboardInput.keysDown[87] || game.keyboardInput.keysDown[38]) {
      accelerationSize += 0.001;
      accelerating = true;
    }

    if (game.keyboardInput.keysDown[83] || game.keyboardInput.keysDown[40]) {
      accelerationSize -= 0.0002;
      decelerating = true;
    }

    if (game.keyboardInput.keysDown[65] || game.keyboardInput.keysDown[37]) {
      this.angle -= deltaTime * 0.002;
      steeringLeft = true;
    }

    if (game.keyboardInput.keysDown[68] || game.keyboardInput.keysDown[39]) {
      this.angle += deltaTime * 0.002;
      steeringRight = true;
    }

    if (game.keyboardInput.keysDown[32] || game.keyboardInput.keysDown[70]) {
      this.laserTimer -= deltaTime;

      if (this.laserTimer <= 0) {
        let position = vec2.fromValues(0.0, -36.0);
        let velocity = vec2.fromValues(0.0, -0.5);
        let rotationMatrix = mat2.create();

        mat2.rotate(rotationMatrix, rotationMatrix, this.angle);
        vec2.transformMat2(position, position, rotationMatrix);
        vec2.transformMat2(velocity, velocity, rotationMatrix);
        vec2.add(position, position, this.position);

        game.gameState.entities.push(new Projectile(game, position, velocity, vec2.create(), this.angle));

        this.laserTimer = 200;
      }
    } else {
      this.laserTimer = 0;
    }

    let accelerationMatrix = mat2.create();
    mat2.rotate(accelerationMatrix, accelerationMatrix, this.angle);

    vec2.set(this.acceleration, 0.0, -accelerationSize);
    vec2.transformMat2(this.acceleration, this.acceleration, accelerationMatrix);

    this.integrateValues(deltaTime);
    this.calculateTransformation();

    if (vec2.length(this.velocity) > 0.2) {
      vec2.normalize(this.velocity, this.velocity);
      vec2.scale(this.velocity, this.velocity, 0.2);
    }

    if (accelerating) {
      this.thruster.emitParticle(game.renderer, vec2.create(), transformation, 0.5 + Math.random() * 0.5, 0, 0);
    }

    if (decelerating) {
      this.emitSteeringParticles(this.frontLeftSteerer, game.renderer, 10, 0.0, -1.0, transformation);
      this.emitSteeringParticles(this.frontRightSteerer, game.renderer, 10, 0.0, -1.0, transformation);
    }

    if (steeringLeft) {
      this.emitSteeringParticles(this.frontRightSteerer, game.renderer, 10, 1.0, 0.0, transformation);
      this.emitSteeringParticles(this.backLeftSteerer, game.renderer, 10, -1.0, 0.0, transformation);
    }

    if (steeringRight) {
      this.emitSteeringParticles(this.frontLeftSteerer, game.renderer, 10, -1.0, 0.0, transformation);
      this.emitSteeringParticles(this.backRightSteerer, game.renderer, 10, 1.0, 0.0, transformation);
    }
  }

  draw(renderer, deltaTime, transformation = mat4.create()) {
    renderer.draw(this.simpleShader, transformation, this.vertexBuffer, renderer.gl.TRIANGLES, 3);
  }

  emitSteeringParticles(emitter, renderer, count, velocityX, velocityY, transformation) {
    let particles = [];

    for (let i = 0; i < count; i++) {
      let particleVelocityX = velocityX === 0 ? -0.05 + Math.random() * 0.1 : (0.2 + Math.random() * 0.2) * velocityX;
      let particleVelocityY = velocityY === 0 ? -0.05 + Math.random() * 0.1 : (0.2 + Math.random() * 0.2) * velocityY;
      let particleVelocity = vec2.fromValues(particleVelocityX, particleVelocityY);
      let rotationMatrix = mat2.create();

      mat2.rotate(rotationMatrix, rotationMatrix, this.angle);
      vec2.transformMat2(particleVelocity, particleVelocity, rotationMatrix);
      vec2.add(particleVelocity, particleVelocity, this.velocity);

      particles.push(new Particle(particleVelocity, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5));
    }

    emitter.emitParticles(renderer, particles, transformation);
  }
}

export default Ship;
