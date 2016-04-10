'use strict';

const mat4 = require('gl-matrix').mat4;

import Entity from '../entity';
import BackgroundLayer from './background_layer';

class Background extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    this.children.push(new BackgroundLayer(game, 2000, 1.0, 0.7, x, y, angle));
    this.children.push(new BackgroundLayer(game, 2000, 1.5, 0.8, x, y, angle));
    this.children.push(new BackgroundLayer(game, 2000, 2.0, 0.9, x, y, angle));
  }
}

export default Background;
