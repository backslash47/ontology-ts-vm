import { Interop } from '../interfaces/interop';
import { StackItem } from './stackItem';

export class ByteArrayType implements StackItem {
  static id = 0x00;
  type: string;
  value: Buffer;

  constructor(value: Buffer) {
    this.value = value;
    this.type = 'ByteArrayType';
  }

  equals(other: StackItem): boolean {
    if (this === other) {
      return true;
    }

    try {
      const a1 = this.value;
      const a2 = other.getByteArray();

      return a1.equals(a2);
    } catch (e) {
      return false;
    }
  }

  getBigInteger() {
    return bigIntFromNeoBytes(this.value);
  }

  getBoolean() {
    return this.value.reduce((previous, current) => previous || current !== 0, false);
  }

  getByteArray(): Buffer {
    return this.value;
  }

  getInterface(): Interop {
    throw new Error('Not support byte array to interface');
  }

  getArray(): StackItem[] {
    throw new Error('Not support byte array to array');
  }

  getStruct(): StackItem[] {
    throw new Error('Not support byte array to struct');
  }

  getMap(): Map<StackItem, StackItem> {
    throw new Error('Not support byte array to map');
  }

  isMapKey(): boolean {
    return true;
  }
}

export function isByteArrayType(item: StackItem): item is ByteArrayType {
  return item.type === 'ByteArrayType';
}
