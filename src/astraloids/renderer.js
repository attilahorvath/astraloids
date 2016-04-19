'use strict';

import SimpleShader from './shaders/simple_shader';
import PointShader from './shaders/point_shader';
import ParticleShader from './shaders/particle_shader';
import TextureShader from './shaders/texture_shader';
import DesaturateShader from './shaders/desaturate_shader';
import BlurShader from './shaders/blur_shader';
import ThresholdShader from './shaders/threshold_shader';

import Camera from './camera';
import PostProcessor from './post_processor';

const mat4 = require('gl-matrix').mat4;
const vec4 = require('gl-matrix').vec4;

const width = 1024;
const height = 768;

class Renderer {
  constructor() {
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
      textureShader: new TextureShader(this),
      desaturateShader: new DesaturateShader(this),
      blurShader: new BlurShader(this),
      thresholdShader: new ThresholdShader(this)
    };

    this.viewportWidth = width;
    this.viewportHeight = height;

    this.lastVertexBuffer = null;
    this.lastShaderProgram = null;

    this.enabledVertexAttributeArrays = {};
    this.uniformValues = new Map();

    this.camera = new Camera(this.canvas.width / 2, this.canvas.height / 2);

    this.postProcessor = new PostProcessor(this);
  }

  createVertexBuffer(vertices) {
    let vertexBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    return vertexBuffer;
  }

  fillVertexBuffer(vertexBuffer, vertices) {
    if (vertexBuffer !== this.lastVertexBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

      this.lastVertexBuffer = vertexBuffer;
    }

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
  }

  setSize(width, height) {
    if (width !== this.viewportWidth || height !== this.viewportHeight) {
      this.gl.viewport(0, 0, width, height);

      this.viewportWidth = width;
      this.viewportHeight = height;
    }
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  useShaderProgram(shaderProgram) {
    if (shaderProgram !== this.lastShaderProgram) {
      this.gl.useProgram(shaderProgram);

      this.lastShaderProgram = shaderProgram;
    }
  }

  enableVertexAttributeArray(index) {
    if (!this.enabledVertexAttributeArrays[index]) {
      this.gl.enableVertexAttribArray(index);

      this.enabledVertexAttributeArrays[index] = true;
    }
  }

  setUniformValue(vertexAttribute, location, value) {
    if (this.uniformValues.get(location) !== value) {
      vertexAttribute.setUniformValue(this.gl, location, value);

      this.uniformValues.set(location, value);
    }
  }

  draw(shader, transformationMatrix, vertexBuffer, mode, count, skipCamera = false) {
    if (vertexBuffer !== this.lastVertexBuffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

      this.lastVertexBuffer = vertexBuffer;
    }

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
