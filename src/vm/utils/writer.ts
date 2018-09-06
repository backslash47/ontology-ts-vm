import * as ByteBuffer from 'bytebuffer';
import * as Long from 'long';

/**
 * FIXME: implement and move
 */
export class Writer {
  private bytes: ByteBuffer;
  getBytes() {
    return new Buffer(this.bytes.toBuffer());
  }

  writeVarUint(value: Long) {
    throw new Error('Unsupported');
  }
  writeVarBytes(value: Buffer) {
    throw new Error('Unsupported');
  }
  writeBytes(value: Buffer) {
    throw new Error('Unsupported');
  }
  writeString(value: string) {
    throw new Error('Unsupported');
  }
  writeUint8(val: number) {
    throw new Error('Unsupported');
  }
  writeUint16(val: number) {
    throw new Error('Unsupported');
  }
  writeUint32(val: number) {
    throw new Error('Unsupported');
  }
  writeUint64(val: Long) {
    throw new Error('Unsupported');
  }
}

export class LimitedWriter extends Writer {
  limit: number;

  constructor(limit: number) {
    super();
    this.limit = limit;
  }
}
