'use strict';

const vertexShaderSource = require('../../shaders/simple.vert');
const fragmentShaderSource = require('../../shaders/simple.frag');

class SimpleShader {
  constructor(gl) {
    this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(this.vertexShader, vertexShaderSource());
    gl.compileShader(this.vertexShader);

    if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(this.vertexShader));
    }

    this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this.fragmentShader, fragmentShaderSource());
    gl.compileShader(this.fragmentShader);

    if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(this.vertexShader));
    }

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, this.vertexShader);
    gl.attachShader(this.shaderProgram, this.fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
      alert(gl.getProgramInfoLog(this.shaderProgram));
    }

    this.modelViewMatrix = gl.getUniformLocation(this.shaderProgram, 'modelViewMatrix');

    this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'projectionMatrix');

    this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'vertexPosition');
    gl.enableVertexAttribArray(this.vertexPosition);

    this.vertexColor = gl.getAttribLocation(this.shaderProgram, 'vertexColor');
    gl.enableVertexAttribArray(this.vertexColor);

    gl.useProgram(this.shaderProgram);
  }
}

export default SimpleShader;
