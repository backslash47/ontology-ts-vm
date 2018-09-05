import { Address } from '../common/address';
import { Uint256 } from '../common/uint256';
import { Interop } from '../vm/interfaces/interop';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';

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

export interface RawSig {
  invoke: Buffer;
  verify: Buffer;
}

/**
 * FIXME: implement
 */
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
  private signedAddr: Address[]; // this is assigned when passed signature verification

  private nonDirectConstracted: boolean; // used to check literal construction like `tx := &Transaction{...}`

  getHash() {
    return this.hash;
  }

  getTxType() {
    return this.txType;
  }

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

export function isTransaction(item: Interop): item is Transaction {
  return item instanceof Transaction;
}
