import { Address } from '../../common/address';
import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { DataEntryPrefix, ST_STORAGE } from './dataEntryPrefix';

export interface StateStore {
  add(prefix: DataEntryPrefix, key: Buffer, value: StateValue): void;
  /**
   * Get key from state store, if not exist, add it to store
   */
  getOrAdd(prefix: DataEntryPrefix, key: Buffer, value: StateValue): StateValue;
  /**
   * Get key from state store
   */
  get(prefix: DataEntryPrefix, key: Buffer): StateItem | undefined;
  /**
   * Delete key in store
   */
  delete(prefix: DataEntryPrefix, key: Buffer): void;
  /**
   * iterator key in store
   */
  find(prefix: DataEntryPrefix, key: Buffer): StateItem[];
}

type ItemState = number;

export interface StateValue {
  serialize(w: Writer): void;
  deserialize(r: Reader): void;
}

/**
 * State item struct
 */
export interface StateItem {
  prefix: DataEntryPrefix;
  key: Buffer; // State key
  value: StateValue; // State value
  state: ItemState; // Status
}

/**
 * TODO: should be in storage
 */
export function getStorageKey(address: Address, key: Buffer): Buffer {
  const w = new Writer();
  w.writeUint8(ST_STORAGE);
  w.writeBytes(address.toArray());
  w.writeBytes(key);
  return w.getBytes();
}
