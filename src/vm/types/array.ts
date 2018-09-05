import * as Long from 'long';
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export class ArrayType implements StackItem {
  static id = 0x80;
  type: string;
  value: StackItem[];

  constructor(value: StackItem[]) {
    this.value = value;
    this.type = 'ArrayType';
  }

  equals(other: StackItem): boolean {
    return this === other;
  }

  getBigInteger(): Long {
    throw new Error('Not support array to integer');
  }

  getBoolean(): boolean {
    throw new Error('Not support array to boolean');
  }

  getByteArray(): Buffer {
    throw new Error('Not support array to byte array');
  }

  getInterface(): Interop {
    throw new Error('Not support array to interface');
  }

  getArray(): StackItem[] {
    return this.value;
  }

  getStruct(): StackItem[] {
    return this.value;
  }

  getMap(): Map<StackItem, StackItem> {
    throw new Error('Not support array to map');
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
}

export function isArrayType(item: StackItem): item is ArrayType {
  return item.type === 'ArrayType';
}
