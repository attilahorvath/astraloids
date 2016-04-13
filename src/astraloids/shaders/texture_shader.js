'use strict';

import VertexAttribute from '../vertex_attribute';
import Shader from '../shader';

const vertexShaderSource = require('../../../shaders/texture.vert');
const fragmentShaderSource = require('../../../shaders/texture.frag');

const vertexAttributes = [
  new VertexAttribute('vertexTextureCoordinate', 2)
];

const uniforms = [
  new VertexAttribute('sampler', 1, 'UNSIGNED_BYTE')
];

class TextureShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes, uniforms);

    this.samplerValue = 0;
  }
}

export default TextureShader;
