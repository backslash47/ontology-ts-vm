import { createHash } from 'crypto';
import { PublicKey } from '../crypto/publicKey';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';
import { programFromPubKey } from './program';

const ADDR_LEN = 20;

export class Address {
  static parseFromBytes(b: Buffer): Address {
    const r = new Reader(b);
    const a = new Address();
    a.deserialize(r);

    return a;
  }

  static parseFromVmCode(code: Buffer): Address {
    const addr: Address = new Address();

    const sha256 = createHash('sha256');
    const md = createHash('ripemd160');

    const temp = sha256.update(code).digest();
    addr.value = md.update(temp).digest();

    return addr;
  }

  static fromPubKey(key: PublicKey): Address {
    const prog = programFromPubKey(key);

    return Address.parseFromVmCode(prog);
  }

  private value: Buffer;

  constructor(value: Buffer | string = '0000000000000000000000000000000000000000') {
    if (typeof value === 'string') {
      this.value = new Buffer(value, 'hex');
    } else {
      this.value = value;
    }
  }

  equals(other: Address): boolean {
    return this.value.equals(other.value);
  }

  serialize(w: Writer) {
    w.writeBytes(this.value);
  }

  deserialize(r: Reader) {
    try {
      this.value = r.readBytes(ADDR_LEN);
    } catch (e) {
      throw new Error('deserialize Uint256 error');
    }
  }

  toArray() {
    const buffer = new Buffer(this.value.length);
    this.value.copy(buffer);
    return buffer;
  }
}
