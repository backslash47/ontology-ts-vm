import { Interop } from '../vm/interfaces/interop';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';

export type TransactionAttributeUsage = number;

export const Nonce = 0x00;
export const Script = 0x20;
export const DescriptionUrl = 0x81;
export const Description = 0x90;

/**
 * FIXME: implement if necessary
 */
export class TransactionAttribute implements Interop {
  private usage: TransactionAttributeUsage;
  private data: Buffer;
  private size: number;

  constructor(u: TransactionAttributeUsage, d: Buffer) {
    this.usage = u;
    this.data = this.data;
    this.size = this.getSize();
  }

  getSize(): number {
    if (this.usage === DescriptionUrl) {
      return 2 + this.data.length;
    }
    return 0;
  }

  getUsage() {
    return this.usage;
  }

  getData() {
    return this.data;
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

export function isTransactionAttribute(item: Interop): item is TransactionAttribute {
  return item instanceof TransactionAttribute;
}
