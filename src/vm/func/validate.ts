/*
 * Copyright (C) 2018 Matus Zamborsky & The ontology Authors
 * This file is part of The ontology library.
 *
 * The ontology is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ontology is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ontology.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as bigInt from 'big-integer';
import { bigIntToBytes } from '../../common/utils';
import { MAX_ARRAY_SIZE, MAX_BYTEARRAY_SIZE, MAX_INVOCATION_STACK_SIZE, MAX_SIZE_FOR_BIGINTEGER } from '../consts';
import * as errors from '../errors';
import { ExecutionEngine } from '../interfaces/engine';
import { isArrayType } from '../types/array';
import { isIntegerType } from '../types/integer';
import { isMapType } from '../types/map';
import { isStructType } from '../types/struct';
import {
  evaluationStackCount,
  peekBigInteger,
  peekInt,
  peekNBigInt,
  peekNByteArray,
  peekNStackItem,
  peekStackItem
} from './common';

export function validateCount1(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validateCount1]');
}

export function validateAltStackCount1(e: ExecutionEngine) {
  const stackCount = e.getAltStack().count();
  if (stackCount < 1) {
    throw errors.ERR_UNDER_STACK_LEN();
  }
}

export function validateCount2(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateCount2]');
}

export function validateCount3(e: ExecutionEngine) {
  logStackTrace(e, 3, '[validateCount3]');
}

export function validateShiftLeft(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateShift]');

  // x1 << x2
  const x2 = peekInt(e);
  const x1 = peekNBigInt(1, e);

  if (x2 < 0) {
    throw errors.ERR_SHIFT_BY_NEG();
  }
  if (!x1.isZero() && x2 > MAX_SIZE_FOR_BIGINTEGER * 8) {
    throw errors.ERR_OVER_MAX_BIGINTEGER_SIZE();
  }

  if (checkBigInteger(x1.shiftLeft(x2)) === false) {
    throw errors.ERR_OVER_MAX_BIGINTEGER_SIZE();
  }
}

export function validateShift(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateShift]');

  const bi = peekBigInteger(e);
  if (bi.isNegative()) {
    throw errors.ERR_SHIFT_BY_NEG();
  }
}

export function validatorPushData4(e: ExecutionEngine) {
  const index = e.getContext().getInstructionPointer();

  if (index + 4 >= e.getContext().getCodeLength()) {
    throw errors.ERR_OVER_CODE_LEN();
  }

  const l = e
    .getContext()
    .getCode()
    .readUInt32LE(index);
  if (l > MAX_BYTEARRAY_SIZE) {
    throw errors.ERR_OVER_MAX_ITEM_SIZE();
  }
}

export function validateCall(e: ExecutionEngine) {
  validateInvocationStack(e);
}

export function validateInvocationStack(e: ExecutionEngine) {
  if (e.getContexts().length >= MAX_INVOCATION_STACK_SIZE) {
    throw errors.ERR_OVER_STACK_LEN();
  }
}

export function validateOpStack(e: ExecutionEngine, desc: string) {
  const total = evaluationStackCount(e);
  if (total < 1) {
    throw errors.ERR_UNDER_STACK_LEN();
  }
  const index = peekBigInteger(e);
  const count = index.add(bigInt(2));
  if (index.isNegative() || count.compare(bigInt(total)) > 0) {
    throw errors.ERR_BAD_VALUE();
  }
}

export function validateXDrop(e: ExecutionEngine) {
  return validateOpStack(e, '[validateXDrop]');
}

export function validateXSwap(e: ExecutionEngine) {
  return validateOpStack(e, '[validateXSwap]');
}

export function validateXTuck(e: ExecutionEngine) {
  return validateOpStack(e, '[validateXTuck]');
}

export function validatePick(e: ExecutionEngine) {
  return validateOpStack(e, '[validatePick]');
}

export function validateRoll(e: ExecutionEngine) {
  return validateOpStack(e, '[validateRoll]');
}

export function validateCat(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateCat]');

  const p0 = peekNByteArray(0, e);
  const p1 = peekNByteArray(1, e);
  const l = p0.length + p1.length;
  if (l > MAX_BYTEARRAY_SIZE) {
    throw errors.ERR_OVER_MAX_ITEM_SIZE();
  }
}

export function validateSubStr(e: ExecutionEngine) {
  logStackTrace(e, 3, '[validateSubStr]');
  const count = peekNBigInt(0, e);

  if (count.isNegative()) {
    throw errors.ERR_BAD_VALUE();
  }
  const index = peekNBigInt(1, e);
  if (index.isNegative()) {
    throw errors.ERR_BAD_VALUE();
  }
  const arr = peekNByteArray(2, e);
  const temp = index.add(count);

  if (bigInt(arr.length).compare(temp) < 0) {
    throw errors.ERR_OVER_MAX_ARRAY_SIZE();
  }
}

export function validateLeft(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateLeft]');

  const count = peekNBigInt(0, e);
  if (count.isNegative()) {
    throw errors.ERR_BAD_VALUE();
  }

  const arr = peekNByteArray(1, e);
  if (bigInt(arr.length).compare(count) < 0) {
    throw errors.ERR_OVER_MAX_ARRAY_SIZE();
  }
}

export function validateRight(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateRight]');

  const count = peekNBigInt(0, e);

  if (count.isNegative()) {
    throw errors.ERR_BAD_VALUE();
  }
  const arr = peekNByteArray(1, e);

  if (bigInt(arr.length).compare(count) < 0) {
    throw errors.ERR_OVER_MAX_ARRAY_SIZE();
  }
}

export function validateInc(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validateInc]');
  const x = peekBigInteger(e);

  if (!checkBigInteger(x) || !checkBigInteger(x.add(bigInt.one))) {
    throw errors.ERR_BAD_VALUE();
  }
}

export function validateDec(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validateDec]');

  const x = peekBigInteger(e);

  if (!checkBigInteger(x) || ((x.isNegative() || x.isZero()) && !checkBigInteger(x.subtract(bigInt.one)))) {
    throw errors.ERR_BAD_VALUE();
  }
}

export function validateSign(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validateSign]');
}

export function validateAdd(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateAdd]');

  const x2 = peekBigInteger(e);

  const x1 = peekNBigInt(1, e);

  if (!checkBigInteger(x1) || !checkBigInteger(x2) || !checkBigInteger(x1.add(x2))) {
    throw errors.ERR_BAD_VALUE();
  }
}

export function validateSub(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateSub]');
  const x2 = peekBigInteger(e);
  const x1 = peekNBigInt(1, e);
  if (!checkBigInteger(x1) || !checkBigInteger(x2) || !checkBigInteger(x1.subtract(x2))) {
    throw errors.ERR_OVER_MAX_BIGINTEGER_SIZE();
  }
}

export function validateMul(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateMul]');
  const x2 = peekBigInteger(e);
  const x1 = peekNBigInt(1, e);

  const lx2 = bigIntToBytes(x2).length;
  const lx1 = bigIntToBytes(x1).length;
  if (lx2 > MAX_SIZE_FOR_BIGINTEGER || lx1 > MAX_SIZE_FOR_BIGINTEGER || lx1 + lx2 > MAX_SIZE_FOR_BIGINTEGER) {
    throw errors.ERR_OVER_MAX_BIGINTEGER_SIZE();
  }
}

export function validateDiv(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateAdd]');
  const x2 = peekBigInteger(e);
  const x1 = peekNBigInt(1, e);
  if (!checkBigInteger(x2) || !checkBigInteger(x1)) {
    throw errors.ERR_OVER_MAX_BIGINTEGER_SIZE();
  }
  if (x2.isZero()) {
    throw errors.ERR_DIV_MOD_BY_ZERO();
  }
}

export function validateMod(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateMod]');
  const x2 = peekBigInteger(e);

  const x1 = peekNBigInt(1, e);
  if (!checkBigInteger(x2) || !checkBigInteger(x1)) {
    throw errors.ERR_OVER_MAX_BIGINTEGER_SIZE();
  }
  if (x2.isZero()) {
    throw errors.ERR_DIV_MOD_BY_ZERO();
  }
}

export function validatePack(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validatePack]');

  const total = evaluationStackCount(e);
  const temp = peekBigInteger(e);
  let count = temp;
  if (count.isNegative()) {
    throw errors.ERR_BAD_VALUE();
  }

  if (count.compare(bigInt(MAX_ARRAY_SIZE)) > 0) {
    throw errors.ERR_OVER_MAX_ARRAY_SIZE();
  }
  count = count.add(bigInt.one);
  if (count.compare(bigInt(total)) > 0) {
    throw errors.ERR_OVER_STACK_LEN();
  }
}

export function validateUnpack(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validateUnpack]');
  const item = peekStackItem(e);

  if (!isArrayType(item)) {
    throw errors.ERR_NOT_ARRAY();
  }
}

/**
 * TODO: check if peekNStackItem can throw error
 * @param e
 */
