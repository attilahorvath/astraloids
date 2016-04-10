'use strict';

const vertexShaderSource = require('../../../shaders/simple.vert');
const fragmentShaderSource = require('../../../shaders/simple.frag');

import Shader from '../shader';

class SimpleShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, ['vertexColor']);
  }

  setVertexAttributes(renderer) {
    const gl = renderer.gl;

    gl.vertexAttribPointer(this.vertexPosition, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);
    gl.vertexAttribPointer(this.vertexColor, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 3);
  }
}

export default SimpleShader;
