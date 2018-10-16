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
import * as Long from 'long';
import { Address } from '../../../../common/address';
import * as C from '../../../../common/constants';
import { safeAdd } from '../../../../common/safeMath';
import { bigIntToBytes } from '../../../../common/utils';
import { ST_STORAGE } from '../../../../core/state/dataEntryPrefix';
import { Reader } from '../../../../vm/utils/reader';
import { Writer } from '../../../../vm/utils/writer';
import { contracts, NativeVmService } from '../../../nativeVmService';
import { BYTE_FALSE, BYTE_TRUE, OngContractAddress, OntContractAddress } from '../utils/params';
import { decodeAddress, decodeVarUint } from '../utils/serialization';
import { genUInt32StorageItem, genUInt64StorageItem, getStorageUInt64 } from '../utils/store';
import { calcUnbindOng } from '../utils/unbindOng';
import {
  deserializeState,
  deserializeTransferFrom,
  deserializeTransfers,
  serializeState,
  State,
  TransferFrom
} from './states';
import * as U from './utils';

export const TRANSFER_FLAG = 1;
export const APPROVE_FLAG = 2;

export function initOnt() {
  contracts.set(OntContractAddress.toHexString(), registerOntContract);
}

function registerOntContract(native: NativeVmService) {
  native.register(U.INIT_NAME, ontInit);
  native.register(U.TRANSFER_NAME, ontTransfer);
  native.register(U.APPROVE_NAME, ontApprove);
  native.register(U.TRANSFERFROM_NAME, ontTransferFrom);
  native.register(U.NAME_NAME, ontName);
  native.register(U.SYMBOL_NAME, ontSymbol);
  native.register(U.DECIMALS_NAME, ontDecimals);
  native.register(U.TOTALSUPPLY_NAME, ontTotalSupply);
  native.register(U.BALANCEOF_NAME, ontBalanceOf);
  native.register(U.ALLOWANCE_NAME, ontAllowance);
}

function ontInit(native: NativeVmService): Buffer {
  const context = native.contextRef.currentContext()!;

  const contract = context.contractAddress;
  const amount = getStorageUInt64(native, U.genTotalSupplyKey(contract));

  if (amount.gt(0)) {
    throw new Error('Init ont has been completed!');
  }

  const distribute = new Map<string, Long>();

  const source = native.input;

  let buf: Buffer;
  try {
    buf = new Reader(source).readVarBytes();
  } catch (e) {
    throw new Error('serialization.ReadVarBytes, contract params deserialize error!');
  }

  const input = new Reader(buf);
  const num = decodeVarUint(input);
  let sum = Long.ZERO;

  for (let i = 0; i < num.toNumber(); i++) {
    const addr = decodeAddress(input);
    const addrStr = addr.toHexString();
    const value = decodeVarUint(input);

    sum = safeAdd(sum, value);

    const prev = distribute.get(addrStr) || Long.ZERO;
    distribute.set(addrStr, prev.add(value));
  }
  if (sum.neq(C.ONT_TOTAL_SUPPLY)) {
    throw new Error(`wrong config. total supply ${sum.toString()} != ${C.ONT_TOTAL_SUPPLY.toString()}`);
  }

  for (const [addrStr, val] of distribute) {
    const addr = new Address(addrStr);
    const balanceKey = U.genBalanceKey(contract, addr);
    const item = genUInt64StorageItem(val);
    native.stateStore.add(ST_STORAGE, balanceKey, item);
    U.addNotifications(native, contract, { from: new Address(), to: addr, value: val });
  }

  native.stateStore.add(ST_STORAGE, U.genTotalSupplyKey(contract), genUInt64StorageItem(C.ONT_TOTAL_SUPPLY));

  return BYTE_TRUE;
}

function ontTransfer(native: NativeVmService): Buffer {
  const source = new Reader(native.input);

  const transfers = deserializeTransfers(source);

  const contract = native.contextRef.currentContext()!.contractAddress;

  for (const v of transfers.states) {
    if (v.value.isZero()) {
      continue;
    }

    if (v.value.gt(C.ONT_TOTAL_SUPPLY)) {
      throw new Error(`transfer ont amount:${v.value.toString()} over totalSupply:${C.ONT_TOTAL_SUPPLY}`);
    }
    const { fromBalance, toBalance } = U.transfer(native, contract, v);

    grantOng(native, contract, v.from, fromBalance);
    grantOng(native, contract, v.to, toBalance);

    U.addNotifications(native, contract, v);
  }
  return BYTE_TRUE;
}

