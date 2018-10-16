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

export class ArrayType implements StackItem {
  static id = 0x80;
  type: string;
  value: StackItem[];

  constructor(value: StackItem[] = []) {
    this.value = value;
    this.type = 'ArrayType';
  }

  equals(other: StackItem): boolean {
    return this === other;
  }

  getBigInteger(): bigInt.BigInteger {
    throw new Error('Not support array to integer');
  }

  getBoolean(): boolean {
    throw new Error('Not support array to boolean');
  }

  getByteArray(): Buffer {
    throw new Error('Not support array to byte array');
  }

  getInterface(): Interop {
    throw new Error('Not support array to interface');
  }

  getArray(): StackItem[] {
    return this.value;
  }

  getStruct(): StackItem[] {
    return this.value;
  }

  getMap(): Map<StackItem, StackItem> {
    throw new Error('Not support array to map');
  }

  isMapKey(): boolean {
    return false;
  }

  add(item: StackItem) {
    this.value.push(item);
  }

  removeAt(index: number) {
    this.value.splice(index, 1);
  }

  count() {
    return this.value.length;
  }

  contains(item: StackItem) {
    for (const val of this.value) {
      if (val.equals(item)) {
        return true;
      }
    }

    return false;
  }

  toString() {
    const children = this.value.map((child) => child.toString());
    const childrenString = children.join(', ');

    return `Array([${childrenString}])`;
  }

  getEncodedValue(): string {
    throw new Error('Unsupported');
  }

  setEncodedValue(value: string) {
    throw new Error('Unsupported');
  }

  getType() {
    return this.type;
  }
}

export function isArrayType(item: StackItem): item is ArrayType {
  return item.type === 'ArrayType';
}
