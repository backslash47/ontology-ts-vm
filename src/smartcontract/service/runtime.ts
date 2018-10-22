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
import { Address } from '../../common/address';
import { TracedError } from '../../common/error';
import { bigIntFromBytes } from '../../common/utils';
import { PublicKey } from '../../crypto/publicKey';
import { MAX_BYTEARRAY_SIZE } from '../../vm/consts';
import { evaluationStackCount, popByteArray, popStackItem, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { ArrayType, isArrayType } from '../../vm/types/array';
import { BooleanType, isBooleanType } from '../../vm/types/boolean';
import { ByteArrayType, isByteArrayType } from '../../vm/types/byteArray';
import { IntegerType, isIntegerType } from '../../vm/types/integer';
import { isMapType, MapType } from '../../vm/types/map';
import { StackItem } from '../../vm/types/stackItem';
import { isStructType, MAX_STRUCT_DEPTH, StructType } from '../../vm/types/struct';
import { Reader } from '../../vm/utils/reader';
import { LimitedWriter, Writer } from '../../vm/utils/writer';
import { convertNeoVmTypeHexString } from '../common';
import { VmService } from '../context';

/**
 * HeaderGetNextConsensus put current block time to vm stack
 */
export function runtimeGetTime(service: VmService, engine: ExecutionEngine) {
  pushData(engine, service.getTime());
}

/**
 * RuntimeCheckWitness provide check permissions service.
 * If param address isn't exist in authorization list, check fail
 */
export function runtimeCheckWitness(service: VmService, engine: ExecutionEngine) {
  const data = popByteArray(engine);

  let result: boolean;
  if (data.length === 20) {
    const address = Address.parseFromBytes(data);

    result = service.getContextRef().checkWitness(address);
  } else {
    try {
      const pk = PublicKey.deserialize(data);
      result = service.getContextRef().checkWitness(Address.fromPubKey(pk));
    } catch (e) {
      throw new TracedError(`[RuntimeCheckWitness] data invalid: ${e}`);
    }
  }

  pushData(engine, result);
}

export function runtimeSerialize(service: VmService, engine: ExecutionEngine) {
  const item = popStackItem(engine);

  const buf = serializeStackItem(item);
  pushData(engine, buf);
}

export function runtimeDeserialize(service: VmService, engine: ExecutionEngine) {
  const data = popByteArray(engine);

  const item = deserializeStackItem(data);

  if (item !== undefined) {
    pushData(engine, item);
  }
}

// RuntimeNotify put smart contract execute event notify to notifications
export function runtimeNotify(service: VmService, engine: ExecutionEngine) {
  const item = popStackItem(engine);
  const context = service.getContextRef().currentContext();

  if (context === undefined) {
    throw new TracedError('[RuntimeNotify] No context present');
  }

  service.addNotification({ contractAddress: context.contractAddress, states: convertNeoVmTypeHexString(item) });
}

// RuntimeLog push smart contract execute event log to client
export function runtimeLog(service: VmService, engine: ExecutionEngine) {
  const item = popByteArray(engine);

  const context = service.getContextRef().currentContext();
  if (context === undefined) {
    throw new TracedError('[RuntimeNotify] No context present');
  }

  service.addLog({ contractAddress: context.contractAddress, message: item.toString(), tx: service.getTx().getHash() });
}

export function runtimeGetTrigger(service: VmService, engine: ExecutionEngine) {
  pushData(engine, 0);
}

export function runtimeBase58ToAddress(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[RuntimeBase58ToAddress] Too few input parameters');
  }
  const item = popByteArray(engine);

  const address = Address.fromBase58(item.toString());

  pushData(engine, address.toArray());
}

export function runtimeAddressToBase58(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[RuntimeAddressToBase58] Too few input parameters');
  }
  const item = popByteArray(engine);
  const address = Address.parseFromBytes(item);

  pushData(engine, new Buffer(address.toBase58()));
}

export function runtimeGetRandomHash(service: VmService, engine: ExecutionEngine) {
  pushData(engine, service.getRandomHash().toArray());
}

export function serializeStackItem(item: StackItem): Buffer {
  if (circularRefAndDepthDetection(item)) {
    throw new TracedError('runtime serialize: can not serialize circular reference data');
  }

  const writer = new LimitedWriter(MAX_BYTEARRAY_SIZE);
  serializeStackItemInternal(item, writer);

  return writer.getBytes();
}

export function deserializeStackItem(data: Buffer): StackItem {
  const r = new Reader(data);

  return deserializeStackItemInternal(r);
}

