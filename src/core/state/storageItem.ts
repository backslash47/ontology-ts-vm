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
import { TracedError } from '../../common/error';
import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { StateBase } from './stateBase';
import { StateValue } from './stateStore';

export class StorageItem extends StateBase {
  private value: Buffer;

  constructor(value: Buffer) {
    super();
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  setValue(value: Buffer) {
    this.value = value;
  }

  serialize(w: Writer) {
    super.serialize(w);
    w.writeVarBytes(this.value);
  }

  deserialize(r: Reader) {
    try {
      super.deserialize(r);
    } catch (e) {
      throw new TracedError('[StorageItem], StateBase Deserialize failed.', e);
    }

    try {
      this.value = r.readVarBytes();
    } catch (e) {
      throw new TracedError('[StorageItem], Value Deserialize failed.', e);
    }
  }

  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }
}

export function isStorageItem(item: StateValue): item is StorageItem {
  return item instanceof StorageItem;
}
