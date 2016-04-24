'use strict';

const vec2 = require('gl-matrix').vec2;

function pointInTriangle(point, a, b, c) {
  let v0 = vec2.subtract(vec2.create(), c, a);
  let v1 = vec2.subtract(vec2.create(), b, a);
  let v2 = vec2.subtract(vec2.create(), point, a);

  let dot00 = vec2.dot(v0, v0);
  let dot01 = vec2.dot(v0, v1);
  let dot02 = vec2.dot(v0, v2);
  let dot11 = vec2.dot(v1, v1);
  let dot12 = vec2.dot(v1, v2);

  let invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
  let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return u >= 0.0 && v >= 0.0 && u + v < 1.0;
}

export { pointInTriangle };
