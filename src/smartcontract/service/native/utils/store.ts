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
import * as Long from 'long';
import { ST_STORAGE } from '../../../../core/state/dataEntryPrefix';
import { isStorageItem, StorageItem } from '../../../../core/state/storageItem';
import { Reader } from '../../../../vm/utils/reader';
import { Writer } from '../../../../vm/utils/writer';
import { NativeVmService } from '../../../nativeVmService';

export function getStorageItem(native: NativeVmService, key: Buffer): StorageItem | undefined {
  const store = native.stateStore.get(ST_STORAGE, key);

  if (store === undefined) {
    return undefined;
  }

  if (isStorageItem(store.value)) {
    return store.value;
  } else {
    throw new Error('[GetStorageItem] instance does not StorageItem!');
  }
}

export function getStorageUInt64(native: NativeVmService, key: Buffer): Long {
  const item = getStorageItem(native, key);
  if (item === undefined) {
    return Long.ZERO;
  }

  return new Reader(item.getValue()).readUInt64();
}

export function genUInt64StorageItem(value: Long): StorageItem {
  const w = new Writer();
  w.writeUint64(value);

  return new StorageItem(w.getBytes());
}

export function getStorageUInt32(native: NativeVmService, key: Buffer): number {
  const item = getStorageItem(native, key);

  if (item === undefined) {
    return 0;
  }
  return new Reader(item.getValue()).readUInt32();
}

export function genUInt32StorageItem(value: number): StorageItem {
  const w = new Writer();
  w.writeUint32(value);
  return new StorageItem(w.getBytes());
}