function serializeStackItemInternal(item: StackItem, w: Writer) {
  if (isByteArrayType(item)) {
    try {
      w.writeUint8(ByteArrayType.id);

      const ba = item.getByteArray();
      w.writeVarBytes(ba);
    } catch (e) {
      throw new TracedError(`Serialize ByteArray stackItems error.`, e);
    }
  } else if (isBooleanType(item)) {
    try {
      w.writeUint8(BooleanType.id);

      const b = item.getBoolean();
      w.writeUint8(b ? 1 : 0);
    } catch (e) {
      throw new TracedError(`Serialize Boolean stackItems error:`, e);
    }
  } else if (isIntegerType(item)) {
    try {
      w.writeUint8(IntegerType.id);

      const i = item.getByteArray();
      w.writeVarBytes(i);
    } catch (e) {
      throw new TracedError(`Serialize Integer stackItems error.`, e);
    }
  } else if (isArrayType(item)) {
    try {
      w.writeUint8(ArrayType.id);

      const a = item.getArray();
      w.writeVarUint(a.length);

      for (const v of a) {
        serializeStackItemInternal(v, w);
      }
    } catch (e) {
      throw new TracedError(`Serialize Array stackItems error.`, e);
    }
  } else if (isStructType(item)) {
    try {
      w.writeUint8(StructType.id);

      const a = item.getStruct();
      w.writeVarUint(a.length);

      for (const v of a) {
        serializeStackItemInternal(v, w);
      }
    } catch (e) {
      throw new TracedError(`Serialize Struct stackItems error.`, e);
    }
  } else if (isMapType(item)) {
    const unsortKey: string[] = [];

    const keyMap: Map<string, StackItem> = new Map();
    const mp = item.getMap();

    try {
      w.writeUint8(MapType.id);
      w.writeVarUint(mp.size);

      for (const [k] of mp.entries()) {
        if (isByteArrayType(k) || isIntegerType(k)) {
          const ba = k.getByteArray();
          const key = ba.toString();
          if (key === '') {
            throw new TracedError('Serialize Map error: invalid key type');
          }
          unsortKey.push(key);
          keyMap.set(key, k);
        } else {
          throw new TracedError('Unsupport map key type.');
        }
      }
    } catch (e) {
      throw new TracedError(`Serialize Struct stackItems error.`, e);
    }

    unsortKey.sort();

    for (const v of unsortKey) {
      const key = keyMap.get(v)!;

      serializeStackItemInternal(key, w);
      serializeStackItemInternal(mp.get(key)!, w);
    }
  } else {
    throw new TracedError('unknown type');
  }
}

function deserializeStackItemInternal(r: Reader): StackItem {
  try {
    const t = r.readByte();

    if (t === ByteArrayType.id) {
      try {
        const b = r.readVarBytes();
        return new ByteArrayType(b);
      } catch (e) {
        throw new TracedError(`Deserialize stackItems ByteArray error.`, e);
      }
    } else if (t === BooleanType.id) {
      try {
        const b = r.readByte() > 0;
        return new BooleanType(b);
      } catch (e) {
        throw new TracedError(`Deserialize stackItems Boolean error.`, e);
      }
    } else if (t === IntegerType.id) {
      try {
        const b = r.readVarBytes();
        return new IntegerType(bigIntFromBytes(b));
      } catch (e) {
        throw new TracedError(`Deserialize stackItems Integer error.`, e);
      }
    } else if (t === ArrayType.id || t === StructType.id) {
      try {
        const count = r.readVarUInt().toNumber();

        const arr: StackItem[] = [];

        for (let i = 0; i < count; i++) {
          const item = deserializeStackItemInternal(r);
          arr.push(item);
        }

        if (t === StructType.id) {
          return new StructType(arr);
        } else {
          return new ArrayType(arr);
        }
      } catch (e) {
        throw new TracedError(`Deserialize stackItems error.`, e);
      }
    } else if (t === MapType.id) {
      try {
        const count = r.readVarUInt().toNumber();

        const mp = new MapType();
        const m = mp.getMap();

        for (let i = 0; i < count; i++) {
          const key = deserializeStackItemInternal(r);
          const value = deserializeStackItemInternal(r);

          m.set(key, value);
        }
        return mp;
      } catch (e) {
        throw new TracedError(`Deserialize stackItems map error.`, e);
      }
    } else {
      throw new TracedError('unknown type');
    }
  } catch (e) {
    throw new TracedError(`Deserialize error.`, e);
  }
}

export function circularRefAndDepthDetection(value: StackItem): boolean {
  return circularRefAndDepthDetectionInternal(value, new Map(), 0);
}

function circularRefAndDepthDetectionInternal(value: StackItem, visited: Map<any, boolean>, depth: number): boolean {
  if (depth > MAX_STRUCT_DEPTH) {
    return true;
  }

  if (isArrayType(value)) {
    const a = value.getArray();
    if (a.length === 0) {
      return false;
    }

    if (visited.get(a)) {
      return true;
    }
    visited.set(a, true);

    for (const v of a) {
      if (circularRefAndDepthDetectionInternal(v, visited, depth + 1)) {
        return true;
      }
    }

    visited.delete(a);
    return false;
  } else if (isStructType(value)) {
    const s = value.getStruct();
    if (s.length === 0) {
      return false;
    }

    if (visited.get(s)) {
      return true;
    }
    visited.set(s, true);

    for (const v of s) {
      if (circularRefAndDepthDetectionInternal(v, visited, depth + 1)) {
        return true;
      }
    }

    visited.delete(s);
    return false;
  } else if (isMapType(value)) {
    const mp = value.getMap();

    if (visited.get(mp)) {
      return true;
    }
    visited.set(mp, true);

    for (const [k, v] of mp.entries()) {
      if (circularRefAndDepthDetectionInternal(k, visited, depth + 1)) {
        return true;
      }
      if (circularRefAndDepthDetectionInternal(v, visited, depth + 1)) {
        return true;
      }
    }

    visited.delete(mp);
    return false;
  } else {
    return false;
  }
}
