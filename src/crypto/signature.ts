import { PublicKey } from './publicKey';

/**
 * FIXME: implements
 */
export class Signature {
  static deserialize(hex: Buffer): Signature {
    throw new Error('Unsupported');
  }

  verify(key: PublicKey, data: Buffer): boolean {
    throw new Error('Unsupported');
  }
}
