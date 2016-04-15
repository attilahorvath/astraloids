'use strict';

const mat4 = require('gl-matrix').mat4;

class PostProcessor {
  constructor(renderer) {
    this.renderer = renderer;

    this.textures = [
      this.prepareTexture(),
      this.prepareTexture()
    ];

    this.framebuffers = this.textures.map(texture => this.prepareFramebuffer(texture));

    this.lastFramebuffer = 0;

    const vertices = [
       1,  1, 0, 1, 1,
      -1,  1, 0, 0, 1,
      -1, -1, 0, 0, 0,
       1,  1, 0, 1, 1,
      -1, -1, 0, 0, 0,
       1, -1, 0, 1, 0
    ];

    this.vertexBuffer = this.renderer.createVertexBuffer(vertices);

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);
  }

  prepareTexture() {
    let texture = this.renderer.gl.createTexture();

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, texture);

    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_MIN_FILTER, this.renderer.gl.LINEAR);
    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_WRAP_S, this.renderer.gl.CLAMP_TO_EDGE);
    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_WRAP_T, this.renderer.gl.CLAMP_TO_EDGE);

    this.renderer.gl.texImage2D(this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA, 320, 240, 0, this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE, null);

    return texture;
  }

  prepareFramebuffer(texture) {
    let framebuffer = this.renderer.gl.createFramebuffer();

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, framebuffer);

    this.renderer.gl.framebufferTexture2D(this.renderer.gl.FRAMEBUFFER, this.renderer.gl.COLOR_ATTACHMENT0, this.renderer.gl.TEXTURE_2D, texture, 0);

    return framebuffer;
  }

  begin() {
    for (let framebuffer of this.framebuffers) {
      this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, framebuffer);
      this.renderer.clear();
    }

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.framebuffers[0]);

    this.lastFramebuffer = 0;
  }

  end() {
    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);
  }

  process(shader) {
    let currentFramebuffer = (this.lastFramebuffer + 1) % this.framebuffers.length;

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.framebuffers[currentFramebuffer]);

    this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.textures[this.lastFramebuffer]);

    this.renderer.draw(shader, mat4.create(), this.vertexBuffer, this.renderer.gl.TRIANGLES, 6, true);

    this.lastFramebuffer = currentFramebuffer;

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);
  }

  draw(shader) {
    this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.textures[this.lastFramebuffer]);

    this.renderer.draw(shader, mat4.create(), this.vertexBuffer, this.renderer.gl.TRIANGLES, 6, true);

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
  }
}

export default PostProcessor;
