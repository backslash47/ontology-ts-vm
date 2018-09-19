import * as Long from 'long';
import { Interop } from '../interfaces/interop';

export interface StackItem {
  type: string;
  equals(other: StackItem | undefined): boolean;
  getBigInteger(): Long;
  getBoolean(): boolean;
  getByteArray(): Buffer;
  getInterface(): Interop;
  getArray(): StackItem[];
  getStruct(): StackItem[];
  getMap(): Map<StackItem, StackItem>;
  isMapKey(): boolean;
  toString(): string;
}

export function isStackItemType(item: any): item is StackItem {
  return item.type !== undefined && item.equals !== undefined;
}

export function isStackItemArrayType(array: any): array is StackItem[] {
  if (Array.isArray(array)) {
    return array.reduce((previous, current) => previous && isStackItemType(current), true);
  } else {
    return false;
  }
}
