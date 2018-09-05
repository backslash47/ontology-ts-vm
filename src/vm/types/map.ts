import * as Long from 'long';
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export class MapType implements StackItem {
  static id = 0x82;
  type: string;
  value: Map<StackItem, StackItem>;

  constructor(value: Map<StackItem, StackItem> = new Map()) {
    this.value = value;
    this.type = 'MapType';
  }

  equals(other: StackItem): boolean {
    return this === other;
  }

  getBigInteger(): Long {
    throw new Error('Not support map to integer');
  }

  getBoolean(): boolean {
    return true;
  }

  getByteArray(): Buffer {
    throw new Error('Not support map to byte array');
  }

  getInterface(): Interop {
    throw new Error('Not support map to interface');
  }

  getArray(): StackItem[] {
    throw new Error('Not support map to array');
  }

  getStruct(): StackItem[] {
    throw new Error('Not support map to struct');
  }

  getMap(): Map<StackItem, StackItem> {
    return this.value;
  }

  isMapKey(): boolean {
    return false;
  }

  add(k: StackItem, value: StackItem) {
    for (const [key] of this.value) {
      if (key.equals(k)) {
        this.value.delete(key);
        break;
      }
    }

    this.value.set(k, value);
  }

  clear() {
    return this.value.clear();
  }

  remove(k: StackItem) {
    for (const [key] of this.value) {
      if (key.equals(k)) {
        this.value.delete(key);
        break;
      }
    }
  }

  tryGetValue(k: StackItem): StackItem | undefined {
    for (const [key, val] of this.value) {
      if (key.equals(k)) {
        return val;
      }
    }
  }
}

export function isMapType(item: StackItem): item is MapType {
  return item.type === 'MapType';
}
