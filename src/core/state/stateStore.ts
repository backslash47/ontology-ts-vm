import * as ByteBuffer from 'bytebuffer';
import { Address } from '../../common/address';
import { DataEntryPrefix, ST_STORAGE } from './dataEntryPrefix';
import { StateValue } from './stateValue';

/**
 * FIXME: implement
 */
export interface StateStore {
  tryAdd(prefix: DataEntryPrefix, key: Buffer, value: StateValue): void;
  /**
   * Get key from state store, if not exist, add it to store
   */
  tryGetOrAdd(prefix: DataEntryPrefix, key: Buffer, value: StateValue): void;
  /**
   * Get key from state store
   */
  tryGet(prefix: DataEntryPrefix, key: Buffer): StateItem;
  /**
   * Delete key in store
   */
  tryDelete(prefix: DataEntryPrefix, key: Buffer): void;
  /**
   * iterator key in store
   */
  find(prefix: DataEntryPrefix, key: Buffer): StateItem[];
}

type ItemState = number;

/**
 * State item struct
 */
export interface StateItem {
  key: string; // State key
  value: StateValue; // State value
  state: ItemState; // Status
  trie: boolean; // no use
}

/**
 * TODO: should be in storage
 */
export function getStorageKey(address: Address, key: Buffer): Buffer {
  const buf = new ByteBuffer();
  buf.writeByte(ST_STORAGE);
  buf.writeBytes(address.toArray());
  buf.writeBytes(key);
  buf.flip();
  return new Buffer(buf.toBuffer());
}
