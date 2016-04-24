'use strict';

import Renderer from './renderer';

import KeyboardInput from './keyboard_input';
import MouseInput from './mouse_input';

class Game {
  constructor() {
    this.renderer = new Renderer();

    this.keyboardInput = new KeyboardInput();
    this.mouseInput = new MouseInput(this.renderer);
  }

  run(gameState) {
    this.gameState = gameState;

    this.lastTime = Date.now();

    requestAnimationFrame(() => this.loop());
  }

  loop(currentTime = Date.now()) {
    requestAnimationFrame(() => this.loop());

    let deltaTime = currentTime - this.lastTime;

    this.keyboardInput.update();
    this.mouseInput.update();

    this.gameState.update(deltaTime);
    this.gameState.draw(deltaTime);

    this.gameState = this.gameState.nextState;

    this.lastTime = currentTime;
  }
}

export default Game;
