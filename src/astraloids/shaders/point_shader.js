'use strict';

import VertexAttribute from '../vertex_attribute';
import Shader from '../shader';

const vertexShaderSource = require('../../../shaders/point.vert');
const fragmentShaderSource = require('../../../shaders/point.frag');

const vertexAttributes = [
  new VertexAttribute('vertexColor', 4)
];

const uniforms = [
  new VertexAttribute('pointSize', 1)
];

class PointShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes, uniforms);

    this.pointSizeValue = 1;
  }
}

export default PointShader;
