/*
 * Copyright (C) 2018 Matus Zamborsky & The ontology Authors
 * This file is part of The ontology library.
 *
 * The ontology is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ontology is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ontology.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as Long from 'long';
import { Address } from '../common/address';
import { Uint256 } from '../common/uint256';
import { sha256 } from '../common/utils';
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
  private version: number = 0;
  private txType: TransactionType = Invoke;
  private nonce: number = 0;
  private gasPrice: Long = Long.fromNumber(500);
  private gasLimit: Long = Long.fromNumber(30000);
  private payer: Address;
  private payload: Payload;

  private sigs: RawSig[] = [];

  private raw: Buffer | undefined; // raw transaction data

  private hash: Uint256;

  constructor() {
    this.version = 0;
    this.txType = Invoke;
    this.nonce = 0;
    this.gasPrice = Long.fromNumber(500);
    this.gasLimit = Long.fromNumber(30000);
    this.payer = new Address('0000000000000000000000000000000000000000');
    this.payload = new InvokeCode();

    this.hash = Uint256.parseFromBytes(sha256(this.serializeUnsigned()));
  }

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

  addSig(sig: RawSig) {
    this.sigs.push(sig);
  }

  getSignatureAddresses(): Address[] {
    const addrs: Address[] = [];

    for (const sig of this.sigs) {
      addrs.push(Address.parseFromVmCode(sig.getVerify()));
    }

    return addrs;
  }

  serialize(w: Writer) {
    if (this.raw !== undefined) {
      if (this.raw.length === 0) {
        throw new Error('wrong constructed transaction');
      }

      w.writeBytes(this.raw);
    } else {
      const bytes = this.serializeUnsigned();
      w.writeBytes(bytes);
    }
  }

  deserialize(r: Reader) {
    const pstart = r.position();
    this.deserializeUnsigned(r);
    const pos = r.position();
    const lenUnsigned = pos - pstart;
    r.seek(-lenUnsigned, 'relative');
    const rawUnsigned = r.readBytes(lenUnsigned);

    this.hash = Uint256.parseFromBytes(sha256(rawUnsigned));

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
  }

  /**
   * Serialize transaction data exclueds signatures
   */
  private serializeUnsigned() {
    const w = new Writer();
    w.writeUint8(this.version);
    w.writeUint8(this.txType);
    w.writeUint32(this.nonce);
    w.writeUint64(this.gasPrice);
    w.writeUint64(this.gasLimit);
    this.payer.serialize(w);
    this.payload.serialize(w);
    w.writeVarUint(0);

    return w.getBytes();
  }
}

export function isTransaction(item: Interop): item is Transaction {
  return item instanceof Transaction;
}
