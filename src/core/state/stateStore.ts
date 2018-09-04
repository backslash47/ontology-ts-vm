import { DataEntryPrefix } from './dataEntryPrefix';
import { StateValue } from './stateValue';

/**
 * FIXME: implement
 */
export interface StateStore {
  /**
   * Get key from state store
   * @param prefix
   * @param key
   */
  tryGet(prefix: DataEntryPrefix, key: Buffer): StateItem;
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
