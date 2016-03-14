'use strict';

import Renderer from './renderer';

class Game {
  constructor() {
    this.renderer = new Renderer();
  }

  run() {
    this.renderer.initialize();

    this.lastTime = Date.now();

    requestAnimationFrame(() => this.loop());
  }

  loop(currentTime = Date.now()) {
    requestAnimationFrame(() => this.loop());

    let deltaTime = currentTime - this.lastTime;

    this.renderer.clear();
    this.renderer.draw(deltaTime);

    this.lastTime = currentTime;
  }
}

export default Game;
