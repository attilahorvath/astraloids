'use strict';

const mat4 = require('gl-matrix').mat4;

import Entity from '../entity';
import BackgroundLayer from './background_layer';

class Background extends Entity {
  constructor(game, x = 0.0, y = 0.0, angle = 0.0) {
    super(game, x, y, angle);

    let layer = new BackgroundLayer(game, x, y, angle);

    this.children.push(layer);
  }
}

export default Background;
