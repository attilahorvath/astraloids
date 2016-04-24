'use strict';

import GameState from '../game_state';

import Background from '../entities/background';
import Ship from '../entities/ship';
import Asteroid from '../entities/asteroid';
import Cursor from '../entities/cursor';

const vec2 = require('gl-matrix').vec2;

class MainState extends GameState {
  constructor(game) {
    super(game);

    this.ship = new Ship(this.game);

    this.entities.push(new Background(this.game, this.ship));

    for (let i = 0; i < 10; i++) {
      this.entities.push(new Asteroid(this.game, vec2.fromValues(-this.renderer.dimensions[0] / 2 + Math.random() * this.renderer.dimensions[0], -this.renderer.dimensions[1] / 2 + Math.random() * this.renderer.dimensions[1])));
    }

    this.entities.push(this.ship);
    this.entities.push(new Cursor(this.game));
  }

  update(deltaTime) {
    super.update(deltaTime);

    let cameraPosition = vec2.negate(vec2.create(), this.ship.position);
    vec2.scaleAndAdd(cameraPosition, cameraPosition, this.renderer.dimensions, 0.5);

    this.renderer.camera.position = cameraPosition;
    this.renderer.camera.calculateModelViewMatrix();
  }

  draw(deltaTime) {
    this.renderer.postProcessor.begin(true);

    super.draw(deltaTime);

    this.renderer.postProcessor.end();

    this.renderer.clear();

    super.draw(deltaTime);

    this.renderer.postProcessor.process(this.renderer.shaders.thresholdShader);

    this.renderer.shaders.blurShader.textureSizeValue = vec2.clone(this.renderer.postProcessor.downscaledDimensions);

    this.renderer.shaders.blurShader.directionValue = [1.0, 0.0];
    this.renderer.postProcessor.process(this.renderer.shaders.blurShader);

    this.renderer.shaders.blurShader.directionValue = [0.0, 1.0];
    this.renderer.postProcessor.process(this.renderer.shaders.blurShader);

    this.renderer.postProcessor.draw(this.renderer.shaders.textureShader, true);
  }
}

export default MainState;
