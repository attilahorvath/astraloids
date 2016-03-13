'use strict';

import SimpleShader from './simple_shader';

class Renderer {
  initialize() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);

    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.simpleShader = new SimpleShader(this.gl);

    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    const vertices = [
       0.0,  0.5,  0.0,
      -0.5, -0.5,  0.0,
       0.5, -0.5,  0.0
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  draw() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(this.simpleShader.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

export default Renderer;
