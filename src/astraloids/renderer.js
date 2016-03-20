'use strict';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec4 = require('gl-matrix').vec4;

import SimpleShader from './simple_shader';
import ParticleShader from './particle_shader';

class Renderer {
  initialize() {
    this.canvas = document.createElement('canvas');

    this.canvas.width = 320;
    this.canvas.height = 240;

    document.body.appendChild(this.canvas);

    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

    this.gl.viewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendEquation(this.gl.FUNC_ADD);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    // this.simpleShader = new SimpleShader(this.gl);
    this.particleShader = new ParticleShader(this.gl);

    this.translationVector = vec4.fromValues(160.0, 120.0, 0.0, 1.0);

    this.modelViewMatrix = mat4.create();
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.translationVector);

    // this.gl.uniformMatrix4fv(this.simpleShader.modelViewMatrix, false, this.modelViewMatrix);
    this.gl.uniformMatrix4fv(this.particleShader.modelViewMatrix, false, this.modelViewMatrix);

    this.projectionMatrix = mat4.create();
    mat4.ortho(this.projectionMatrix, 0, this.canvas.clientWidth, this.canvas.clientHeight, 0, -1, 1);

    // this.gl.uniformMatrix4fv(this.simpleShader.projectionMatrix, false, this.projectionMatrix);
    this.gl.uniformMatrix4fv(this.particleShader.projectionMatrix, false, this.projectionMatrix);

    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    // const vertices = [
    //     0.0, -50.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    //   -50.0,  50.0, 0.0, 0.0, 1.0, 0.0, 1.0,
    //    50.0,  50.0, 0.0, 0.0, 0.0, 1.0, 1.0
    // ];
    let vertices = [];

    for (let i = 0; i < 10000; i++) {
      let velocity = vec2.create();
      vec2.random(velocity);
      vec2.scale(velocity, velocity, Math.random() * 2.0);

      vertices.push(0.0, 0.0, 0.0, velocity[0], velocity[1], 0.0, Math.random(), Math.random(), Math.random(), 1.0);
    }

    // const vertices = [
    //   0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    //   0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
    //   0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0
    // ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    this.angle = 0.0;

    this.currentTime = 0.0;
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  draw(deltaTime) {
    // this.angle += deltaTime * 0.001;

    this.currentTime += deltaTime * 0.01;

    this.modelViewMatrix = mat4.create();
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, this.translationVector);
    mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, this.angle);

    // this.gl.uniformMatrix4fv(this.simpleShader.modelViewMatrix, false, this.modelViewMatrix);
    this.gl.uniformMatrix4fv(this.particleShader.modelViewMatrix, false, this.modelViewMatrix);

    this.gl.uniform1f(this.particleShader.currentTime, this.currentTime);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    // this.gl.vertexAttribPointer(this.simpleShader.vertexPosition, 3, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);
    // this.gl.vertexAttribPointer(this.simpleShader.vertexColor, 4, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 3);
    this.gl.vertexAttribPointer(this.particleShader.vertexPosition, 3, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 10, 0);
    this.gl.vertexAttribPointer(this.particleShader.vertexVelocity, 3, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 10, Float32Array.BYTES_PER_ELEMENT * 3);
    this.gl.vertexAttribPointer(this.particleShader.vertexColor, 4, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 10, Float32Array.BYTES_PER_ELEMENT * 6);

    this.gl.drawArrays(this.gl.POINTS, 0, 10000);
  }
}

export default Renderer;
