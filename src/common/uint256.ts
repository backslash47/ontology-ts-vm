import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';

const UINT256_SIZE = 32;

export class Uint256 {
  static parseFromBytes(b: Buffer): Uint256 {
    const r = new Reader(b);
    const u = new Uint256();
    u.deserialize(r);

    return u;
  }
  private value: Buffer;

  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }

  serialize(w: Writer) {
    w.writeBytes(this.value);
  }

  deserialize(r: Reader) {
    try {
      this.value = r.readBytes(UINT256_SIZE);
    } catch (e) {
      throw new Error('deserialize Uint256 error');
    }
  }
}
