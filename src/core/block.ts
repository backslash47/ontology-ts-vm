import { Interop } from '../vm/interfaces/interop';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';
import { Header } from './header';
import { Transaction } from './transaction';

/**
 * FIXME: implement
 */
export class Block implements Interop {
  private header: Header;
  private transactions: Transaction[];

  getHeader() {
    return this.header;
  }
  getTransactions() {
    return this.transactions;
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

export function isBlock(item: Interop): item is Block {
  return item instanceof Block;
}
