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

    this.lastTime = Date.now();

    requestAnimationFrame(() => this.loop());
  }

  loop(currentTime = Date.now()) {
    requestAnimationFrame(() => this.loop());

    let deltaTime = currentTime - this.lastTime;

    this.gameState.update(deltaTime);
    this.gameState.draw(deltaTime);

    this.gameState = this.gameState.nextState;

    this.lastTime = currentTime;
  }
}

export default Game;
