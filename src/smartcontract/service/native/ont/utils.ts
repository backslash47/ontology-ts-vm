import * as Long from 'long';
import { Address } from '../../../../common/address';
import { ST_STORAGE } from '../../../../core/state/dataEntryPrefix';
import { StorageItem } from '../../../../core/state/storageItem';
import { Writer } from '../../../../vm/utils/writer';
import { NativeVmService } from '../../../nativeVmService';
import { genUInt64StorageItem, getStorageUInt32, getStorageUInt64 } from '../utils/store';
import { State, TransferFrom } from './states';

export const UNBOUND_TIME_OFFSET = 'unboundTimeOffset';
export const TOTAL_SUPPLY_NAME = 'totalSupply';
export const INIT_NAME = 'init';
export const TRANSFER_NAME = 'transfer';
export const APPROVE_NAME = 'approve';
export const TRANSFERFROM_NAME = 'transferFrom';
export const NAME_NAME = 'name';
export const SYMBOL_NAME = 'symbol';
export const DECIMALS_NAME = 'decimals';
export const TOTALSUPPLY_NAME = 'totalSupply';
export const BALANCEOF_NAME = 'balanceOf';
export const ALLOWANCE_NAME = 'allowance';

export function addNotifications(native: NativeVmService, contract: Address, state: State) {
  native.addNotification({
    contractAddress: contract,
    states: [state.from.toBase58(), state.to.toBase58(), state.value]
  });
}

export function transfer(native: NativeVmService, contract: Address, state: State) {
  if (!native.contextRef.checkWitness(state.from)) {
    throw new Error('authentication failed!');
  }

  const fromBalance = fromTransfer(native, genBalanceKey(contract, state.from), state.value);
  const toBalance = toTransfer(native, genBalanceKey(contract, state.to), state.value);
  return { fromBalance, toBalance };
}

export function transferedFrom(native: NativeVmService, currentContract: Address, state: TransferFrom) {
  if (native.contextRef.checkWitness(state.sender) === false) {
    throw new Error('authentication failed!');
  }

  fromApprove(native, genTransferFromKey(currentContract, state), state.value);

  const fromBalance = fromTransfer(native, genBalanceKey(currentContract, state.from), state.value);
  const toBalance = toTransfer(native, genBalanceKey(currentContract, state.to), state.value);

  return { fromBalance, toBalance };
}

export function getToUInt64StorageItem(toBalance: Long, value: Long): StorageItem {
  const w = new Writer();
  w.writeUint64(toBalance.add(value));
  return new StorageItem(w.getBytes());
}

export function genTotalSupplyKey(contract: Address): Buffer {
  return Buffer.concat([contract.toArray(), new Buffer(TOTAL_SUPPLY_NAME)]);
}

export function genBalanceKey(contract: Address, addr: Address): Buffer {
  return Buffer.concat([contract.toArray(), addr.toArray()]);
}

export function fromTransfer(native: NativeVmService, fromKey: Buffer, value: Long): Long {
  const fromBalance = getStorageUInt64(native, fromKey);

  if (fromBalance.lt(value)) {
    const addr = Address.parseFromBytes(fromKey.slice(20));
    throw new Error(
      `[Transfer] balance insufficient. contract:${native.contextRef
        .currentContext()!
        // tslint:disable-next-line:max-line-length
        .contractAddress.toHexString()}, account:${addr.toBase58()},balance:${fromBalance.toString()}, transfer amount:${value.toString()}`
    );
  } else if (fromBalance.eq(value)) {
    native.stateStore.delete(ST_STORAGE, fromKey);
  } else {
    native.stateStore.add(ST_STORAGE, fromKey, genUInt64StorageItem(fromBalance.subtract(value)));
  }
  return fromBalance;
}

export function toTransfer(native: NativeVmService, toKey: Buffer, value: Long): Long {
  const toBalance = getStorageUInt64(native, toKey);

  native.stateStore.add(ST_STORAGE, toKey, getToUInt64StorageItem(toBalance, value));
  return toBalance;
}

export function getUnboundOffset(native: NativeVmService, contract: Address, address: Address): number {
  return getStorageUInt32(native, genAddressUnboundOffsetKey(contract, address));
}

export function genTransferFromKey(contract: Address, state: TransferFrom): Buffer {
  return Buffer.concat([contract.toArray(), state.from.toArray(), state.sender.toArray()]);
}

export function fromApprove(native: NativeVmService, fromApproveKey: Buffer, value: Long) {
  const approveValue = getStorageUInt64(native, fromApproveKey);

  if (approveValue.lessThan(value)) {
    throw new Error(`[TransferFrom] approve balance insufficient! have ${approveValue}, got ${value}`);
  } else if (approveValue === value) {
    native.stateStore.delete(ST_STORAGE, fromApproveKey);
  } else {
    native.stateStore.add(ST_STORAGE, fromApproveKey, genUInt64StorageItem(approveValue.subtract(value)));
  }
}

export function genAddressUnboundOffsetKey(contract: Address, address: Address): Buffer {
  return Buffer.concat([contract.toArray(), new Buffer(UNBOUND_TIME_OFFSET), address.toArray()]);
}

export function genApproveKey(contract: Address, from: Address, to: Address): Buffer {
  return Buffer.concat([contract.toArray(), from.toArray(), to.toArray()]);
}
