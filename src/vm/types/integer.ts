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
import { bigIntToBytes } from '../../common/utils';
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export class IntegerType implements StackItem {
  static id = 0x02;
  type: string;
  value: bigInt.BigInteger;

  constructor(value: bigInt.BigInteger) {
    this.value = value;
    this.type = 'IntegerType';
  }

  equals(other: StackItem): boolean {
    if (this === other) {
      return true;
    }
    if (other === undefined) {
      return false;
    }

    try {
      const v = other.getBigInteger();
      return this.value.eq(v);
    } catch (e) {
      const b = other.getByteArray();
      const tb = this.getByteArray();
      return b.equals(tb);
    }
  }

  getBigInteger() {
    return this.value;
  }

  getBoolean() {
    return this.value.neq(bigInt.zero);
  }

  getByteArray(): Buffer {
    return bigIntToBytes(this.value);
  }

  getInterface(): Interop {
    throw new Error('Not support integer to interface');
  }

  getArray(): StackItem[] {
    throw new Error('Not support integer to array');
  }

  getStruct(): StackItem[] {
    throw new Error('Not support integer to struct');
  }

  getMap(): Map<StackItem, StackItem> {
    throw new Error('Not support integer to map');
  }

  isMapKey(): boolean {
    return true;
  }

  toString(): string {
    return `Integer(${this.value.toString()})`;
  }

  getEncodedValue(): string {
    return this.value.toString();
  }

  setEncodedValue(value: string) {
    this.value = bigInt(value);
  }

  getType() {
    return this.type;
  }
}

export function isIntegerType(item: StackItem): item is IntegerType {
  return item.type === 'IntegerType';
}
