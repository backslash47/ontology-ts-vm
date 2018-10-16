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

import { StateItem, StateStore, StateValue } from '../../core/state/stateStore';

export class RuntimeStateStore implements StateStore {
  data: Map<string, StateValue>;

  constructor() {
    this.data = new Map();
  }
  add(prefix: number, key: Buffer, value: StateValue): void {
    const k = buildWholeKey(prefix, key);

    this.data.set(k, value);
  }
  getOrAdd(prefix: number, key: Buffer, value: StateValue): StateValue {
    const k = buildWholeKey(prefix, key);

    if (this.data.has(k)) {
      return this.data.get(k)!;
    } else {
      this.add(prefix, key, value);
      return value;
    }
  }
  get(prefix: number, key: Buffer): StateItem | undefined {
    const k = buildWholeKey(prefix, key);

    const item = this.data.get(k);

    if (item === undefined) {
      return undefined;
    }

    return {
      prefix,
      key,
      value: item,
      state: 0
    };
  }
  delete(prefix: number, key: Buffer): void {
    const k = buildWholeKey(prefix, key);

    this.data.delete(k);
  }
  find(prefix: number, key: Buffer): StateItem[] {
    try {
      const item = this.get(prefix, key);

      if (item !== undefined) {
        return [item];
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  }
}

function buildWholeKey(prefix: number, key: Buffer): string {
  const prefixBuffer = new Buffer(1);
  prefixBuffer.writeUInt8(prefix, 0);

  return Buffer.concat([prefixBuffer, key]).toString('hex');
}
