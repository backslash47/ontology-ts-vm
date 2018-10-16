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
import { Address } from '../../common/address';
import { TracedError } from '../../common/error';
import { bigIntToBytes } from '../../common/utils';
import { evaluationStackCount, popByteArray, popInt, popStackItem, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { isArrayType } from '../../vm/types/array';
import { isBooleanType } from '../../vm/types/boolean';
import { isByteArrayType } from '../../vm/types/byteArray';
import { isIntegerType } from '../../vm/types/integer';
import { StackItem } from '../../vm/types/stackItem';
import { isStructType } from '../../vm/types/struct';
import { Writer } from '../../vm/utils/writer';
import { METHOD_LENGTH_LIMIT } from '../consts';
import { VmService } from '../context';
import { NativeVmService } from '../nativeVmService';
import { Contract } from '../states/contract';

export function nativeInvoke(service: VmService, engine: ExecutionEngine) {
  const count = evaluationStackCount(engine);
  if (count < 4) {
    throw new TracedError(`invoke native contract invalid parameters ${count} < 4`);
  }
  const version = popInt(engine);
  const address = popByteArray(engine);
  let addr;
  try {
    addr = Address.parseFromBytes(address);
  } catch (e) {
    throw new TracedError(`invoke native contract:${address}, address invalid`, e);
  }

  const method = popByteArray(engine);

  if (method.length > METHOD_LENGTH_LIMIT) {
    throw new TracedError(`invoke native contract:${address} method:${method} too long, over max length 1024 limit`);
  }
  const args = popStackItem(engine);

  const buf = buildParamToNative(args);

  const contract = new Contract({
    version,
    address: addr,
    method: method.toString(),
    args: buf
  });

  const sink = new Writer();
  contract.serialize(sink);

  const native = new NativeVmService({
    stateStore: service.getStateStore(),
    code: sink.getBytes(),
    tx: service.getTx(),
    // height: service.getHeight(),
    time: service.getTime(),
    contextRef: service.getContextRef(),
    serviceMap: new Map()
  });

  const result = native.invoke();

  pushData(engine, result);
}

function buildParamToNative(item: StackItem) {
  const w = new Writer();
  buildParamToNativeInternal(w, item);
  return w.getBytes();
}

function buildParamToNativeInternal(w: Writer, item: StackItem) {
  if (isByteArrayType(item)) {
    w.writeVarBytes(item.getByteArray());
  } else if (isIntegerType(item)) {
    w.writeVarBytes(item.getByteArray());
  } else if (isBooleanType(item)) {
    w.writeBool(item.getBoolean());
  } else if (isArrayType(item)) {
    const arr = item.getArray();

    const length = bigIntToBytes(bigInt(arr.length));
    w.writeVarBytes(length);

    for (const v of arr) {
      buildParamToNativeInternal(w, v);
    }
  } else if (isStructType(item)) {
    const st = item.getStruct();

    for (const v of st) {
      buildParamToNativeInternal(w, v);
    }
  } else {
    throw new TracedError(`convert neovm params to native invalid type support: ${item.getType()}`);
  }
}
