'use strict';

import Renderer from './renderer';
import Camera from './camera';

import Background from './entities/background';
import Ship from './entities/ship';
import ParticleEmitter from './entities/particle_emitter';

class Game {
  constructor() {
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

    this.renderer.clear();

    for (let entity of this.entities) {
      entity.updateAll(deltaTime);
    }

    for (let entity of this.entities) {
      entity.drawAll(this.renderer, this.camera.modelViewMatrix);
    }

    this.lastTime = currentTime;
  }
}

export default Game;
