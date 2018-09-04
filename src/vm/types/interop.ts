import * as Long from 'long';
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export class InteropType implements StackItem {
  type: string;
  value: Interop;

  constructor(value: Interop) {
    this.value = value;
    this.type = 'InteropType';
  }

  equals(other: StackItem): boolean {
    try {
      const v = other.getInterface();

      if (!this.value.toArray().equals(v.toArray())) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  getBigInteger(): Long {
    throw new Error('Not support interface to integer');
  }

  getBoolean(): boolean {
    return this.value !== undefined;
  }

  getByteArray(): Buffer {
    throw new Error('Not support interface to byte array');
  }

  getInterface() {
    return this.value;
  }

  getArray(): StackItem[] {
    throw new Error('Not support interface to array');
  }

  getStruct(): StackItem[] {
    throw new Error('Not support interface to struct');
  }

  getMap(): Map<StackItem, StackItem> {
    throw new Error('Not support interface to map');
  }

  isMapKey(): boolean {
    return false;
  }
}

export function isInteropType(item: StackItem): item is InteropType {
  return item.type === 'InteropType';
}
