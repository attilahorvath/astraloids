'use strict';

const mat4 = require('gl-matrix').mat4;

import KeyboardInput from './keyboard_input';

import Renderer from './renderer';

import Background from './entities/background';
import Ship from './entities/ship';
import ParticleEmitter from './entities/particle_emitter';

class Game {
  constructor() {
    this.keyboardInput = new KeyboardInput();

    this.renderer = new Renderer();

    this.entities = [];
  }

  run() {
    this.renderer.initialize();

    this.texture = this.renderer.gl.createTexture();

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);

    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_MIN_FILTER, this.renderer.gl.LINEAR);
    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_WRAP_S, this.renderer.gl.CLAMP_TO_EDGE);
    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_WRAP_T, this.renderer.gl.CLAMP_TO_EDGE);

    this.renderer.gl.texImage2D(this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA, this.renderer.canvas.width, this.renderer.canvas.height, 0, this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE, null);

    this.framebuffer = this.renderer.gl.createFramebuffer();

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.framebuffer);

    this.renderer.gl.framebufferTexture2D(this.renderer.gl.FRAMEBUFFER, this.renderer.gl.COLOR_ATTACHMENT0, this.renderer.gl.TEXTURE_2D, this.texture, 0);

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);

    const vertices = [
       1,  1, 0, 1, 1,
      -1,  1, 0, 0, 1,
      -1, -1, 0, 0, 0,
       1,  1, 0, 1, 1,
      -1, -1, 0, 0, 0,
       1, -1, 0, 1, 0
    ];

    this.vertexBuffer = this.renderer.createVertexBuffer(vertices);

    this.ship = new Ship(this);

    this.entities.push(new Background(this));
    this.entities.push(this.ship);
    this.entities.push(new ParticleEmitter(this));
    this.entities.push(new ParticleEmitter(this, -300, -300));

    this.lastTime = Date.now();

    requestAnimationFrame(() => this.loop());
  }

  loop(currentTime = Date.now()) {
    requestAnimationFrame(() => this.loop());

    let deltaTime = currentTime - this.lastTime;

    for (let entity of this.entities) {
      entity.updateAll(this, deltaTime);
    }

    this.renderer.camera.setPosition(this.renderer.canvas.width / 2 - this.ship.x, this.renderer.canvas.height / 2 - this.ship.y);

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.framebuffer);

    this.renderer.clear();

    for (let entity of this.entities) {
      entity.drawAll(this.renderer, deltaTime);
    }

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);

    this.renderer.clear();

    this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);

    this.renderer.draw(this.renderer.shaders.textureShader, mat4.create(), this.vertexBuffer, this.renderer.gl.TRIANGLES, 6, true);

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

    this.lastTime = currentTime;
  }
}

export default Game;
