import * as Long from 'long';
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export const MAX_STRUCT_DEPTH = 10;
export const MAX_CLONE_LENGTH = 1024;

export class StructType implements StackItem {
  static id = 0x81;
  type: string;
  value: StackItem[];

  constructor(value: StackItem[]) {
    this.value = value;
    this.type = 'StructType';
  }

  /**
   * FIXME: check if implemented correctly
   * @param other
   */
  equals(other: StackItem): boolean {
    if (!(other instanceof StructType)) {
      return false;
    }

    if (other.value.length !== this.value.length) {
      return false;
    }

    for (let i = 0; i < this.value.length; i++) {
      if (!this.value[i].equals(other.value[i])) {
        return false;
      }
    }

    return true;
  }

  getBigInteger(): Long {
    throw new Error('Not support struct to integer');
  }

  getBoolean(): boolean {
    return true;
  }

  getByteArray(): Buffer {
    throw new Error('Not support struct to byte array');
  }

  getInterface(): Interop {
    throw new Error('Not support struct to interface');
  }

  getArray(): StackItem[] {
    return this.value;
  }

  getStruct(): StackItem[] {
    return this.value;
  }

  getMap(): Map<StackItem, StackItem> {
    throw new Error('Not support struct to map');
  }

  isMapKey(): boolean {
    return false;
  }

  add(item: StackItem) {
    this.value.push(item);
  }

  removeAt(index: number) {
    this.value = this.value.slice(0, index - 1).concat(this.value.slice(index, this.value.length));
  }

  count() {
    return this.value.length;
  }

  clone(length: number): StackItem {
    if (length > MAX_CLONE_LENGTH) {
      throw new Error('over max struct clone length');
    }

    const arr: StackItem[] = [];

    for (const v of this.value) {
      length++;
      if (isStructType(v)) {
        const vc = v.clone(length);
        arr.push(vc);
      } else {
        arr.push(v);
      }
    }

    return new StructType(arr);
  }
}

export function isStructType(item: StackItem): item is StructType {
  return item.type === 'StructType';
}
