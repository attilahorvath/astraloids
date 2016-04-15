'use strict';

import VertexAttribute from '../vertex_attribute';
import Shader from '../shader';

const vertexShaderSource = require('../../../shaders/desaturate.vert');
const fragmentShaderSource = require('../../../shaders/desaturate.frag');

const vertexAttributes = [
  new VertexAttribute('vertexTextureCoordinate', 2)
];

const uniforms = [
  new VertexAttribute('sampler', 1, 'UNSIGNED_BYTE'),
  new VertexAttribute('intensity', 1)
];

class DesaturateShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes, uniforms);

    this.samplerValue = 0;
    this.intensityValue = 0.5;
  }
}

export default DesaturateShader;
