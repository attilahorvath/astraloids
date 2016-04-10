'use strict';

const vertexShaderSource = require('../../../shaders/simple.vert');
const fragmentShaderSource = require('../../../shaders/simple.frag');

import Shader from '../shader';

class SimpleShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, ['vertexColor']);
  }
}

export default SimpleShader;
