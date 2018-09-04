import * as ByteBuffer from 'bytebuffer';
import * as Long from 'long';

/**
 * TODO: check if the same as in Go
 */
export function bigIntFromBytes(bytes: Buffer): Long {
  const buffer = ByteBuffer.wrap(bytes);
  return buffer.readInt64();
}