export function validatePickItem(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validatePickItem]');

  const item = peekNStackItem(1, e);
  if (item === null) {
    throw errors.ERR_BAD_VALUE();
  }

  if (isArrayType(item) || isStructType(item)) {
    const index = peekBigInteger(e);

    if (index.isNegative()) {
      throw errors.ERR_BAD_VALUE();
    }
    const arr = item.getArray();

    if (index.compare(bigInt(arr.length)) >= 0) {
      throw errors.ERR_OVER_MAX_ARRAY_SIZE();
    }
  } else if (isMapType(item)) {
    const key = peekNStackItem(0, e);
    if (key == null) {
      throw errors.ERR_BAD_VALUE();
    }
    if (!key.isMapKey()) {
      throw errors.ERR_NOT_MAP_KEY();
    }

    if (item.tryGetValue(key) === undefined) {
      throw errors.ERR_MAP_NOT_EXIST();
    }
  } else {
    throw errors.ERR_NOT_SUPPORT_TYPE();
  }
}

export function validatorSetItem(e: ExecutionEngine) {
  logStackTrace(e, 3, '[validatorSetItem]');

  const value = peekNStackItem(0, e);
  if (value === undefined) {
    throw errors.ERR_BAD_VALUE();
  }

  const item = peekNStackItem(2, e);
  if (item === undefined) {
    throw errors.ERR_BAD_VALUE();
  }

  if (isArrayType(item) || isStructType(item)) {
    const index = peekNBigInt(1, e);
    if (index.isNegative()) {
      throw errors.ERR_BAD_VALUE();
    }
    const arr = item.getArray();

    if (index.compare(bigInt(arr.length)) >= 0) {
      throw errors.ERR_OVER_MAX_ARRAY_SIZE();
    }
  } else if (isMapType(item)) {
    const key = peekNStackItem(1, e);
    if (key === undefined) {
      throw errors.ERR_BAD_VALUE();
    }
    if (!key.isMapKey()) {
      throw errors.ERR_NOT_MAP_KEY();
    }
  } else {
    throw errors.ERR_NOT_SUPPORT_TYPE();
  }
}

