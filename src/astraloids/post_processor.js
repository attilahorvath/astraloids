'use strict';

const mat4 = require('gl-matrix').mat4;

const downscaleFactor = 4;

class PostProcessor {
  constructor(renderer) {
    this.renderer = renderer;

    this.textures = [
      this.prepareTexture(this.renderer.canvas.width, this.renderer.canvas.height),
      this.prepareTexture(this.renderer.canvas.width, this.renderer.canvas.height)
    ];

    this.framebuffers = this.textures.map(texture => this.prepareFramebuffer(texture));

    this.downscaledTextures = [
      this.prepareTexture(this.renderer.canvas.width / downscaleFactor, this.renderer.canvas.height / downscaleFactor),
      this.prepareTexture(this.renderer.canvas.width / downscaleFactor, this.renderer.canvas.height / downscaleFactor)
    ];

    this.downscaledFramebuffers = this.downscaledTextures.map(texture => this.prepareFramebuffer(texture));

    this.lastFramebuffer = 0;
    this.downscaled = false;

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

  prepareTexture(width, height) {
    let texture = this.renderer.gl.createTexture();

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, texture);

    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_MIN_FILTER, this.renderer.gl.LINEAR);
    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_WRAP_S, this.renderer.gl.CLAMP_TO_EDGE);
    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_WRAP_T, this.renderer.gl.CLAMP_TO_EDGE);

    this.renderer.gl.texImage2D(this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA, width, height, 0, this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE, null);

    return texture;
  }

  prepareFramebuffer(texture) {
    let framebuffer = this.renderer.gl.createFramebuffer();

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, framebuffer);

    this.renderer.gl.framebufferTexture2D(this.renderer.gl.FRAMEBUFFER, this.renderer.gl.COLOR_ATTACHMENT0, this.renderer.gl.TEXTURE_2D, texture, 0);

    return framebuffer;
  }

  begin(downscaled = false) {
    this.downscaled = downscaled;

    if (this.downscaled) {
      this.renderer.setSize(this.renderer.canvas.width / downscaleFactor, this.renderer.canvas.height / downscaleFactor);
    }

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, (this.downscaled ? this.downscaledFramebuffers : this.framebuffers)[0]);

    this.renderer.clear();

    this.lastFramebuffer = 0;
  }

  end() {
    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);

    if (this.downscaled) {
      this.renderer.setSize(this.renderer.canvas.width, this.renderer.canvas.height);
    }
  }

  process(shader) {
    let currentFramebuffer = (this.lastFramebuffer + 1) % (this.downscaled ? this.downscaledFramebuffers : this.framebuffers).length;

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, (this.downscaled ? this.downscaledFramebuffers : this.framebuffers)[currentFramebuffer]);

    if (this.downscaled) {
      this.renderer.setSize(this.renderer.canvas.width / downscaleFactor, this.renderer.canvas.height / downscaleFactor);
    }

    this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, (this.downscaled ? this.downscaledTextures : this.textures)[this.lastFramebuffer]);

    this.renderer.draw(shader, mat4.create(), this.vertexBuffer, this.renderer.gl.TRIANGLES, 6, true);

    this.lastFramebuffer = currentFramebuffer;

    if (this.downscaled) {
      this.renderer.setSize(this.renderer.canvas.width, this.renderer.canvas.height);
    }

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);
  }

  draw(shader, additiveBlend = false) {
    this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, (this.downscaled ? this.downscaledTextures : this.textures)[this.lastFramebuffer]);

    this.renderer.setSize(this.renderer.canvas.width, this.renderer.canvas.height);

    if (additiveBlend) {
      this.renderer.gl.blendFunc(this.renderer.gl.SRC_ALPHA, this.renderer.gl.ONE);
    }

    this.renderer.draw(shader, mat4.create(), this.vertexBuffer, this.renderer.gl.TRIANGLES, 6, true);

    if (additiveBlend) {
      this.renderer.gl.blendFunc(this.renderer.gl.SRC_ALPHA, this.renderer.gl.ONE_MINUS_SRC_ALPHA);
    }

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
  }

  downscaledWidth() {
    return this.renderer.canvas.width / downscaleFactor;
  }

  downscaledHeight() {
    return this.renderer.canvas.height / downscaleFactor;
  }
}

export default PostProcessor;
