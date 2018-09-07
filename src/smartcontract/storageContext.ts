import { Address } from '../common/address';
import { Interop } from '../vm/interfaces/interop';

export class StorageContext implements Interop {
  private address: Address;
  private readOnly: boolean;

  constructor(address: Address) {
    this.address = address;
    this.readOnly = false;
  }

  getAddress() {
    return this.address;
  }

  isReadOnly() {
    return this.readOnly;
  }

  setReadOnly(readOnly: boolean) {
    this.readOnly = readOnly;
  }
  toArray(): Buffer {
    return this.address.toArray();
  }
}

export function isStorageContext(item: Interop): item is StorageContext {
  return item instanceof StorageContext;
}
