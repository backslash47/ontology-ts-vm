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
import { BigInteger } from 'big-integer';
import { Interop } from '../interfaces/interop';

export interface StackItem {
  type: string;
  equals(other: StackItem | undefined): boolean;
  getBigInteger(): BigInteger;
  getBoolean(): boolean;
  getByteArray(): Buffer;
  getInterface(): Interop;
  getArray(): StackItem[];
  getStruct(): StackItem[];
  getMap(): Map<StackItem, StackItem>;
  isMapKey(): boolean;
  toString(): string;
  getEncodedValue(): string;
  setEncodedValue(value: string): void;
  getType(): string;
}

export function isStackItemType(item: any): item is StackItem {
  return item.type !== undefined && item.equals !== undefined;
}

export function isStackItemArrayType(array: any): array is StackItem[] {
  if (Array.isArray(array)) {
    return array.reduce((previous, current) => previous && isStackItemType(current), true);
  } else {
    return false;
  }
}
