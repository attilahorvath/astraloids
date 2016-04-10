'use strict';

const mat4 = require('gl-matrix').mat4;

import Entity from '../entity';
import BackgroundLayer from './background_layer';

class Background extends Entity {
  constructor(game) {
    super();

    let layer = new BackgroundLayer(game);

    this.children.push(layer);
  }
}

export default Background;
