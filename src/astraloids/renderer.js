'use strict';

import SimpleShader from './shaders/simple_shader';
import PointShader from './shaders/point_shader';
import ParticleShader from './shaders/particle_shader';
import TextureShader from './shaders/texture_shader';

import Camera from './camera';

const mat4 = require('gl-matrix').mat4;
const vec4 = require('gl-matrix').vec4;

const width = 1024;
const height = 768;

class Renderer {
  initialize() {
    this.canvas = document.createElement('canvas');

    this.canvas.width = width;
    this.canvas.height = height;

    document.body.appendChild(this.canvas);

    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

    this.gl.viewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendEquation(this.gl.FUNC_ADD);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.projectionMatrix = mat4.create();
    mat4.ortho(this.projectionMatrix, 0, this.canvas.clientWidth, this.canvas.clientHeight, 0, -1, 1);

    this.shaders = {
      simpleShader: new SimpleShader(this),
      pointShader: new PointShader(this),
      particleShader: new ParticleShader(this),
      textureShader: new TextureShader(this)
    };

    this.lastShader = null;

    this.camera = new Camera(this.canvas.width / 2, this.canvas.height / 2);
  }

  createVertexBuffer(vertices) {
    let vertexBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    return vertexBuffer;
  }

  fillVertexBuffer(vertexBuffer, vertices) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  draw(shader, transformationMatrix, vertexBuffer, mode, count, skipCamera = false) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

    shader.setVertexAttributes(this);

    let modelViewMatrix = mat4.clone(this.camera.modelViewMatrix);
    mat4.multiply(modelViewMatrix, modelViewMatrix, transformationMatrix);

    shader.modelViewMatrixValue = skipCamera ? mat4.create() : modelViewMatrix;
    shader.projectionMatrixValue = skipCamera ? mat4.create() : this.projectionMatrix;

    shader.use(this);

    this.gl.drawArrays(mode, 0, count);
  }
}

export default Renderer;
