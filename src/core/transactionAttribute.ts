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
