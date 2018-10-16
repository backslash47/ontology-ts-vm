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

class EmptyInterop implements Interop {
  toArray(): Buffer {
    return new Buffer(0);
  }
}
const EMPTY_INTEROP = new EmptyInterop();

export class InteropType implements StackItem {
  static id = 0x40;
  type: string;
  value: Interop;

  constructor(value: Interop = EMPTY_INTEROP) {
    this.value = value;
    this.type = 'InteropType';
  }

  equals(other: StackItem): boolean {
    try {
      const v = other.getInterface();

      if (this.value === EMPTY_INTEROP || v === EMPTY_INTEROP) {
        return false;
      }
      if (!this.value.toArray().equals(v.toArray())) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  getBigInteger(): bigInt.BigInteger {
    throw new TracedError('Not support interface to integer');
  }

  getBoolean(): boolean {
    return this.value !== undefined;
  }

  getByteArray(): Buffer {
    throw new TracedError('Not support interface to byte array');
  }

  getInterface() {
    return this.value;
  }

  getArray(): StackItem[] {
    throw new TracedError('Not support interface to array');
  }

  getStruct(): StackItem[] {
    throw new TracedError('Not support interface to struct');
  }

  getMap(): Map<StackItem, StackItem> {
    throw new TracedError('Not support interface to map');
  }

  isMapKey(): boolean {
    return false;
  }

  toString() {
    return `Interop(${this.value.toArray().toString('hex')})`;
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

export function isInteropType(item: StackItem): item is InteropType {
  return item.type === 'InteropType';
}
