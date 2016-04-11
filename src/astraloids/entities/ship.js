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

    this.children.push(this.thruster);

    this.particleTimer = 0;
    this.emitParticle = false;
  }

  update(game, deltaTime) {
    let accelerationSize = 0.0;

    if (game.keyboardInput.keysDown[87]) {
      accelerationSize = 0.001;
    }

    if (game.keyboardInput.keysDown[83]) {
      accelerationSize = -0.0002;
    }

    if (game.keyboardInput.keysDown[65]) {
      this.angle -= deltaTime * 0.01;
    }

    if (game.keyboardInput.keysDown[68]) {
      this.angle += deltaTime * 0.01;
    }

    let accelerationMatrix = mat2.create();
    mat2.rotate(accelerationMatrix, accelerationMatrix, this.angle);

    vec2.set(this.acceleration, 0.0, -accelerationSize);
    vec2.transformMat2(this.acceleration, this.acceleration, accelerationMatrix);

    let oldVelocity = vec2.clone(this.velocity);

    vec2.set(this.velocity, this.velocity[0] + this.acceleration[0] * deltaTime, this.velocity[1] + this.acceleration[1] * deltaTime);

    if (vec2.length(this.velocity) > 0.5) {
      this.velocity = oldVelocity;
    }

    this.x += this.velocity[0] * deltaTime;
    this.y += this.velocity[1] * deltaTime;

    this.calculateTransformationMatrix();

    this.particleTimer += deltaTime;

    if (this.particleTimer >= 10) {
      this.particleTimer = 0;
      this.emitParticle = true;
    }
  }

  draw(renderer, transformationMatrix = mat4.create()) {
    renderer.draw(this.simpleShader, transformationMatrix, this.vertexBuffer, renderer.gl.TRIANGLES, 3);

    if (this.emitParticle) {
      this.thruster.emitParticle(renderer, this.velocity);
      this.emitParticle = false;
    }
  }
}

export default Ship;
