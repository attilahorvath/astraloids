'use strict';

class KeyboardInput {
  constructor() {
    this.keysDown = {};

    addEventListener('keydown', event => {
      this.keysDown[event.keyCode] = true;
    });

    addEventListener('keyup', event => {
      delete this.keysDown[event.keyCode];
    });
  }
}

export default KeyboardInput;
