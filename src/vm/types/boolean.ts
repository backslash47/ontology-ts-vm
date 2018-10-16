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
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export class BooleanType implements StackItem {
  static id = 0x01;
  type: string;
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
    this.type = 'BooleanType';
  }

  equals(other: StackItem): boolean {
    if (this === other) {
      return true;
    }

    try {
      const b = other.getByteArray();
      const tb = this.getByteArray();

      return tb.equals(b);
    } catch (e) {
      return false;
    }
  }

  getBigInteger() {
    return this.value ? bigInt.one : bigInt.zero;
  }

  getBoolean() {
    return this.value;
  }

  getByteArray(): Buffer {
    const buffer = new Uint8Array(1);
    buffer.set([Number(this.value)]);
    return new Buffer(buffer);
  }

  getInterface(): Interop {
    throw new Error('Not support boolean to interface');
  }

  getArray(): StackItem[] {
    throw new Error('Not support boolean to array');
  }

  getStruct(): StackItem[] {
    throw new Error('Not support boolean to struct');
  }

  getMap(): Map<StackItem, StackItem> {
    throw new Error('Not support boolean to map');
  }

  isMapKey(): boolean {
    return true;
  }

  toString(): string {
    return `Boolean(${String(this.value)})`;
  }

  getEncodedValue(): string {
    return String(this.value);
  }

  setEncodedValue(value: string) {
    this.value = Boolean(value);
  }

  getType() {
    return this.type;
  }
}

export function isBooleanType(item: StackItem): item is BooleanType {
  return item.type === 'BooleanType';
}
