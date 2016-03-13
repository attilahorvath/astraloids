'use strict';

const vertexShaderSource = require('../../shaders/simple.vert');
const fragmentShaderSource = require('../../shaders/simple.frag');

class SimpleShader {
  constructor(gl) {
    this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(this.vertexShader, vertexShaderSource());
    gl.compileShader(this.vertexShader);

    this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this.fragmentShader, fragmentShaderSource());
    gl.compileShader(this.fragmentShader);

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, this.vertexShader);
    gl.attachShader(this.shaderProgram, this.fragmentShader);
    gl.linkProgram(this.shaderProgram);

    this.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, 'vertexPosition');
    gl.enableVertexAttribArray(this.vertexPositionAttribute);

    gl.useProgram(this.shaderProgram);
  }
}

export default SimpleShader;
