import * as bigInt from 'big-integer';
import * as Long from 'long';
import { Address } from '../common/address';
import { Uint256 } from '../common/uint256';
import { PublicKey } from '../crypto/publicKey';
import { Interop } from '../vm/interfaces/interop';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';

export class Header implements Interop {
  private version: number;
  private prevBlockHash: Uint256;
  private transactionsRoot: Uint256;
  private blockRoot: Uint256;
  private timestamp: number;
  private height: number;
  private consensusData: bigInt.BigInteger;
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

  setTransactionsRoot(transactionsRoot: Uint256) {
    this.transactionsRoot = transactionsRoot;
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
    this.serializeUnsigned(w);

    try {
      w.writeVarUint(this.bookkeepers.length);
    } catch (e) {
      throw new Error('serialize sig pubkey length failed');
    }

    for (const pubKey of this.bookkeepers) {
      w.writeVarBytes(pubKey.serialize());
    }

    try {
      w.writeVarUint(this.sigData.length);
    } catch (e) {
      throw new Error('serialize sig pubkey length failed');
    }

    for (const sig of this.sigData) {
      w.writeVarBytes(sig);
    }
  }

  deserialize(w: Reader) {
    throw new Error('Unsupported');
  }
  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }

  private serializeUnsigned(w: Writer) {
    w.writeUint32(this.version);
    w.writeBytes(this.prevBlockHash.toArray());
    w.writeBytes(this.transactionsRoot.toArray());
    w.writeBytes(this.blockRoot.toArray());
    w.writeUint32(this.timestamp);
    w.writeUint32(this.height);
    w.writeUint64(Long.fromString(this.consensusData.toString()));
    w.writeVarBytes(this.consensusPayload);
    w.writeBytes(this.nextBookkeeper.toArray());
  }
}

export function isHeader(item: Interop): item is Header {
  return item instanceof Header;
}
