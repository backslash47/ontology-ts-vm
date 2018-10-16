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
import * as base58 from 'bs58';
import { PublicKey } from '../crypto/publicKey';
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';
import { programFromPubKey } from './program';
import { md160, reverseBuffer, sha256 } from './utils';

const ADDR_LEN = 20;

export class Address {
  static parseFromBytes(b: Buffer): Address {
    const r = new Reader(b);
    const a = new Address();
    a.deserialize(r);

    return a;
  }

  static parseFromVmCode(code: Buffer): Address {
    return new Address(md160(sha256(code)));
  }

  static fromPubKey(key: PublicKey): Address {
    const prog = programFromPubKey(key);

    return Address.parseFromVmCode(prog);
  }

  private value: Buffer;

  constructor(value: Buffer | string = '0000000000000000000000000000000000000000') {
    if (typeof value === 'string') {
      this.value = new Buffer(value, 'hex');
    } else {
      this.value = value;
    }
  }

  equals(other: Address): boolean {
    return this.value.equals(other.value);
  }

  serialize(w: Writer) {
    w.writeBytes(this.value);
  }

  deserialize(r: Reader) {
    try {
      this.value = r.readBytes(ADDR_LEN);
    } catch (e) {
      throw new Error('deserialize Uint256 error');
    }
  }

  toArray() {
    const buffer = new Buffer(this.value.length);
    this.value.copy(buffer);
    return buffer;
  }

  toHexString() {
    return reverseBuffer(this.toArray()).toString('hex');
  }

  toBase58(): string {
    const data = Buffer.concat([new Buffer('17', 'hex'), this.value]);
    const hash = sha256(data);
    const hash2 = sha256(hash);
    const checksum = hash2.slice(0, 4);

    const datas = Buffer.concat([data, checksum]);

    return base58.encode(datas);
  }
}
