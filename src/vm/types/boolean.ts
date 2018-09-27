import * as bigInt from 'big-integer';
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export class BooleanType implements StackItem {
  static id = 0x01;
  type: string;
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
    this.type = 'BooleanType';
  }

  equals(other: StackItem): boolean {
    if (this === other) {
      return true;
    }

    try {
      const b = other.getByteArray();
      const tb = this.getByteArray();

      return tb.equals(b);
    } catch (e) {
      return false;
    }
  }

  getBigInteger() {
    return this.value ? bigInt.one : bigInt.zero;
  }

  getBoolean() {
    return this.value;
  }

  getByteArray(): Buffer {
    const buffer = new Uint8Array(1);
    buffer.set([Number(this.value)]);
    return new Buffer(buffer);
  }

  getInterface(): Interop {
    throw new Error('Not support boolean to interface');
  }

  getArray(): StackItem[] {
    throw new Error('Not support boolean to array');
  }

  getStruct(): StackItem[] {
    throw new Error('Not support boolean to struct');
  }

  getMap(): Map<StackItem, StackItem> {
    throw new Error('Not support boolean to map');
  }

  isMapKey(): boolean {
    return true;
  }

  toString(): string {
    return `Boolean(${String(this.value)})`;
  }
}

export function isBooleanType(item: StackItem): item is BooleanType {
  return item.type === 'BooleanType';
}
