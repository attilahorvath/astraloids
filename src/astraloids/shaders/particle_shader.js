'use strict';

import VertexAttribute from '../vertex_attribute';
import Shader from '../shader';

const vertexShaderSource = require('../../../shaders/particle.vert');
const fragmentShaderSource = require('../../../shaders/particle.frag');

const vertexAttributes = [
  new VertexAttribute('vertexVelocity', 'FLOAT', 3),
  new VertexAttribute('vertexColor', 'FLOAT', 4),
  new VertexAttribute('timestamp', 'FLOAT', 1)
];

class ParticleShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes, ['currentTime', 'lifetime', 'pointSize']);

    this.currentTimeValue = 0;
    this.lifetimeValue = 100.0;
    this.pointSizeValue = 1.5;
  }

  use(renderer) {
    super.use(renderer);

    renderer.gl.uniform1f(this.currentTime, this.currentTimeValue);
    renderer.gl.uniform1f(this.lifetime, this.lifetimeValue);
    renderer.gl.uniform1f(this.pointSize, this.pointSizeValue);
  }
}

export default ParticleShader;
