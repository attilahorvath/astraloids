'use strict';

import KeyboardInput from './keyboard_input';

import Renderer from './renderer';
import Camera from './camera';

import Background from './entities/background';
import Ship from './entities/ship';
import ParticleEmitter from './entities/particle_emitter';

class Game {
  constructor() {
    this.keyboardInput = new KeyboardInput();

    this.renderer = new Renderer();
    this.camera = new Camera();

    this.entities = [];
  }

  run() {
    this.renderer.initialize();

    this.camera.setPosition(this.renderer.canvas.width / 2, this.renderer.canvas.height / 2);

    this.entities.push(new Background(this));
    //this.entities.push(new Ship(this));
    this.entities.push(new ParticleEmitter(this, -300, -300));
    this.entities.push(new ParticleEmitter(this,  300, -300));
    this.entities.push(new ParticleEmitter(this));

    this.lastTime = Date.now();

    requestAnimationFrame(() => this.loop());
  }

  loop(currentTime = Date.now()) {
    requestAnimationFrame(() => this.loop());

    let deltaTime = currentTime - this.lastTime;

    if (this.keyboardInput.keysDown[87]) {
      this.camera.setPosition(this.camera.x, this.camera.y + deltaTime * 0.75);
    }

    if (this.keyboardInput.keysDown[83]) {
      this.camera.setPosition(this.camera.x, this.camera.y - deltaTime * 0.75);
    }

    if (this.keyboardInput.keysDown[65]) {
      this.camera.setPosition(this.camera.x + deltaTime * 0.75, this.camera.y);
    }

    if (this.keyboardInput.keysDown[68]) {
      this.camera.setPosition(this.camera.x - deltaTime * 0.75, this.camera.y);
    }

    for (let entity of this.entities) {
      entity.updateAll(deltaTime);
    }

    this.renderer.clear();

    for (let entity of this.entities) {
      entity.drawAll(this.renderer, this.camera.modelViewMatrix);
    }

    this.lastTime = currentTime;
  }
}

export default Game;
