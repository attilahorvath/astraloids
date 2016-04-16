'use strict';

import VertexAttribute from '../vertex_attribute';
import Shader from '../shader';

const vertexShaderSource = require('../../../shaders/blur.vert');
const fragmentShaderSource = require('../../../shaders/blur.frag');

const vertexAttributes = [
  new VertexAttribute('vertexTextureCoordinate', 2)
];

const uniforms = [
  new VertexAttribute('sampler', 1, 'UNSIGNED_BYTE'),
  new VertexAttribute('textureSize', 2),
  new VertexAttribute('direction', 2),
  new VertexAttribute('radius', 1)
];

class BlurShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes, uniforms);

    this.samplerValue = 0;
    this.textureSizeValue = [renderer.canvas.width, renderer.canvas.height];
    this.directionValue = [1.0, 0.0];
    this.radiusValue = 1.0;
  }
}

export default BlurShader;
