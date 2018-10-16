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
import * as bigInt from 'big-integer';
import * as Long from 'long';
import { Address } from '../common/address';
import { TracedError } from '../common/error';
import { Uint256 } from '../common/uint256';
import { sha256 } from '../common/utils';
import { PublicKey } from '../crypto/publicKey';
import { Interop } from '../vm/interfaces/interop';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';

export interface HeaderOptions {
  version?: number;
  prevBlockHash?: Uint256;
  transactionsRoot?: Uint256;
  blockRoot?: Uint256;
  timestamp?: number;
  height?: number;
  consensusData?: bigInt.BigInteger;
  consensusPayload?: Buffer;
  nextBookkeeper?: Address;
  bookkeepers?: PublicKey[];
  sigData?: Buffer[];
}

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
  private bookkeepers: PublicKey[];
  private sigData: Buffer[];

  constructor({
    version = 0,
    prevBlockHash = new Uint256(),
    transactionsRoot = new Uint256(),
    blockRoot = new Uint256(),
    timestamp = 0,
    height = 0,
    consensusData = bigInt(0),
    consensusPayload = new Buffer(''),
    nextBookkeeper = new Address(),
    bookkeepers = [],
    sigData = []
  }: HeaderOptions = {}) {
    this.version = version;
    this.prevBlockHash = prevBlockHash;
    this.transactionsRoot = transactionsRoot;
    this.blockRoot = blockRoot;
    this.timestamp = timestamp;
    this.height = height;
    this.consensusData = consensusData;
    this.consensusPayload = consensusPayload;
    this.nextBookkeeper = nextBookkeeper;
    this.bookkeepers = bookkeepers;
    this.sigData = sigData;
  }

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
    const w = new Writer();
    this.serializeUnsigned(w);

    return Uint256.parseFromBytes(sha256(sha256(w.getBytes())));
  }

  serialize(w: Writer) {
    this.serializeUnsigned(w);

    try {
      w.writeVarUint(this.bookkeepers.length);
    } catch (e) {
      throw new TracedError('serialize sig pubkey length failed', e);
    }

    for (const pubKey of this.bookkeepers) {
      w.writeVarBytes(pubKey.serialize());
    }

    try {
      w.writeVarUint(this.sigData.length);
    } catch (e) {
      throw new TracedError('serialize sig pubkey length failed', e);
    }

    for (const sig of this.sigData) {
      w.writeVarBytes(sig);
    }
  }

  deserialize(w: Reader) {
    throw new TracedError('Unsupported');
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
