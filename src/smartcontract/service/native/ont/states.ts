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
