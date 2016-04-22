'use strict';

import Entity from '../entity';
import BackgroundLayer from './background_layer';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;

class Background extends Entity {
  constructor(game, ship, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    this.ship = ship;

    this.children.push(new BackgroundLayer(game, 500, 1.0, 1.0, position, velocity, acceleration, angle, angularVelocity, angularAcceleration));
    this.children.push(new BackgroundLayer(game, 500, 1.5, 2.0, position, velocity, acceleration, angle, angularVelocity, angularAcceleration));
    this.children.push(new BackgroundLayer(game, 500, 2.0, 3.0, position, velocity, acceleration, angle, angularVelocity, angularAcceleration));
  }

  update(game, deltaTime, transformation = mat4.create()) {
    for (let layer of this.children) {
      vec2.scaleAndAdd(layer.position, layer.position, this.ship.deltaPosition, 1.0 / layer.relativeVelocity);

      if (layer.position[0] - game.renderer.canvas.width / 2 > this.ship.position[0]) {
        layer.position[0] -= game.renderer.canvas.width;
      } else if (layer.position[0] + game.renderer.canvas.width / 2 < this.ship.position[0]) {
        layer.position[0] += game.renderer.canvas.width;
      }

      if (layer.position[1] - game.renderer.canvas.height / 2 > this.ship.position[1]) {
        layer.position[1] -= game.renderer.canvas.height;
      } else if (layer.position[1] + game.renderer.canvas.height / 2 < this.ship.position[1]) {
        layer.position[1] += game.renderer.canvas.height;
      }

      layer.calculateTransformation();
    }
  }

  drawAll(renderer, deltaTime, transformation = mat4.create()) {
    transformation = mat4.clone(transformation);
    mat4.multiply(transformation, transformation, this.transformation);

    // TODO Refactor

    for (let layer of this.children) {
      let layerPosition = vec2.clone(layer.position);

      layer.drawAll(renderer, deltaTime, transformation);

      if (this.ship.position[0] <= layer.position[0]) {
        layer.position[0] -= renderer.canvas.width;
      } else {
        layer.position[0] += renderer.canvas.width;
      }

      layer.calculateTransformation();

      layer.drawAll(renderer, deltaTime, transformation);

      layer.position[0] = layerPosition[0];

      if (this.ship.position[1] <= layer.position[1]) {
        layer.position[1] -= renderer.canvas.height;
      } else {
        layer.position[1] += renderer.canvas.height;
      }

      layer.calculateTransformation();

      layer.drawAll(renderer, deltaTime, transformation);

      layer.position[1] = layerPosition[1];

      if (this.ship.position[0] <= layer.position[0]) {
        layer.position[0] -= renderer.canvas.width;
        if (this.ship.position[1] <= layer.position[1]) {
          layer.position[1] -= renderer.canvas.height;
        } else {
          layer.position[1] += renderer.canvas.height;
        }
      } else {
        layer.position[0] += renderer.canvas.width;
        if (this.ship.position[1] <= layer.position[1]) {
          layer.position[1] -= renderer.canvas.height;
        } else {
          layer.position[1] += renderer.canvas.height;
        }
      }

      layer.calculateTransformation();

      layer.drawAll(renderer, deltaTime, transformation);

      layer.position = vec2.clone(layerPosition);

      layer.calculateTransformation();
    }
  }
}

export default Background;
