'use strict';

class KeyboardInput {
  constructor() {
    this.recordedKeysDown = {};
    this.keysDown = {};
    this.justPressed = {};
    this.justReleased = {};

    addEventListener('keydown', event => {
      this.recordedKeysDown[event.keyCode] = true;
    });

    addEventListener('keyup', event => {
      delete this.recordedKeysDown[event.keyCode];
    });
  }

  update() {
    let oldKeysDown = Object.assign({}, this.keysDown);

    this.keysDown = Object.assign({}, this.recordedKeysDown);

    this.justPressed = {};

    for (let key of Object.keys(this.keysDown)) {
      if (!oldKeysDown[key]) {
        this.justPressed[key] = true;
      }
    }

    this.justReleased = {};

    for (let key of Object.keys(oldKeysDown)) {
      if (!this.keysDown[key]) {
        this.justReleased[key] = true;
      }
    }
  }
}

export default KeyboardInput;
