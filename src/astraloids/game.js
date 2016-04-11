'use strict';

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

    this.renderer.clear();

    for (let entity of this.entities) {
      entity.drawAll(this.renderer);
    }

    this.lastTime = currentTime;
  }
}

export default Game;
