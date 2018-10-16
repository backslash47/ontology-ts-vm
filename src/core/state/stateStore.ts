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
import { Address } from '../../common/address';
import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { DataEntryPrefix, ST_STORAGE } from './dataEntryPrefix';

export interface StateStore {
  add(prefix: DataEntryPrefix, key: Buffer, value: StateValue): void;
  /**
   * Get key from state store, if not exist, add it to store
   */
  getOrAdd(prefix: DataEntryPrefix, key: Buffer, value: StateValue): StateValue;
  /**
   * Get key from state store
   */
  get(prefix: DataEntryPrefix, key: Buffer): StateItem | undefined;
  /**
   * Delete key in store
   */
  delete(prefix: DataEntryPrefix, key: Buffer): void;
  /**
   * iterator key in store
   */
  find(prefix: DataEntryPrefix, key: Buffer): StateItem[];
}

type ItemState = number;

export interface StateValue {
  serialize(w: Writer): void;
  deserialize(r: Reader): void;
}

/**
 * State item struct
 */
export interface StateItem {
  prefix: DataEntryPrefix;
  key: Buffer; // State key
  value: StateValue; // State value
  state: ItemState; // Status
}

/**
 * TODO: should be in storage
 */
export function getStorageKey(address: Address, key: Buffer): Buffer {
  const w = new Writer();
  w.writeUint8(ST_STORAGE);
  w.writeBytes(address.toArray());
  w.writeBytes(key);
  return w.getBytes();
}
