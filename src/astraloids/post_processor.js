'use strict';

const mat4 = require('gl-matrix').mat4;
const vec2 = require('gl-matrix').vec2;
const vec4 = require('gl-matrix').vec4;

const downscaleFactor = 4.0;

class PostProcessor {
  constructor(renderer) {
    this.renderer = renderer;

    this.downscaledDimensions = vec2.scale(vec2.create(), renderer.dimensions, 1.0 / downscaleFactor);

    this.textures = [
      this.prepareTexture(this.renderer.dimensions),
      this.prepareTexture(this.renderer.dimensions)
    ];

    this.framebuffers = this.textures.map(texture => this.prepareFramebuffer(texture));

    this.downscaledTextures = [
      this.prepareTexture(this.downscaledDimensions),
      this.prepareTexture(this.downscaledDimensions)
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

  prepareTexture(dimensions) {
    let texture = this.renderer.gl.createTexture();

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, texture);

    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_MIN_FILTER, this.renderer.gl.LINEAR);
    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_WRAP_S, this.renderer.gl.CLAMP_TO_EDGE);
    this.renderer.gl.texParameteri(this.renderer.gl.TEXTURE_2D, this.renderer.gl.TEXTURE_WRAP_T, this.renderer.gl.CLAMP_TO_EDGE);

    this.renderer.gl.texImage2D(this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA, dimensions[0], dimensions[1], 0, this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE, null);

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
      this.renderer.setViewport(vec4.fromValues(0, 0, this.downscaledDimensions[0], this.downscaledDimensions[1]));
    }

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, (this.downscaled ? this.downscaledFramebuffers : this.framebuffers)[0]);

    this.renderer.clear();

    this.lastFramebuffer = 0;
  }

  end() {
    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);

    if (this.downscaled) {
      this.renderer.setViewport(vec4.fromValues(0, 0, this.renderer.dimensions[0], this.renderer.dimensions[1]));
    }
  }

  process(shader) {
    let currentFramebuffer = (this.lastFramebuffer + 1) % (this.downscaled ? this.downscaledFramebuffers : this.framebuffers).length;

    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, (this.downscaled ? this.downscaledFramebuffers : this.framebuffers)[currentFramebuffer]);

    if (this.downscaled) {
      this.renderer.setViewport(vec4.fromValues(0, 0, this.downscaledDimensions[0], this.downscaledDimensions[1]));
    }

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, (this.downscaled ? this.downscaledTextures : this.textures)[this.lastFramebuffer]);

    this.renderer.draw(shader, mat4.create(), this.vertexBuffer, this.renderer.gl.TRIANGLES, 6, true);

    this.lastFramebuffer = currentFramebuffer;

    if (this.downscaled) {
      this.renderer.setViewport(vec4.fromValues(0, 0, this.renderer.dimensions[0], this.renderer.dimensions[1]));
    }

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
    this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);
  }

  draw(shader, additiveBlend = false) {
    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, (this.downscaled ? this.downscaledTextures : this.textures)[this.lastFramebuffer]);

    this.renderer.setViewport(vec4.fromValues(0, 0, this.renderer.dimensions[0], this.renderer.dimensions[1]));

    if (additiveBlend) {
      this.renderer.gl.blendFunc(this.renderer.gl.SRC_ALPHA, this.renderer.gl.ONE);
    }

    this.renderer.draw(shader, mat4.create(), this.vertexBuffer, this.renderer.gl.TRIANGLES, 6, true);

    if (additiveBlend) {
      this.renderer.gl.blendFunc(this.renderer.gl.SRC_ALPHA, this.renderer.gl.ONE_MINUS_SRC_ALPHA);
    }

    this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
  }
}

export default PostProcessor;
