'use strict';

import VertexAttribute from './vertex_attribute';

class MatrixVertexAttribute extends VertexAttribute {
  constructor(name, size = 4) {
    super(name, size * size);

    this.size = size;

    this.uniformMethod = `uniformMatrix${this.size}fv`;
  }

  setUniform(gl, location, value) {
    gl.uniformMatrix4fv(location, false, value);
  }
}

export default MatrixVertexAttribute;
