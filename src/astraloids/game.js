'use strict';

import KeyboardInput from './keyboard_input';

import Renderer from './renderer';

import Background from './entities/background';
import Ship from './entities/ship';

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

    this.renderer.postProcessor.begin(true);

    for (let entity of this.entities) {
      entity.drawAll(this.renderer, deltaTime);
    }

    this.renderer.postProcessor.end();

    this.renderer.clear();

    for (let entity of this.entities) {
      entity.drawAll(this.renderer, deltaTime);
    }

    this.renderer.postProcessor.process(this.renderer.shaders.thresholdShader);

    this.renderer.shaders.blurShader.textureSizeValue = [this.renderer.postProcessor.downscaledWidth(), this.renderer.postProcessor.downscaledHeight()];

    this.renderer.shaders.blurShader.directionValue = [1.0, 0.0];
    this.renderer.postProcessor.process(this.renderer.shaders.blurShader);

    this.renderer.shaders.blurShader.directionValue = [0.0, 1.0];
    this.renderer.postProcessor.process(this.renderer.shaders.blurShader);

    this.renderer.postProcessor.draw(this.renderer.shaders.textureShader, true);

    this.lastTime = currentTime;
  }
}

export default Game;
