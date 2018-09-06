import { PublicKey } from '../crypto/publicKey';

export const ADDR_LEN = 20;
/**
 * FIXME: implement
 */
export class Address {
  static parseFromBytes(bytes: Buffer): Address {
    throw new Error('Unsupported');
  }

  static parseFromVmCode(code: Buffer): Address {
    throw new Error('Unsupported');
  }

  static fromPubKey(key: PublicKey): Address {
    throw new Error('Unsupported');
  }

  private data: Buffer;

  equals(other: Address): boolean {
    return this.data.equals(other.data);
  }

  toArray() {
    const buffer = new Buffer(this.data.length);
    this.data.copy(buffer);
    return buffer;
  }
}