export function validateNewArray(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validateNewArray]');

  const count = peekBigInteger(e);

  if (count.isNegative()) {
    throw errors.ERR_BAD_VALUE();
  }
  if (count.compare(bigInt(MAX_ARRAY_SIZE)) > 0) {
    throw errors.ERR_OVER_MAX_ARRAY_SIZE();
  }
}

export function validateNewStruct(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validateNewStruct]');

  const count = peekBigInteger(e);

  if (count.isNegative()) {
    throw errors.ERR_BAD_VALUE();
  }
  if (count.compare(bigInt(MAX_ARRAY_SIZE)) > 0) {
    throw errors.ERR_OVER_MAX_ARRAY_SIZE();
  }
}

export function validateAppend(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validateAppend]');

  const arrItem = peekNStackItem(1, e);

  if (!isArrayType(arrItem) && !isStructType(arrItem)) {
    throw errors.ERR_NOT_SUPPORT_TYPE();
  }
}

export function validatorReverse(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validatorReverse]');

  const arrItem = peekStackItem(e);

  if (!isArrayType(arrItem) && !isStructType(arrItem)) {
    throw errors.ERR_NOT_SUPPORT_TYPE();
  }
}

export function validatorRemove(e: ExecutionEngine) {
  logStackTrace(e, 2, '[validatorRemove]');

  const value = peekNStackItem(0, e);
  if (value === undefined) {
    throw errors.ERR_BAD_VALUE();
  }

  if (!value.isMapKey()) {
    throw errors.ERR_NOT_MAP_KEY();
  }

  const item = peekNStackItem(1, e);
  if (item === undefined) {
    throw errors.ERR_BAD_VALUE();
  }

  if (isArrayType(item) || isStructType(item)) {
    if (!isIntegerType(value)) {
      throw errors.ERR_BAD_TYPE();
    }
  } else if (!isMapType(item)) {
    throw errors.ERR_REMOVE_NOT_SUPPORT();
  }
}

export function validatorHasKey(e: ExecutionEngine) {
  const value = peekNStackItem(0, e);
  if (value === undefined) {
    throw errors.ERR_BAD_VALUE();
  }

  const item = peekNStackItem(1, e);
  if (item === undefined) {
    throw errors.ERR_BAD_VALUE();
  }

  if (isMapType(item)) {
    if (!value.isMapKey()) {
      throw errors.ERR_NOT_MAP_KEY();
    }
  } else if (!isArrayType(item) && !isStructType(item)) {
    throw errors.ERR_BAD_VALUE();
  }
}

export function validatorKeys(e: ExecutionEngine) {
  const item = peekNStackItem(0, e);
  if (item === undefined) {
    throw errors.ERR_BAD_VALUE();
  }

  if (!isMapType(item)) {
    throw errors.ERR_BAD_VALUE();
  }
}

export function validatorValues(e: ExecutionEngine) {
  const item = peekNStackItem(0, e);
  if (item === undefined) {
    throw errors.ERR_BAD_VALUE();
  }

  if (!isMapType(item) && !isArrayType(item) && !isStructType(item)) {
    throw errors.ERR_BAD_VALUE();
  }
}

export function validatorThrowIfNot(e: ExecutionEngine) {
  logStackTrace(e, 1, '[validatorThrowIfNot]');
}

export function checkBigInteger(value: bigInt.BigInteger | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  if (bigIntToBytes(value).length > MAX_SIZE_FOR_BIGINTEGER) {
    return false;
  }
  return true;
}

export function logStackTrace(e: ExecutionEngine, needStackCount: number, desc: string) {
  const stackCount = evaluationStackCount(e);
  if (stackCount < needStackCount) {
    throw errors.ERR_UNDER_STACK_LEN();
  }
}
