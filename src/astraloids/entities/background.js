'use strict';

import Entity from '../entity';
import BackgroundLayer from './background_layer';

const vec2 = require('gl-matrix').vec2;

class Background extends Entity {
  constructor(game, ship, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    super(game, position, velocity, acceleration, angle, angularVelocity, angularAcceleration);

    this.ship = ship;

    this.children.push(new BackgroundLayer(game, this, 500, 1.0, 1.0, position, velocity, acceleration, angle, angularVelocity, angularAcceleration));
    this.children.push(new BackgroundLayer(game, this, 500, 1.5, 2.0, position, velocity, acceleration, angle, angularVelocity, angularAcceleration));
    this.children.push(new BackgroundLayer(game, this, 500, 2.0, 3.0, position, velocity, acceleration, angle, angularVelocity, angularAcceleration));
  }
}

export default Background;
