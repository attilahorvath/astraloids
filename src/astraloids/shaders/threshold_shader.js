'use strict';

import VertexAttribute from '../vertex_attribute';
import Shader from '../shader';

const vertexShaderSource = require('../../../shaders/threshold.vert');
const fragmentShaderSource = require('../../../shaders/threshold.frag');

const vertexAttributes = [
  new VertexAttribute('vertexTextureCoordinate', 2)
];

const uniforms = [
  new VertexAttribute('sampler', 1, 'UNSIGNED_BYTE'),
  new VertexAttribute('threshold', 1)
];

class ThresholdShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes, uniforms);

    this.samplerValue = 0;
    this.thresholdValue = 0.1;
  }
}

export default ThresholdShader;
