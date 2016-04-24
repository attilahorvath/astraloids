'use strict';

const vec2 = require('gl-matrix').vec2;

class MouseInput {
  constructor(renderer) {
    this.canvas = renderer.canvas;

    this.recordedPosition = vec2.create();
    this.position = vec2.create();
    this.deltaPosition = vec2.create();

    this.recorderButtonsDown = {};
    this.buttonsDown = {};
    this.justPressed = {};
    this.justReleased = {};

    addEventListener('mousemove', event => {
      let boundingRectangle = this.canvas.getBoundingClientRect();

      this.recordedPosition = vec2.fromValues(event.clientX - boundingRectangle.left, event.clientY - boundingRectangle.top);
    });

    addEventListener('mousedown', event => {
      switch (event.button) {
      case 0:
        this.recorderButtonsDown['left'] = true;
        break;
      case 1:
        this.recorderButtonsDown['middle'] = true;
        break;
      case 2:
        this.recorderButtonsDown['right'] = true;
        break;
      }
    });

    addEventListener('mouseup', event => {
      switch (event.button) {
      case 0:
        delete this.recorderButtonsDown['left'];
        break;
      case 1:
        delete this.recorderButtonsDown['middle'];
        break;
      case 2:
        delete this.recorderButtonsDown['right'];
        break;
      }
    });
  }

  update() {
    let oldPosition = vec2.clone(this.position);

    this.position = vec2.clone(this.recordedPosition);
    vec2.subtract(this.deltaPosition, this.position, oldPosition);

    let oldButtonsDown = Object.assign({}, this.buttonsDown);

    this.buttonsDown = Object.assign({}, this.recorderButtonsDown);

    this.justPressed = {};

    for (let button of Object.keys(this.buttonsDown)) {
      if (!oldButtonsDown[button]) {
        this.justPressed[button] = true;
      }
    }

    this.justReleased = {};

    for (let button of Object.keys(oldButtonsDown)) {
      if (!this.buttonsDown[button]) {
        this.justReleased[button] = true;
      }
    }
  }
}

export default MouseInput;
