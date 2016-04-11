'use strict';

const vertexShaderSource = require('../../../shaders/particle.vert');
const fragmentShaderSource = require('../../../shaders/particle.frag');

import Shader from '../shader';

class ParticleShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, ['vertexVelocity', 'vertexColor', 'timestamp'], ['currentTime', 'lifetime', 'pointSize']);

    this.currentTimeValue = 0;
    this.lifetimeValue = 100.0;
    this.pointSizeValue = 1.5;
  }

  setVertexAttributes(renderer) {
    const gl = renderer.gl;

    gl.vertexAttribPointer(this.vertexPosition, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 11, 0);
    gl.vertexAttribPointer(this.vertexVelocity, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 11, Float32Array.BYTES_PER_ELEMENT * 3);
    gl.vertexAttribPointer(this.vertexColor, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 11, Float32Array.BYTES_PER_ELEMENT * 6);
    gl.vertexAttribPointer(this.timestamp, 1, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 11, Float32Array.BYTES_PER_ELEMENT * 10);
  }

  use(renderer) {
    super.use(renderer);

    renderer.gl.uniform1f(this.currentTime, this.currentTimeValue);
    renderer.gl.uniform1f(this.lifetime, this.lifetimeValue);
    renderer.gl.uniform1f(this.pointSize, this.pointSizeValue);
  }
}

export default ParticleShader;
