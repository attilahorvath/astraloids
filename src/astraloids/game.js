'use strict';

import KeyboardInput from './keyboard_input';
import Renderer from './renderer';

class Game {
  constructor() {
    this.keyboardInput = new KeyboardInput();
    this.renderer = new Renderer();
  }

  run(gameState) {
    this.gameState = gameState;

    this.renderer.initialize();
    this.gameState.initialize();

    this.lastTime = Date.now();

    requestAnimationFrame(() => this.loop());
  }

  loop(currentTime = Date.now()) {
    requestAnimationFrame(() => this.loop());

    let deltaTime = currentTime - this.lastTime;

    this.gameState.update(deltaTime);
    this.gameState.draw(deltaTime);

    if (this.gameState.nextState !== this.gameState) {
      let nextState = this.gameState.nextState;

      this.gameState.cleanup();
      this.gameState = nextState;
      this.gameState.initialize();
    }

    this.lastTime = currentTime;
  }
}

export default Game;
