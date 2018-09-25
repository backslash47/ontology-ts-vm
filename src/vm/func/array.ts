import * as Long from 'long';
import * as errors from '../errors';
import { ExecutionEngine } from '../interfaces/engine';
import { ArrayType, isArrayType } from '../types/array';
import { BooleanType } from '../types/boolean';
import { isIntegerType } from '../types/integer';
import { isMapType, MapType } from '../types/map';
import { StackItem } from '../types/stackItem';
import { isStructType, StructType } from '../types/struct';
import { popArray, popBigInt, popInt, popStackItem, push, pushData } from './common';

export function opArraySize(e: ExecutionEngine) {
  const item = popStackItem(e);
  if (isArrayType(item)) {
    const a = item.getArray();
    pushData(e, a.length);
  } else {
    const b = item.getByteArray();
    pushData(e, b.length);
  }
}

export function opPack(e: ExecutionEngine) {
  const size = popInt(e);

  const items: StackItem[] = [];

  for (let i = 0; i < size; i++) {
    items.push(popStackItem(e));
  }
  pushData(e, items);
}

export function opUnpack(e: ExecutionEngine) {
  const arr = popArray(e);

  const l = arr.length;
  for (let i = l - 1; i >= 0; i--) {
    push(e, arr[i]);
  }
  pushData(e, l);
}

export function opPickItem(e: ExecutionEngine) {
  const index = popStackItem(e);
  const items = popStackItem(e);

  if (isArrayType(items)) {
    const bi = index.getBigInteger();
    const i = bi.toNumber();
    const a = items.getArray();
    if (i < 0 || i >= a.length) {
      throw errors.ERR_OVER_MAX_ARRAY_SIZE;
    }
    pushData(e, a[i]);
  } else if (isStructType(items)) {
    const bi = index.getBigInteger();
    const i = bi.toNumber();
    const s = items.getStruct();
    if (i < 0 || i >= s.length) {
      throw errors.ERR_OVER_MAX_ARRAY_SIZE;
    }
    pushData(e, s[i]);
  } else if (isMapType(items)) {
    pushData(e, items.tryGetValue(index));
  } else {
    throw errors.ERR_BAD_TYPE;
  }
}

export function opSetItem(e: ExecutionEngine) {
  let newItem = popStackItem(e);

  if (isStructType(newItem)) {
    newItem = newItem.clone();
  }

  const index = popStackItem(e);
  const item = popStackItem(e);

  if (isMapType(item)) {
    item.add(index, newItem);
  } else if (isArrayType(item)) {
    const items = item.getArray();
    const bi = index.getBigInteger();
    const i = bi.toNumber();
    if (i < 0 || i >= items.length) {
      throw errors.ERR_OVER_MAX_ARRAY_SIZE;
    }
    items[i] = newItem;
  } else if (isStructType(item)) {
    const items = item.getStruct();
    const bi = index.getBigInteger();
    const i = bi.toNumber();
    if (i < 0 || i >= items.length) {
      throw errors.ERR_OVER_MAX_ARRAY_SIZE;
    }
    items[i] = newItem;
  } else {
    throw errors.ERR_BAD_TYPE;
  }
}

export function opNewArray(e: ExecutionEngine) {
  const count = popInt(e);
  const items: StackItem[] = [];

  for (let i = 0; i < count; i++) {
    items.push(new BooleanType(false));
  }
  pushData(e, new ArrayType(items));
}

export function opNewStruct(e: ExecutionEngine) {
  const count = popBigInt(e);
  const items: StackItem[] = [];
  for (let i = 0; count.comp(Long.fromNumber(i)) > 0; i++) {
    items.push(new BooleanType(false));
  }
  pushData(e, new StructType(items));
}

export function opNewMap(e: ExecutionEngine) {
  pushData(e, new MapType());
}

export function opAppend(e: ExecutionEngine) {
  let newItem = popStackItem(e);

  if (isStructType(newItem)) {
    newItem = newItem.clone();
  }

  const items = popStackItem(e);

  if (isArrayType(items)) {
    items.add(newItem);
  } else if (isStructType(items)) {
    items.add(newItem);
  }
}

export function opReverse(e: ExecutionEngine) {
  const itemArr = popArray(e);
  itemArr.reverse();
}

export function opRemove(e: ExecutionEngine) {
  const index = popStackItem(e);
  const item = popStackItem(e);

  if (isMapType(item)) {
    item.remove(index);
  } else if (isArrayType(item) || isStructType(item)) {
    if (!isIntegerType(index)) {
      throw errors.ERR_BAD_TYPE;
    }

    item.removeAt(index.getBigInteger().toNumber());
  } else {
    throw errors.ERR_BAD_TYPE;
  }
}

export function opHasKey(e: ExecutionEngine) {
  const index = popStackItem(e);
  const item = popStackItem(e);

  if (isMapType(item)) {
    pushData(e, item.tryGetValue(index) !== undefined);
  } else if (isArrayType(item) || isStructType(item)) {
    // todo: this implements HASKEY the same way as NEOVM in C# and Go, but it is against the logic
    pushData(e, index.getBigInteger().toNumber() < item.count());
    // correct implementation
    // pushData(e, item.contains(index));
  } else {
    throw errors.ERR_BAD_TYPE;
  }
}

export function opKeys(e: ExecutionEngine) {
  const item = popStackItem(e);

  if (isMapType(item)) {
    const keys = Array.from(item.getMap().keys());
    pushData(e, new ArrayType(keys));
  } else {
    throw errors.ERR_BAD_TYPE;
  }
}

export function opValues(e: ExecutionEngine) {
  const item = popStackItem(e);

  if (isMapType(item)) {
    const values = Array.from(item.getMap().values());
    pushData(e, new ArrayType(values));
  } else if (isArrayType(item)) {
    const array = item.getArray();

    const cloned = array.map((it) => {
      if (isStructType(it)) {
        return it.clone();
      } else {
        return it;
      }
    });

    pushData(e, new ArrayType(cloned));
  } else {
    throw errors.ERR_BAD_TYPE;
  }
}
