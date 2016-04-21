'use strict';

class Particle {
  constructor(velocity, red = Math.random(), green = Math.random(), blue = Math.random()) {
    this.velocity = velocity;
    this.red = red;
    this.green = green;
    this.blue = blue;
  }
}

export default Particle;
