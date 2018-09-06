import * as ByteBuffer from 'bytebuffer';
import * as Long from 'long';

/**
 * TODO: check if the same as in Go
 */
export function bigIntFromBytes(bytes: Buffer): Long {
  const buffer = ByteBuffer.wrap(bytes, undefined, true);
  return buffer.readInt64();
}

/**
 * TODO: check if the same as in Go
 */
export function bigIntToBytes(value: Long) {
  const buffer = new ByteBuffer(undefined, true);
  buffer.writeUint64(value);
  return new Buffer(buffer.toBuffer());
}
