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

export class MapType implements StackItem {
  static id = 0x82;
  type: string;
  value: Map<StackItem, StackItem>;

  constructor(value: Map<StackItem, StackItem> = new Map()) {
    this.value = value;
    this.type = 'MapType';
  }

  equals(other: StackItem): boolean {
    return this === other;
  }

  getBigInteger(): bigInt.BigInteger {
    throw new TracedError('Not support map to integer');
  }

  getBoolean(): boolean {
    return true;
  }

  getByteArray(): Buffer {
    throw new TracedError('Not support map to byte array');
  }

  getInterface(): Interop {
    throw new TracedError('Not support map to interface');
  }

  getArray(): StackItem[] {
    throw new TracedError('Not support map to array');
  }

  getStruct(): StackItem[] {
    throw new TracedError('Not support map to struct');
  }

  getMap(): Map<StackItem, StackItem> {
    return this.value;
  }

  isMapKey(): boolean {
    return false;
  }

  add(k: StackItem, value: StackItem) {
    for (const [key] of this.value) {
      if (key.equals(k)) {
        this.value.delete(key);
        break;
      }
    }

    this.value.set(k, value);
  }

  clear() {
    return this.value.clear();
  }

  remove(k: StackItem) {
    for (const [key] of this.value) {
      if (key.equals(k)) {
        this.value.delete(key);
        break;
      }
    }
  }

  tryGetValue(k: StackItem): StackItem | undefined {
    for (const [key, val] of this.value) {
      if (key.equals(k)) {
        return val;
      }
    }
  }

  toString() {
    const children: string[] = [];

    this.value.forEach((value, key) => {
      const child = `${key.toString()}: ${value.toString()}`;
      children.push(child);
    });

    const childrenString = children.join(', ');

    return `Map({${childrenString}})`;
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

export function isMapType(item: StackItem): item is MapType {
  return item.type === 'MapType';
}
