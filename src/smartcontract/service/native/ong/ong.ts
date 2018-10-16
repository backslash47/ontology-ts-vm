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

import * as bigInt from 'big-integer';
import { Address } from '../../../../common/address';
import * as C from '../../../../common/constants';
import { TracedError } from '../../../../common/error';
import { bigIntToBytes } from '../../../../common/utils';
import { ST_STORAGE } from '../../../../core/state/dataEntryPrefix';
import { Reader } from '../../../../vm/utils/reader';
import { contracts, NativeVmService } from '../../../nativeVmService';
import { APPROVE_FLAG, getBalanceValue, TRANSFER_FLAG } from '../ont/ont';
import { deserializeState, deserializeTransferFrom, deserializeTransfers } from '../ont/states';
import * as U from '../ont/utils';
import { BYTE_FALSE, BYTE_TRUE, OngContractAddress, OntContractAddress } from '../utils/params';
import { genUInt64StorageItem, getStorageUInt64 } from '../utils/store';

export function initOng() {
  contracts.set(OngContractAddress.toHexString(), registerOngContract);
}

export function registerOngContract(native: NativeVmService) {
  native.register(U.INIT_NAME, ongInit);
  native.register(U.TRANSFER_NAME, ongTransfer);
  native.register(U.APPROVE_NAME, ongApprove);
  native.register(U.TRANSFERFROM_NAME, ongTransferFrom);
  native.register(U.NAME_NAME, ongName);
  native.register(U.SYMBOL_NAME, ongSymbol);
  native.register(U.DECIMALS_NAME, ongDecimals);
  native.register(U.TOTALSUPPLY_NAME, ongTotalSupply);
  native.register(U.BALANCEOF_NAME, ongBalanceOf);
  native.register(U.ALLOWANCE_NAME, ongAllowance);
}

export function ongInit(native: NativeVmService): Buffer {
  const contract = native.contextRef.currentContext()!.contractAddress;
  const amount = getStorageUInt64(native, U.genTotalSupplyKey(contract));

  if (amount.gt(0)) {
    throw new TracedError('Init ong has been completed!');
  }

  const item = genUInt64StorageItem(C.ONG_TOTAL_SUPPLY);
  native.stateStore.add(ST_STORAGE, U.genTotalSupplyKey(contract), item);
  native.stateStore.add(ST_STORAGE, Buffer.concat([contract.toArray(), OntContractAddress.toArray()]), item);
  U.addNotifications(native, contract, { from: new Address(), to: OntContractAddress, value: C.ONG_TOTAL_SUPPLY });
  return BYTE_TRUE;
}

export function ongTransfer(native: NativeVmService): Buffer {
  const source = new Reader(native.input);
  const transfers = deserializeTransfers(source);
  const contract = native.contextRef.currentContext()!.contractAddress;
  for (const v of transfers.states) {
    if (v.value.isZero()) {
      continue;
    }
    if (v.value.gt(C.ONG_TOTAL_SUPPLY)) {
      throw new TracedError(`transfer ong amount:${v.value} over totalSupply:${C.ONG_TOTAL_SUPPLY}`);
    }
    U.transfer(native, contract, v);
    U.addNotifications(native, contract, v);
  }
  return BYTE_TRUE;
}

export function ongApprove(native: NativeVmService): Buffer {
  const source = new Reader(native.input);
  const state = deserializeState(source);
  if (state.value.isZero()) {
    return BYTE_FALSE;
  }
  if (state.value.gt(C.ONG_TOTAL_SUPPLY)) {
    throw new TracedError(`approve ong amount:${state.value} over totalSupply:${C.ONG_TOTAL_SUPPLY}`);
  }
  if (native.contextRef.checkWitness(state.from) === false) {
    throw new TracedError('authentication failed!');
  }
  const contract = native.contextRef.currentContext()!.contractAddress;
  native.stateStore.add(ST_STORAGE, U.genApproveKey(contract, state.from, state.to), genUInt64StorageItem(state.value));
  return BYTE_TRUE;
}

export function ongTransferFrom(native: NativeVmService): Buffer {
  const source = new Reader(native.input);
  const state = deserializeTransferFrom(source);

  if (state.value.isZero()) {
    return BYTE_FALSE;
  }
  if (state.value.gt(C.ONG_TOTAL_SUPPLY)) {
    throw new TracedError(`approve ong amount:${state.value} over totalSupply:${C.ONG_TOTAL_SUPPLY}`);
  }
  const contract = native.contextRef.currentContext()!.contractAddress;
  U.transferedFrom(native, contract, state);
  U.addNotifications(native, contract, { from: state.from, to: state.to, value: state.value });
  return BYTE_TRUE;
}

export function ongName(native: NativeVmService): Buffer {
  return new Buffer(C.ONG_NAME);
}

export function ongDecimals(native: NativeVmService): Buffer {
  return bigIntToBytes(bigInt(C.ONG_DECIMALS));
}

export function ongSymbol(native: NativeVmService): Buffer {
  return new Buffer(C.ONG_SYMBOL);
}

export function ongTotalSupply(native: NativeVmService): Buffer {
  const contract = native.contextRef.currentContext()!.contractAddress;
  const amount = getStorageUInt64(native, U.genTotalSupplyKey(contract));

  return bigIntToBytes(bigInt(amount.toString()));
}

export function ongBalanceOf(native: NativeVmService): Buffer {
  return getBalanceValue(native, TRANSFER_FLAG);
}

export function ongAllowance(native: NativeVmService): Buffer {
  return getBalanceValue(native, APPROVE_FLAG);
}
