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

    for (let i = this.entities.length - 1; i >= 0; i--) {
      if (!this.entities[i].alive) {
        this.entities.splice(i, 1);
      }
    }
  }

  draw(deltaTime) {
    for (let entity of this.entities) {
      entity.drawAll(this.renderer, deltaTime);
    }
  }
}

export default GameState;
