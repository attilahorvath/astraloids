'use strict';

const vertexShaderSource = require('../../../shaders/point.vert');
const fragmentShaderSource = require('../../../shaders/point.frag');

import Shader from '../shader';

class PointShader extends Shader {
  constructor(renderer) {
    super(renderer, vertexShaderSource, fragmentShaderSource, ['vertexColor'], ['pointSize']);

    this.pointSizeValue = 1;
  }

  setVertexAttributes(renderer) {
    const gl = renderer.gl;

    gl.vertexAttribPointer(this.vertexPosition, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);
    gl.vertexAttribPointer(this.vertexColor, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 3);
  }

  use(renderer) {
    super.use(renderer);

    renderer.gl.uniform1f(this.pointSize, this.pointSizeValue);
  }
}

export default PointShader;