export function ontTransferFrom(native: NativeVmService): Buffer {
  const source = new Reader(native.input);

  const state: TransferFrom = deserializeTransferFrom(source);

  if (state.value.isZero()) {
    return BYTE_FALSE;
  }

  if (state.value.gt(C.ONT_TOTAL_SUPPLY)) {
    throw new Error(`transferFrom ont amount:${state.value} over totalSupply: ${C.ONT_TOTAL_SUPPLY}`);
  }

  const contract = native.contextRef.currentContext()!.contractAddress;

  const { fromBalance, toBalance } = U.transferedFrom(native, contract, state);

  grantOng(native, contract, state.from, fromBalance);
  grantOng(native, contract, state.to, toBalance);

  U.addNotifications(native, contract, { from: state.from, to: state.to, value: state.value });
  return BYTE_TRUE;
}

export function ontApprove(native: NativeVmService): Buffer {
  const source = new Reader(native.input);

  const state: State = deserializeState(source);

  if (state.value.isZero()) {
    return BYTE_FALSE;
  }
  if (state.value.gt(C.ONT_TOTAL_SUPPLY)) {
    throw new Error(`approve ont amount:${state.value} over totalSupply:${C.ONT_TOTAL_SUPPLY}`);
  }
  if (native.contextRef.checkWitness(state.from) === false) {
    throw new Error('authentication failed!');
  }
  const contract = native.contextRef.currentContext()!.contractAddress;
  native.stateStore.add(ST_STORAGE, U.genApproveKey(contract, state.from, state.to), genUInt64StorageItem(state.value));
  return BYTE_TRUE;
}

export function ontName(native: NativeVmService): Buffer {
  return new Buffer(C.ONT_NAME);
}

export function ontDecimals(native: NativeVmService): Buffer {
  return bigIntToBytes(bigInt(C.ONT_DECIMALS));
}

export function ontSymbol(native: NativeVmService): Buffer {
  return new Buffer(C.ONT_SYMBOL);
}

export function ontTotalSupply(native: NativeVmService): Buffer {
  const contract = native.contextRef.currentContext()!.contractAddress;
  const amount = getStorageUInt64(native, U.genTotalSupplyKey(contract));

  return bigIntToBytes(bigInt(amount.toString()));
}

export function ontBalanceOf(native: NativeVmService): Buffer {
  return getBalanceValue(native, TRANSFER_FLAG);
}

export function ontAllowance(native: NativeVmService): Buffer {
  return getBalanceValue(native, APPROVE_FLAG);
}

export function getBalanceValue(native: NativeVmService, flag: number): Buffer {
  const source = new Reader(native.input);
  const from = decodeAddress(source);

  const contract = native.contextRef.currentContext()!.contractAddress;
  let key: Buffer;
  if (flag === APPROVE_FLAG) {
    const to = decodeAddress(source);
    key = U.genApproveKey(contract, from, to);
  } else if (flag === TRANSFER_FLAG) {
    key = U.genBalanceKey(contract, from);
  } else {
    throw new Error('invalid flag');
  }

  const amount = getStorageUInt64(native, key);

  return bigIntToBytes(bigInt(amount.toString()));
}

export function grantOng(native: NativeVmService, contract: Address, address: Address, balance: Long) {
  const startOffset = U.getUnboundOffset(native, contract, address);

  if (native.time <= C.GENESIS_BLOCK_TIMESTAMP) {
    return;
  }
  const endOffset = native.time - C.GENESIS_BLOCK_TIMESTAMP;
  if (endOffset < startOffset) {
    throw new Error(`grant Ong error: wrong timestamp endOffset: ${endOffset} < startOffset: ${startOffset}`);
  } else if (endOffset === startOffset) {
    return;
  }

  if (!balance.isZero()) {
    const value = calcUnbindOng(balance, startOffset, endOffset);

    const args = getApproveArgs(native, contract, OngContractAddress, address, value);

    native.nativeCall(OngContractAddress, 'approve', args);
  }

  native.stateStore.add(ST_STORAGE, U.genAddressUnboundOffsetKey(contract, address), genUInt32StorageItem(endOffset));
}

export function getApproveArgs(
  native: NativeVmService,
  contract: Address,
  ongContract: Address,
  address: Address,
  value: Long
): Buffer {
  const approve: State = {
    from: contract,
    to: address,
    value
  };

  const stateValue = getStorageUInt64(native, U.genApproveKey(ongContract, approve.from, approve.to));

  approve.value = approve.value.add(stateValue);

  const w = new Writer();
  serializeState(w, approve);
  return w.getBytes();
}
