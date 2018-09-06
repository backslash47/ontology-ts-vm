import { Interop } from '../vm/interfaces/interop';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';

export type TransactionAttributeUsage = number;

export const Nonce = 0x00;
export const Script = 0x20;
export const DescriptionUrl = 0x81;
export const Description = 0x90;

export class TransactionAttribute implements Interop {
  private usage: TransactionAttributeUsage;
  private data: Buffer;

  constructor(u: TransactionAttributeUsage, d: Buffer) {
    this.usage = u;
    this.data = this.data;
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
    try {
      w.writeUint8(this.usage);
    } catch (e) {
      throw new Error(`Transaction attribute Usage serialization error: ${e}`);
    }

    if (!isTransactionAttributeUsage(this.usage)) {
      throw new Error(`Unsupported attribute Description.`);
    }

    try {
      w.writeVarBytes(this.data);
    } catch (e) {
      throw new Error(`Transaction attribute Data serialization error: ${e}`);
    }
  }

  deserialize(r: Reader) {
    try {
      const val = r.readByte();

      if (!isTransactionAttributeUsage(this.usage)) {
        throw new Error('[TxAttribute] Unsupported attribute Description.');
      }

      this.usage = val;
    } catch (e) {
      throw new Error(`Transaction attribute Usage deserialization error: ${e}`);
    }

    try {
      this.data = r.readVarBytes();
    } catch (e) {
      throw new Error(`Transaction attribute Data deserialization error: ${e}`);
    }
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

export function isTransactionAttributeUsage(item: number): item is TransactionAttributeUsage {
  return item === Nonce || item === Script || item === DescriptionUrl || item === Description;
}
