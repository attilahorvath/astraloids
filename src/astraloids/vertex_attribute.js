'use strict';

class VertexAttribute {
  constructor(name, elementType, elementCount) {
    this.name = name;
    this.elementType = elementType;
    this.elementCount = elementCount;

    switch (this.elementType) {
    case 'BYTE':
      this.byteCount = this.elementCount * Int8Array.BYTES_PER_ELEMENT;
      break;
    case 'UNSIGNED_BYTE':
      this.byteCount = this.elementCount * Uint8Array.BYTES_PER_ELEMENT;
      break;
    case 'SHORT':
      this.byteCount = this.elementCount * Int16Array.BYTES_PER_ELEMENT;
      break;
    case 'UNSIGNED_SHORT':
      this.byteCount = this.elementCount * Uint16Array.BYTES_PER_ELEMENT;
      break;
    case 'FIXED':
      this.byteCount = this.elementCount * Int32Array.BYTES_PER_ELEMENT;
      break;
    case 'FLOAT':
      this.byteCount = this.elementCount * Float32Array.BYTES_PER_ELEMENT;
      break;
    }
  }
}

export default VertexAttribute;
