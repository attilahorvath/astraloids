'use strict';

import Entity from '../entity';
import BackgroundLayer from './background_layer';

const mat4 = require('gl-matrix').mat4;

class Background extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.shipX = game.ship.x;
    this.shipY = game.ship.y;

    this.deltaShipX = 0;
    this.deltaShipY = 0;

    this.children.push(new BackgroundLayer(game, 500, 1.0, 0.0, x, y, angle));
    this.children.push(new BackgroundLayer(game, 500, 1.5, 1.0, x, y, angle));
    this.children.push(new BackgroundLayer(game, 500, 2.0, 2.0, x, y, angle));
  }

  update(game, deltaTime, transformationMatrix = mat4.create()) {
    this.deltaShipX = game.ship.x - this.shipX;
    this.deltaShipY = game.ship.y - this.shipY;

    this.shipX = game.ship.x;
    this.shipY = game.ship.y;

    for (let layer of this.children) {
      layer.x -= this.deltaShipX * layer.relativeVelocity;
      layer.y -= this.deltaShipY * layer.relativeVelocity;

      if (layer.x - game.renderer.canvas.width / 2 > game.ship.x) {
        layer.x -= game.renderer.canvas.width;
      } else if (layer.x + game.renderer.canvas.width / 2 < game.ship.x) {
        layer.x += game.renderer.canvas.width;
      }

      if (layer.y - game.renderer.canvas.height / 2 > game.ship.y) {
        layer.y -= game.renderer.canvas.height;
      } else if (layer.y + game.renderer.canvas.height / 2 < game.ship.y) {
        layer.y += game.renderer.canvas.height;
      }

      layer.calculateTransformationMatrix();
    }
  }

  drawAll(renderer, deltaTime, transformationMatrix = mat4.create()) {
    transformationMatrix = mat4.clone(transformationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, this.transformationMatrix);

    // TODO Refactor

    for (let layer of this.children) {
      let layerX = layer.x;
      let layerY = layer.y;

      layer.drawAll(renderer, deltaTime, transformationMatrix);

      if (this.shipX <= layer.x) {
        layer.x -= renderer.canvas.width;
      } else {
        layer.x += renderer.canvas.width;
      }

      layer.calculateTransformationMatrix();

      layer.drawAll(renderer, deltaTime, transformationMatrix);

      layer.x = layerX;

      if (this.shipY <= layer.y) {
        layer.y -= renderer.canvas.height;
      } else {
        layer.y += renderer.canvas.height;
      }

      layer.calculateTransformationMatrix();

      layer.drawAll(renderer, deltaTime, transformationMatrix);

      layer.y = layerY;

      if (this.shipX <= layer.x) {
        layer.x -= renderer.canvas.width;
        if (this.shipY <= layer.y) {
          layer.y -= renderer.canvas.height;
        } else {
          layer.y += renderer.canvas.height;
        }
      } else {
        layer.x += renderer.canvas.width;
        if (this.shipY <= layer.y) {
          layer.y -= renderer.canvas.height;
        } else {
          layer.y += renderer.canvas.height;
        }
      }

      layer.calculateTransformationMatrix();

      layer.drawAll(renderer, deltaTime, transformationMatrix);

      layer.x = layerX;
      layer.y = layerY;

      layer.calculateTransformationMatrix();
    }
  }
}

export default Background;
