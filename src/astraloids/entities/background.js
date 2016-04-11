'use strict';

const mat4 = require('gl-matrix').mat4;

import Entity from '../entity';
import BackgroundLayer from './background_layer';

class Background extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.shipX = game.ship.x;
    this.shipY = game.ship.y;

    this.children.push(new BackgroundLayer(game, 500, 1.0, 0.0, x, y, angle));
    this.children.push(new BackgroundLayer(game, 500, 1.5, 0.5, x, y, angle));
    this.children.push(new BackgroundLayer(game, 500, 2.0, 1.0, x, y, angle));
  }

  update(game, deltaTime, transformationMatrix = mat4.create()) {
    this.shipX = game.ship.x;
    this.shipY = game.ship.y;
  }

  drawAll(renderer, deltaTime, transformationMatrix = mat4.create()) {
    transformationMatrix = mat4.clone(transformationMatrix);
    mat4.multiply(transformationMatrix, transformationMatrix, this.transformationMatrix);

    // TODO Refactor

    for (let layer of this.children) {
      let offsetX = (this.shipX % renderer.canvas.width) * layer.relativeVelocity;
      let offsetY = (this.shipY % renderer.canvas.height) * layer.relativeVelocity;

      let layerX = Math.floor((this.shipX + offsetX + renderer.canvas.width / 2) / renderer.canvas.width) * renderer.canvas.width - offsetX;
      let layerY = Math.floor((this.shipY + offsetY + renderer.canvas.height / 2) / renderer.canvas.height) * renderer.canvas.height - offsetY;

      layer.x = layerX;
      layer.y = layerY;

      layer.calculateTransformationMatrix();
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
    }
  }
}

export default Background;
