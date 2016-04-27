'use strict';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec3 = require('gl-matrix').vec3;

class Entity {
  constructor(game, position = vec2.create(), velocity = vec2.create(), acceleration = vec2.create(), angle = 0.0, angularVelocity = 0.0, angularAcceleration = 0.0) {
    this.position = vec2.clone(position);
    this.velocity = vec2.clone(velocity);
    this.acceleration = vec2.clone(acceleration);

    this.deltaPosition = vec2.create();
    this.deltaVelocity = vec2.create();

    this.angle = angle;
    this.angularVelocity = angularVelocity;
    this.angularAcceleration = angularAcceleration;

    this.deltaAngle = 0.0;
    this.deltaAngularVelocity = 0.0;

    this.calculateTransformation();

    this.alive = true;
    this.children = [];
  }

  updateAll(game, deltaTime, transformation = mat4.create()) {
    transformation = mat4.clone(transformation);
    mat4.multiply(transformation, transformation, this.transformation);

    for (let child of this.children) {
      child.updateAll(game, deltaTime, transformation);
    }

    this.update(game, deltaTime, transformation);
  }

  update(game, deltaTime) {
    this.integrateValues(deltaTime);
    this.calculateTransformation();
  }

  drawAll(renderer, deltaTime, transformation = mat4.create()) {
    transformation = mat4.clone(transformation);
    mat4.multiply(transformation, transformation, this.transformation);

    for (let child of this.children) {
      child.drawAll(renderer, deltaTime, transformation);
    }

    this.draw(renderer, deltaTime, transformation);
  }

  draw() {}

  integrateValues(deltaTime) {
    let oldPosition = vec2.clone(this.position);
    let oldVelocity = vec2.clone(this.velocity);

    vec2.scaleAndAdd(this.velocity, this.velocity, this.acceleration, deltaTime);
    vec2.scaleAndAdd(this.position, this.position, this.velocity, deltaTime);

    vec2.subtract(this.deltaPosition, this.position, oldPosition);
    vec2.subtract(this.deltaVelocity, this.velocity, oldVelocity);

    let oldAngle = this.angle;
    let oldAngularVelocity = this.angularVelocity;

    this.angularVelocity += this.angularAcceleration * deltaTime;
    this.angle += this.angularVelocity * deltaTime;

    this.deltaAngle = this.angle - oldAngle;
    this.deltaAngularVelocity = this.angularVelocity - oldAngularVelocity;
  }

  calculateTransformation() {
    let translation = vec3.fromValues(this.position[0], this.position[1], 0.0);

    this.transformation = mat4.create();
    mat4.translate(this.transformation, this.transformation, translation);
    mat4.rotateZ(this.transformation, this.transformation, this.angle);
  }

  containsPointInAll(point, transformation = mat4.create()) {
    transformation = mat4.clone(transformation);
    mat4.multiply(transformation, transformation, this.transformation);

    return this.children.some(child => child.containsPoint(point, transformation)) || this.containsPoint(point, transformation);
  }

  containsPoint() {
    return false;
  }
}

export default Entity;
