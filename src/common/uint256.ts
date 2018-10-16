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
import { Reader } from '../vm/utils/reader';
import { Writer } from '../vm/utils/writer';

const UINT256_SIZE = 32;

export class Uint256 {
  static parseFromBytes(b: Buffer): Uint256 {
    const r = new Reader(b);
    const u = new Uint256();
    u.deserialize(r);

    return u;
  }
  private value: Buffer;

  constructor(value: Buffer = new Buffer('')) {
    this.value = value;
  }

  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }

  serialize(w: Writer) {
    w.writeBytes(this.value);
  }

  deserialize(r: Reader) {
    try {
      this.value = r.readBytes(UINT256_SIZE);
    } catch (e) {
      throw new Error('deserialize Uint256 error');
    }
  }
}
