import { DataEntryPrefix } from '../core/state/dataEntryPrefix';
import { StateStore } from '../core/state/stateStore';
import { StateValue } from '../core/state/stateValue';

/**
 * FIXME: implement
 */
export class CloneCache {
  private store: StateStore;

  getStore() {
    return this.store;
  }

  add(prefix: DataEntryPrefix, key: Buffer, value: StateValue) {
    throw new Error('Unsupported');
  }

  getOrAdd(prefix: DataEntryPrefix, key: Buffer, value: StateValue): StateValue {
    throw new Error('Unsupported');
  }

  get(prefix: DataEntryPrefix, key: Buffer): StateValue {
    throw new Error('Unsupported');
  }

  delete(prefix: DataEntryPrefix, key: Buffer) {
    throw new Error('Unsupported');
  }
}
