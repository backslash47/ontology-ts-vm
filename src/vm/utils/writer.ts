import * as ByteBuffer from 'bytebuffer';

/**
 * FIXME: implement and move
 */
export class Writer {
  private bytes: ByteBuffer;
  getBytes() {
    return new Buffer(this.bytes.toBuffer());
  }
}
