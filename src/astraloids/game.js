'use strict';

import Renderer from './renderer';

class Game {
  constructor() {
    this.renderer = new Renderer();
  }

  run() {
    this.renderer.initialize();

    this.renderer.clear();
  }
}

export default Game;
