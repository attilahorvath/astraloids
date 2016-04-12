'use strict';

import VertexAttribute from '../vertex_attribute';
import Shader from '../shader';

const vertexShaderSource = require('../../../shaders/particle.vert');
const fragmentShaderSource = require('../../../shaders/particle.frag');

const vertexAttributes = [
  new VertexAttribute('vertexVelocity'),
  new VertexAttribute('vertexColor', 4),
  new VertexAttribute('timestamp', 1)
];

const uniforms = [
  new VertexAttribute('currentTime', 1),
  new VertexAttribute('lifetime', 1),
  new VertexAttribute('pointSize', 1)
];

class ParticleShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes, uniforms);

    this.currentTimeValue = 0;
    this.lifetimeValue = 100.0;
    this.pointSizeValue = 1.5;
  }
}

export default ParticleShader;
