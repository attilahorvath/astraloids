'use strict';

const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;

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

function findEar(vertices) {
  if (vertices.length <= 3) {
    return [0, 1, 2];
  }

  for (let index = 0; index < vertices.length; index++) {
    let previousIndex = (vertices.length + index - 1) % vertices.length;
    let nextIndex = (index + 1) % vertices.length;

    let previous = vertices[previousIndex];
    let current = vertices[index];
    let next = vertices[nextIndex];

    let toCurrent = vec2.subtract(vec2.create(), current, previous);
    let toNext = vec2.subtract(vec2.create(), next, previous);
    let cross = vec2.cross(vec3.create(), toCurrent, toNext);

    if (cross[2] > 0) {
      let ear = true;

      for (let i = 0; i < vertices.length; i++) {
        if (i !== previousIndex && i !== index && i !== nextIndex && pointInTriangle(vertices[i], previous, current, next)) {
          ear = false;
          break;
        }
      }

      if (ear) {
        return [previousIndex, index, nextIndex];
      }
    }
  }

  return null;
}

function triangulate(vertices) {
  let remainingVertices = vertices.slice();

  let triangles = [];

  while (remainingVertices.length > 2) {
    let ear = findEar(remainingVertices);

    if (ear) {
      triangles.push(remainingVertices[ear[0]], remainingVertices[ear[1]], remainingVertices[ear[2]]);

      remainingVertices.splice(ear[1], 1);
    } else {
      return null;
    }
  }

  //let triangleIndices = triangles.map(triangle => vertices.indexOf(triangle));

  //return triangleIndices;

  return triangles;
}

export { pointInTriangle, findEar, triangulate };
