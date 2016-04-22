'use strict';

const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;

class Particle {
  constructor(velocity = vec2.create(), color = vec3.fromValues(Math.random(), Math.random(), Math.random())) {
    this.velocity = vec2.clone(velocity);
    this.color = vec3.clone(color);
  }
}

export default Particle;
