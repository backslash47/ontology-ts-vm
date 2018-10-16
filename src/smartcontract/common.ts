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
import { bigIntToBytes } from '../common/utils';
import { isArrayType } from '../vm/types/array';
import { isBooleanType } from '../vm/types/boolean';
import { isByteArrayType } from '../vm/types/byteArray';
import { isIntegerType } from '../vm/types/integer';
import { isInteropType } from '../vm/types/interop';
import { StackItem } from '../vm/types/stackItem';
import { isStructType } from '../vm/types/struct';

export function convertNeoVmTypeHexString(item: StackItem) {
  if (item === undefined) {
    return undefined;
  }

  if (isByteArrayType(item)) {
    const arr = item.getByteArray();
    return arr.toString('hex');
  } else if (isIntegerType(item)) {
    const i = item.getBigInteger();
    if (i.isZero()) {
      return '00';
    } else {
      return bigIntToBytes(i).toString('hex');
    }
  } else if (isBooleanType(item)) {
    const b = item.getBoolean();
    if (b) {
      return '01';
    } else {
      return '00';
    }
  } else if (isArrayType(item)) {
    const arr: any[] = [];
    const ar = item.getArray();

    for (const val of ar) {
      arr.push(convertNeoVmTypeHexString(val));
    }
    return arr;
  } else if (isStructType(item)) {
    const arr: any[] = [];
    const ar = item.getArray();

    for (const val of ar) {
      arr.push(convertNeoVmTypeHexString(val));
    }
    return arr;
  } else if (isInteropType(item)) {
    const it = item.getInterface();
    return it.toArray().toString('hex');
  } else {
    // tslint:disable-next-line:no-console
    console.log('[ConvertTypes] Invalid Types!');
  }
}
