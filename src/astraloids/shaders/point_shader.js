'use strict';

import vertexAttribute from '../vertex_attribute';
import Shader from '../shader';

const vertexShaderSource = require('../../../shaders/point.vert');
const fragmentShaderSource = require('../../../shaders/point.frag');

const vertexAttributes = [
  new vertexAttribute('vertexColor', 'FLOAT', 4)
];

class PointShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes, ['pointSize']);

    this.pointSizeValue = 1;
  }

  use(renderer) {
    super.use(renderer);

    renderer.gl.uniform1f(this.pointSize, this.pointSizeValue);
  }
}

export default PointShader;
