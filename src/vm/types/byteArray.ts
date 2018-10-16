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
import { TracedError } from '../../common/error';
import { bigIntFromBytes } from '../../common/utils';
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export class ByteArrayType implements StackItem {
  static id = 0x00;
  type: string;
  value: Buffer;

  constructor(value: Buffer = new Buffer(0)) {
    this.value = value;
    this.type = 'ByteArrayType';
  }

  equals(other: StackItem): boolean {
    if (this === other) {
      return true;
    }

    try {
      const a1 = this.value;
      const a2 = other.getByteArray();

      return a1.equals(a2);
    } catch (e) {
      return false;
    }
  }

  getBigInteger(): bigInt.BigInteger {
    return bigIntFromBytes(this.value);
  }

  getBoolean() {
    return this.value.reduce((previous, current) => previous || current !== 0, false);
  }

  getByteArray(): Buffer {
    return this.value;
  }

  getInterface(): Interop {
    throw new TracedError('Not support byte array to interface');
  }

  getArray(): StackItem[] {
    throw new TracedError('Not support byte array to array');
  }

  getStruct(): StackItem[] {
    throw new TracedError('Not support byte array to struct');
  }

  getMap(): Map<StackItem, StackItem> {
    throw new TracedError('Not support byte array to map');
  }

  isMapKey(): boolean {
    return true;
  }

  toString() {
    return `ByteArray(0x${this.value.toString('hex')})`;
  }

  getEncodedValue() {
    return this.value.toString('hex');
  }

  setEncodedValue(value: string) {
    this.value = new Buffer(value, 'hex');
  }

  getType() {
    return this.type;
  }
}

export function isByteArrayType(item: StackItem): item is ByteArrayType {
  return item.type === 'ByteArrayType';
}
