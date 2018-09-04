import { Interop } from '../vm/interfaces/interop';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';
import { Address } from './address';

/**
 * FIXME: implement
 */
export class Transaction implements Interop {
  getSignatureAddresses(): Address[] {
    throw new Error('Unsupported');
  }

  serialize(w: Writer) {
    throw new Error('Unsupported');
  }

  deserialize(w: Reader) {
    throw new Error('Unsupported');
  }

  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }
}
