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
import { Address } from '../../../../common/address';
import { Reader } from '../../../../vm/utils/reader';
import { Writer } from '../../../../vm/utils/writer';
import { readAddress, readVarUint, writeAddress, writeVarUint } from '../utils/serialization';

export interface State {
  from: Address;
  to: Address;
  value: Long;
}

export interface Transfers {
  states: State[];
}

export interface TransferFrom {
  sender: Address;
  from: Address;
  to: Address;
  value: Long;
}

export function deserializeTransfers(r: Reader): Transfers {
  const n = readVarUint(r);
  const states: State[] = [];

  for (let i = 0; i < n.toNumber(); i++) {
    const state = deserializeState(r);
    states.push(state);
  }
  return { states };
}

export function deserializeState(r: Reader): State {
  const from = readAddress(r);
  const to = readAddress(r);
  const value = readVarUint(r);

  return { from, to, value };
}

export function deserializeTransferFrom(r: Reader): TransferFrom {
  const sender = readAddress(r);
  const from = readAddress(r);
  const to = readAddress(r);
  const value = readVarUint(r);

  return {
    sender,
    from,
    to,
    value
  };
}

export function serializeState(w: Writer, state: State) {
  writeAddress(w, state.from);
  writeAddress(w, state.to);
  writeVarUint(w, state.value);
}
