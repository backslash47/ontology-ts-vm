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
}

export const ByteArrayType = 0x00;
export const BooleanType = 0x01;
export const IntegerType = 0x02;
export const InterfaceType = 0x40;
export const ArrayType = 0x80;
export const StructType = 0x81;
export const MapType = 0x82;

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
