'use strict';

class GameState {
  constructor(game) {
    this.game = game;
    this.renderer = this.game.renderer;

    this.entities = [];

    this.nextState = this;
  }

  update(deltaTime) {
    for (let entity of this.entities) {
      entity.updateAll(this.game, deltaTime);
    }
  }

  draw(deltaTime) {
    for (let entity of this.entities) {
      entity.drawAll(this.renderer, deltaTime);
    }
  }
}

export default GameState;
