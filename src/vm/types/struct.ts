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
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export const MAX_STRUCT_DEPTH = 10;
export const MAX_CLONE_LENGTH = 1024;

export class StructType implements StackItem {
  static id = 0x81;
  type: string;
  value: StackItem[];

  constructor(value: StackItem[] = []) {
    this.value = value;
    this.type = 'StructType';
  }

  /**
   * TODO: check if implemented correctly
   * @param other
   */
  equals(other: StackItem): boolean {
    if (!(other instanceof StructType)) {
      return false;
    }

    if (other.value.length !== this.value.length) {
      return false;
    }

    for (let i = 0; i < this.value.length; i++) {
      if (!this.value[i].equals(other.value[i])) {
        return false;
      }
    }

    return true;
  }

  getBigInteger(): bigInt.BigInteger {
    throw new TracedError('Not support struct to integer');
  }

  getBoolean(): boolean {
    return true;
  }

  getByteArray(): Buffer {
    throw new TracedError('Not support struct to byte array');
  }

  getInterface(): Interop {
    throw new TracedError('Not support struct to interface');
  }

  getArray(): StackItem[] {
    return this.value;
  }

  getStruct(): StackItem[] {
    return this.value;
  }

  getMap(): Map<StackItem, StackItem> {
    throw new TracedError('Not support struct to map');
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

  clone() {
    return this.cloneInternal(0);
  }
  cloneInternal(length: number): StackItem {
    if (length > MAX_CLONE_LENGTH) {
      throw new TracedError('over max struct clone length');
    }

    const arr: StackItem[] = [];

    for (const v of this.value) {
      length++;
      if (isStructType(v)) {
        const vc = v.cloneInternal(length);
        arr.push(vc);
      } else {
        arr.push(v);
      }
    }

    return new StructType(arr);
  }

  toString() {
    const children = this.value.map((child) => child.toString());
    const childrenString = children.join(', ');

    return `Struct([${childrenString}])`;
  }

  getEncodedValue(): string {
    throw new TracedError('Unsupported');
  }

  setEncodedValue(value: string) {
    throw new TracedError('Unsupported');
  }

  getType() {
    return this.type;
  }
}

export function isStructType(item: StackItem): item is StructType {
  return item.type === 'StructType';
}
