import * as Long from 'long';
import { Uint256 } from '../common/uint256';
import { PublicKey } from '../crypto/publicKey';
import { Interop } from '../vm/interfaces/interop';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';
import { Address } from './address';

/**
 * FIXME: implement
 */
export class Header implements Interop {
  private version: number;
  private prevBlockHash: Uint256;
  private transactionsRoot: Uint256;
  private blockRoot: Uint256;
  private timestamp: number;
  private height: number;
  private consensusData: Long;
  private consensusPayload: Buffer;
  private nextBookkeeper: Address;

  /**
   * Program *program.Program
   */
  private bookkeepers: PublicKey[];
  private sigData: Buffer[];

  getVersion() {
    return this.version;
  }

  getPrevBlockHash() {
    return this.prevBlockHash;
  }

  getTransactionsRoot() {
    return this.transactionsRoot;
  }

  getHeight() {
    return this.height;
  }

  getTimestamp() {
    return this.timestamp;
  }

  getConsensusData() {
    return this.consensusData;
  }

  getNextBookkeeper() {
    return this.nextBookkeeper;
  }

  getHash(): Uint256 {
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

export function isHeader(item: Interop): item is Header {
  return item instanceof Header;
}
