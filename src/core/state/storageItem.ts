import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { StateBase } from './stateBase';
import { StateValue } from './stateValue';

export class StorageItem extends StateBase {
  private value: Buffer;

  constructor(value: Buffer) {
    super();
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  serialize(w: Writer) {
    super.serialize(w);
    w.writeVarBytes(this.value);
  }

  deserialize(r: Reader) {
    try {
      super.deserialize(r);
    } catch (e) {
      throw new Error(`[StorageItem], StateBase Deserialize failed: ${e}`);
    }

    try {
      this.value = r.readVarBytes();
    } catch (e) {
      throw new Error(`[StorageItem], Value Deserialize failed: ${e}`);
    }
  }

  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }
}

export function isStorageItem(item: StateValue): item is StorageItem {
  return item instanceof StorageItem;
}
