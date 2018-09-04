import * as Long from 'long';
import { peekNByteArray } from '../vm/func/common';
import { ExecutionEngine } from '../vm/interfaces/engine';
import { GasTable, OPCODE_GAS, STORAGE_PUT_NAME } from './consts';

export function storeGasCost(engine: ExecutionEngine): Long {
  const key = peekNByteArray(1, engine);
  const value = peekNByteArray(2, engine);

  const putCost = GasTable.get(STORAGE_PUT_NAME);

  if (putCost !== undefined) {
    return Long.fromNumber((key.length + value.length - 1) / 1024 + 1).mul(putCost);
  } else {
    throw new Error('[StoreGasCost] get STORAGE_PUT_NAME gas failed');
  }
}

export function gasPrice(engine: ExecutionEngine, name: string): Long {
  switch (name) {
    case STORAGE_PUT_NAME:
      return storeGasCost(engine);
    default:
      const value = GasTable.get(name);
      if (value !== undefined) {
        return value;
      }

      return OPCODE_GAS;
  }
}
