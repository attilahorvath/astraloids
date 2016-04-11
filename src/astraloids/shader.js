'use strict';

const defaultVertexAttributes = ['vertexPosition'];
const defaultUniforms = ['modelViewMatrix', 'projectionMatrix'];

class Shader {
  constructor(renderer, vertexShaderSource, fragmentShaderSource, vertexAttributes = [], uniforms = []) {
    const gl = renderer.gl;

    this.vertexAttributes = defaultVertexAttributes.concat(vertexAttributes);
    this.uniforms = defaultUniforms.concat(uniforms);

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

    for (let vertexAttribute of this.vertexAttributes) {
      this[vertexAttribute] = gl.getAttribLocation(this.shaderProgram, vertexAttribute);
    }

    for (let uniform of this.uniforms) {
      this[uniform] = gl.getUniformLocation(this.shaderProgram, uniform);
    }
  }

  setVertexAttributes(renderer) {}

  use(renderer) {
    const gl = renderer.gl;

    gl.useProgram(this.shaderProgram);

    for (let vertexAttribute of this.vertexAttributes) {
      gl.enableVertexAttribArray(this[vertexAttribute]);
    }
  }
}

export default Shader;