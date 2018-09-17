import { createHash } from 'crypto';
import * as Long from 'long';
import { Address } from '../common/address';
import { Uint256 } from '../common/uint256';
import { Interop } from '../vm/interfaces/interop';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';
import { DeployCode } from './payload/deployCode';
import { InvokeCode } from './payload/invokeCode';

export const TX_MAX_SIG_SIZE = 16;
export type TransactionType = number;

export const Bookkeeper = 0x02;
export const Deploy = 0xd0;
export const Invoke = 0xd1;

/**
 * Payload define the func for loading the payload data
 * base on payload type which have different struture
 */
export interface Payload {
  /**
   * Serialize payload data
   */
  serialize(w: Writer): void;

  deserialize(r: Reader): void;
}

export class RawSig {
  static deserialize(r: Reader): RawSig {
    const invoke = r.readVarBytes();
    const verify = r.readVarBytes();

    return new RawSig(invoke, verify);
  }
  private invoke: Buffer;
  private verify: Buffer;

  constructor(invoke: Buffer, verify: Buffer) {
    this.invoke = invoke;
    this.verify = verify;
  }

  getVerify() {
    return this.verify;
  }

  serialize(w: Writer) {
    w.writeVarBytes(this.invoke);
    w.writeVarBytes(this.verify);
  }
}

export class Transaction implements Interop {
  private version: number;
  private txType: TransactionType;
  private nonce: number;
  private gasPrice: Long;
  private gasLimit: Long;
  private payer: Address;
  private payload: Payload;

  // private Attributes []*TxAttribute
  // tslint:disable-next-line:max-line-length
  private attributes: number; // this must be 0 now, Attribute Array length use VarUint encoding, so byte is enough for extension
  private sigs: RawSig[];

  private raw: Buffer; // raw transaction data

  private hash: Uint256;
  // private signedAddr: Address[]; - unused, computed on the fly

  private nonDirectConstracted: boolean; // used to check literal construction like `tx := &Transaction{...}`

  getVersion() {
    return this.version;
  }

  getNonce() {
    return this.nonce;
  }

  getGasPrice(): Long {
    return this.gasPrice;
  }

  getGasLimit(): Long {
    return this.gasLimit;
  }
  getHash() {
    return this.hash;
  }

  getTxType() {
    return this.txType;
  }

  getPayer() {
    return this.payer;
  }

  getPayload() {
    return this.payload;
  }

  getAttributes() {
    return this.attributes;
  }

  setSigs(sigs: RawSig[]) {
    this.sigs = sigs;
  }

  getSignatureAddresses(): Address[] {
    const addrs: Address[] = [];

    for (const sig of this.sigs) {
      addrs.push(Address.parseFromVmCode(sig.getVerify()));
    }

    return addrs;
  }

  serialize(w: Writer) {
    if (this.nonDirectConstracted === false || this.raw.length === 0) {
      throw new Error('wrong constructed transaction');
    }

    w.writeBytes(this.raw);
  }

  deserialize(r: Reader) {
    const pstart = r.position();
    this.deserializeUnsigned(r);
    const pos = r.position();
    const lenUnsigned = pos - pstart;
    r.seek(-lenUnsigned, 'relative');
    const rawUnsigned = r.readBytes(lenUnsigned);

    const sh = createHash('sha256');
    sh.update(rawUnsigned);
    this.hash = Uint256.parseFromBytes(sh.digest());

    // tx sigs
    const length = r.readVarUInt().toNumber();

    if (length > TX_MAX_SIG_SIZE) {
      throw new Error(`transaction signature number ${length} execced ${TX_MAX_SIG_SIZE}`);
    }

    for (let i = 0; i < length; i++) {
      const sig = RawSig.deserialize(r);
      this.sigs.push(sig);
    }

    const pend = r.position();
    const lenAll = pend - pstart;
    r.seek(-lenAll, 'relative');
    this.raw = r.readBytes(lenAll);

    this.nonDirectConstracted = true;
  }

  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }

  private deserializeUnsigned(r: Reader) {
    this.version = r.readByte();
    this.txType = r.readByte();
    this.nonce = r.readUInt32();
    this.gasPrice = r.readUInt64();
    this.gasLimit = r.readUInt64();

    this.payer = new Address();
    this.payer.deserialize(r);

    if (this.txType === Invoke) {
      const pl = new InvokeCode();
      pl.deserialize(r);
      this.payload = pl;
    } else if (this.txType === Deploy) {
      const pl = new DeployCode();
      pl.deserialize(r);
      this.payload = pl;
    } else {
      throw new Error(`unsupported tx type ${this.getTxType()}`);
    }

    const length = r.readVarUInt();

    if (!length.isZero()) {
      throw new Error('transaction attribute must be 0, got %d');
    }
    this.attributes = 0;
  }
}

export function isTransaction(item: Interop): item is Transaction {
  return item instanceof Transaction;
}
