'use strict';

import GameState from '../game_state';

import Background from '../entities/background';
import Ship from '../entities/ship';
import Asteroid from '../entities/asteroid';

const vec2 = require('gl-matrix').vec2;

class MainState extends GameState {
  constructor(game) {
    super(game);

    this.ship = new Ship(this.game);

    this.entities.push(new Background(this.game, this.ship));

    for (let i = 0; i < 10; i++) {
      this.entities.push(new Asteroid(this.game, vec2.fromValues(-this.renderer.canvas.width / 2 + Math.random() * this.renderer.canvas.width, -this.renderer.canvas.height / 2 + Math.random() * this.renderer.canvas.height)));
    }

    this.entities.push(this.ship);
  }

  update(deltaTime) {
    super.update(deltaTime);

    this.renderer.camera.setPosition(this.renderer.canvas.width / 2 - this.ship.position[0], this.renderer.canvas.height / 2 - this.ship.position[1]);
  }

  draw(deltaTime) {
    this.renderer.postProcessor.begin(true);

    super.draw(deltaTime);

    this.renderer.postProcessor.end();

    this.renderer.clear();

    super.draw(deltaTime);

    this.renderer.postProcessor.process(this.renderer.shaders.thresholdShader);

    this.renderer.shaders.blurShader.textureSizeValue = [this.renderer.postProcessor.downscaledWidth(), this.renderer.postProcessor.downscaledHeight()];

    this.renderer.shaders.blurShader.directionValue = [1.0, 0.0];
    this.renderer.postProcessor.process(this.renderer.shaders.blurShader);

    this.renderer.shaders.blurShader.directionValue = [0.0, 1.0];
    this.renderer.postProcessor.process(this.renderer.shaders.blurShader);

    this.renderer.postProcessor.draw(this.renderer.shaders.textureShader, true);
  }
}

export default MainState;
