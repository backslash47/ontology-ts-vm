import * as ByteBuffer from 'bytebuffer';
import * as Long from 'long';

export class Writer {
  private writer: ByteBuffer;

  constructor() {
    this.writer = new ByteBuffer(undefined, true);
  }

  getBytes() {
    return new Buffer(this.writer.toBuffer());
  }

  writeVarUint(value: Long) {
    if (value.lt(0xfd)) {
      this.writer.writeUint8(value.toNumber());
    } else if (value.lte(0xffff)) {
      this.writer.writeUint8(0xfd);
      this.writer.writeUint16(value.toNumber());
    } else if (value.lte(0xffffffff)) {
      this.writer.writeUint8(0xfe);
      this.writer.writeUint32(value.toNumber());
    } else {
      this.writer.writeUint8(0xff);
      this.writer.writeUint64(value);
    }
  }
  writeVarBytes(value: Buffer) {
    this.writeVarUint(Long.fromNumber(value.length));
    this.writeBytes(value);
  }
  writeString(value: string) {
    return this.writeVarBytes(new Buffer(value, 'utf-8'));
  }
  writeBytes(value: Buffer) {
    this.writer.writeBytes(value);
  }
  writeUint8(val: number) {
    this.writer.writeUint8(val);
  }
  writeUint16(val: number) {
    this.writer.writeUint16(val);
  }
  writeUint32(val: number) {
    this.writer.writeUint32(val);
  }
  writeUint64(val: Long) {
    this.writer.writeUint64(val);
  }
}

/**
 * TODO: might implement
 */
export class LimitedWriter extends Writer {
  limit: number;

  constructor(limit: number) {
    super();
    this.limit = limit;
  }
}
