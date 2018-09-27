import * as bigInt from 'big-integer';
import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

class EmptyInterop implements Interop {
  toArray(): Buffer {
    return new Buffer(0);
  }
}
const EMPTY_INTEROP = new EmptyInterop();

export class InteropType implements StackItem {
  static id = 0x40;
  type: string;
  value: Interop;

  constructor(value: Interop = EMPTY_INTEROP) {
    this.value = value;
    this.type = 'InteropType';
  }

  equals(other: StackItem): boolean {
    try {
      const v = other.getInterface();

      if (this.value === EMPTY_INTEROP || v === EMPTY_INTEROP) {
        return false;
      }
      if (!this.value.toArray().equals(v.toArray())) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  getBigInteger(): bigInt.BigInteger {
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

  toString() {
    return `Interop(${this.value.toArray().toString('hex')})`;
  }
}

export function isInteropType(item: StackItem): item is InteropType {
  return item.type === 'InteropType';
}
