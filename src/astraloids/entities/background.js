'use strict';

const mat4 = require('gl-matrix').mat4;

import Entity from '../entity';
import BackgroundLayer from './background_layer';

class Background extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.shipX = game.ship.x;
    this.shipY = game.ship.y;

    this.children.push(new BackgroundLayer(game, 500, 1.0, 0.7, x, y, angle));
    this.children.push(new BackgroundLayer(game, 500, 1.5, 0.8, x, y, angle));
    this.children.push(new BackgroundLayer(game, 500, 2.0, 0.9, x, y, angle));
  }

  update(game, deltaTime) {
    this.shipX = game.ship.x;
    this.shipY = game.ship.y;
  }

  drawAll(renderer, transformationMatrix = mat4.create()) {
    transformationMatrix = mat4.clone(transformationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, this.transformationMatrix);

    // TODO Refactor

    for (let layer of this.children) {
      let layerX = Math.floor(this.shipX / renderer.canvas.width) * renderer.canvas.width;
      let layerY = Math.floor(this.shipY / renderer.canvas.height) * renderer.canvas.height;

      layer.x = layerX;
      layer.y = layerY;

      layer.calculateTransformationMatrix();
      layer.drawAll(renderer, transformationMatrix);

      if (this.shipX <= layer.x + renderer.canvas.width / 2) {
        layer.x -= renderer.canvas.width;
      } else {
        layer.x += renderer.canvas.width;
      }

      layer.calculateTransformationMatrix();
      layer.drawAll(renderer, transformationMatrix);

      layer.x = layerX;

      if (this.shipY <= layer.y + renderer.canvas.height / 2) {
        layer.y -= renderer.canvas.height;
      } else {
        layer.y += renderer.canvas.height;
      }

      layer.calculateTransformationMatrix();
      layer.drawAll(renderer, transformationMatrix);

      layer.y = layerY;

      if (this.shipX <= layer.x + renderer.canvas.width / 2) {
        layer.x -= renderer.canvas.width;
        if (this.shipY <= layer.y + renderer.canvas.height / 2) {
          layer.y -= renderer.canvas.height;
        } else {
          layer.y += renderer.canvas.height;
        }
      } else {
        layer.x += renderer.canvas.width;
        if (this.shipY <= layer.y + renderer.canvas.height / 2) {
          layer.y -= renderer.canvas.height;
        } else {
          layer.y += renderer.canvas.height;
        }
      }

      layer.calculateTransformationMatrix();
      layer.drawAll(renderer, transformationMatrix);
    }
  }
}

export default Background;