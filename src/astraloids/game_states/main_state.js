'use strict';

import GameState from '../game_state';

import Background from '../entities/background';
import Ship from '../entities/ship';

class MainState extends GameState {
  constructor(game) {
    super(game);

    this.ship = new Ship(this.game);

    this.entities.push(new Background(this.game, this.ship));
    this.entities.push(this.ship);
  }

  update(deltaTime) {
    super.update(deltaTime);

    this.renderer.camera.setPosition(this.renderer.canvas.width / 2 - this.ship.x, this.renderer.canvas.height / 2 - this.ship.y);
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
