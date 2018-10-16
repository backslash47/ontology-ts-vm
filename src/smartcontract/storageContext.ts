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
import { Address } from '../common/address';
import { Interop } from '../vm/interfaces/interop';

export class StorageContext implements Interop {
  private address: Address;
  private readOnly: boolean;

  constructor(address: Address) {
    this.address = address;
    this.readOnly = false;
  }

  getAddress() {
    return this.address;
  }

  isReadOnly() {
    return this.readOnly;
  }

  setReadOnly(readOnly: boolean) {
    this.readOnly = readOnly;
  }
  toArray(): Buffer {
    return this.address.toArray();
  }
}

export function isStorageContext(item: Interop): item is StorageContext {
  return item instanceof StorageContext;
}
