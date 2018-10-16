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
import { TracedError } from '../common/error';
import { peekNByteArray } from '../vm/func/common';
import { ExecutionEngine } from '../vm/interfaces/engine';
import { GasTable, OPCODE_GAS, STORAGE_PUT_NAME } from './consts';

export function storeGasCost(engine: ExecutionEngine): Long {
  const key = peekNByteArray(1, engine);
  const value = peekNByteArray(2, engine);

  const putCost = GasTable.get(STORAGE_PUT_NAME);

  if (putCost !== undefined) {
    return Long.fromNumber((key.length + value.length - 1) / 1024 + 1).mul(putCost);
  } else {
    throw new TracedError('[StoreGasCost] get STORAGE_PUT_NAME gas failed');
  }
}

export function gasPrice(engine: ExecutionEngine, name: string): Long {
  switch (name) {
    case STORAGE_PUT_NAME:
      return storeGasCost(engine);
    default:
      const value = GasTable.get(name);
      if (value !== undefined) {
        return value;
      }

      return OPCODE_GAS;
  }
}
