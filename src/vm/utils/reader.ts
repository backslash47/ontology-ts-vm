import * as ByteBuffer from 'bytebuffer';
import * as Long from 'long';

export type Whence = 'start';

export class Reader {
  reader: ByteBuffer;

  constructor(b: Buffer) {
    this.reader = ByteBuffer.wrap(b);
  }

  readByte(): number {
    return this.reader.readByte();
  }

  readBytes(count: number): Buffer {
    return new Buffer(this.reader.readBytes(count).toBuffer());
  }

  readUint16(): number {
    return this.reader.readUint16();
  }

  readUInt32(): number {
    return this.reader.readUint32();
  }

  readUInt64(): Long {
    return this.reader.readUint64();
  }

  readInt16(): number {
    return this.reader.readInt16();
  }

  readInt32(): number {
    return this.reader.readInt32();
  }

  position(): number {
    return this.reader.offset;
  }

  length(): number {
    return this.reader.limit;
  }

  seek(offset: number, whence: Whence): number {
    if (whence === 'start') {
      const oldOffset = this.reader.offset;
      this.reader.offset = offset;
      return oldOffset;
    } else {
      throw new Error('Unsupported Whence');
    }
  }

  readVarBytes(max: number): Buffer {
    const n = this.readVarInt(Long.fromNumber(max)).toNumber();
    return this.readBytes(n);
  }

  /**
   * TODO: shouldn't readInt16 be readUInt16
   * @param max
   */
  readVarInt(max: Long): Long {
    const fb = this.readByte();
    let value: Long;

    switch (fb) {
      case 0xfd:
        value = Long.fromNumber(this.readInt16());
      case 0xfe:
        value = Long.fromNumber(this.readUInt32());
      case 0xff:
        value = this.readUInt64();

      default:
        value = Long.fromNumber(fb);
    }
    if (value.gt(max)) {
      return Long.ZERO;
    }
    return value;
  }

  readVarString(maxlen: number): string {
    const bs = this.readVarBytes(maxlen);
    return bs.toString('utf-8');
  }
}
