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

  equals(o: Address): boolean {
    throw new Error('Unsupported');
  }
}
