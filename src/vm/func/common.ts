import { createHash, Hash } from 'crypto';
import * as Long from 'long';
import * as errors from '../errors';
import { ExecutionEngine } from '../interfaces/engine';
import { isInterop, Interop } from '../interfaces/interop';
import * as O from '../opCode';
import { ArrayType, isArrayType } from '../types/array';
import { BooleanType, isBooleanType } from '../types/boolean';
import { ByteArrayType, isByteArrayType } from '../types/byteArray';
import { IntegerType, isIntegerType } from '../types/integer';
import { InteropType } from '../types/interop';
import { isMapType } from '../types/map';
import { isStackItemArrayType, isStackItemType, StackItem } from '../types/stackItem';
import { isStructType } from '../types/struct';

export function pushData(e: ExecutionEngine, data: any) {
  e.getEvaluationStack().push(newStackItem(data));
}

export function popBigInt(e: ExecutionEngine): Long {
  const x = popStackItem(e);
  return x.getBigInteger();
}

export function popInt(e: ExecutionEngine): number {
  const x = popBigInt(e);
  return x.toNumber();
}

export function popBoolean(e: ExecutionEngine): boolean {
  const x = popStackItem(e);
  return x.getBoolean();
}

export function popArray(e: ExecutionEngine): StackItem[] {
  const x = popStackItem(e);
  return x.getArray();
}

export function popInteropInterface(e: ExecutionEngine): Interop {
  const x = popStackItem(e);
  return x.getInterface();
}

export function popByteArray(e: ExecutionEngine): Buffer {
  const x = popStackItem(e);
  return x.getByteArray();
}

export function popStackItem(e: ExecutionEngine): StackItem {
  const item = e.getEvaluationStack().pop();

  if (item === undefined) {
    throw errors.ERR_OVER_STACK_LEN;
  }

  return item;
}

export function peekArray(e: ExecutionEngine): StackItem[] {
  const x = peekStackItem(e);
  return x.getArray();
}

export function peekInteropInterface(e: ExecutionEngine): Interop {
  const x = peekStackItem(e);
  return x.getInterface();
}

export function peekInt(e: ExecutionEngine): number {
  const x = peekBigInteger(e);
  return x.toNumber();
}

export function peekBigInteger(e: ExecutionEngine): Long {
  const x = peekStackItem(e);
  return x.getBigInteger();
}

export function peekStackItem(e: ExecutionEngine): StackItem {
  const item = e.getEvaluationStack().peek(0);

  if (item === undefined) {
    throw errors.ERR_OVER_STACK_LEN;
  }

  return item;
}

export function peekNBigInt(i: number, e: ExecutionEngine): Long {
  const x = peekNStackItem(i, e);
  return x.getBigInteger();
}

export function peekNByteArray(i: number, e: ExecutionEngine): Buffer {
  const x = peekNStackItem(i, e);
  return x.getByteArray();
}

export function peekNStackItem(i: number, e: ExecutionEngine): StackItem {
  const item = e.getEvaluationStack().peek(i);

  if (item === undefined) {
    throw errors.ERR_OVER_STACK_LEN;
  }

  return item;
}

export function bigIntOp(bi: Long, op: O.OpCode): Long {
  let nb: Long;

  switch (op) {
    case O.INC:
      nb = bi.add(Long.ONE);
    case O.DEC:
      nb = bi.sub(Long.ONE);
    case O.NEGATE:
      nb = bi.neg();
    case O.ABS:
      nb = bi.isPositive() ? bi : bi.neg();
    default:
      nb = bi;
  }
  return nb;
}

export function bigIntZip(ints1: Long, ints2: Long, op: O.OpCode): Long {
  let nb: Long;

  switch (op) {
    case O.AND:
      nb = ints1.and(ints2);
      break;
    case O.OR:
      nb = ints1.or(ints2);
      break;
    case O.XOR:
      nb = ints1.xor(ints2);
      break;
    case O.ADD:
      nb = ints1.add(ints2);
      break;
    case O.SUB:
      nb = ints1.sub(ints2);
      break;
    case O.MUL:
      nb = ints1.mul(ints2);
      break;
    case O.DIV:
      nb = ints1.div(ints2);
      break;
    case O.MOD:
      nb = ints1.mod(ints2);
      break;
    case O.SHL:
      nb = ints1.shl(ints2);
      break;
    case O.SHR:
      nb = ints1.shr(ints2);
      break;
    case O.MIN:
      if (ints1.comp(ints2) <= 0) {
        nb = ints1;
      } else {
        nb = ints2;
      }
      break;
    case O.MAX:
      if (ints1.comp(ints2) <= 0) {
        nb = ints2;
      } else {
        nb = ints1;
      }
      break;
    default:
      throw errors.ERR_NOT_SUPPORT_OPCODE;
  }
  return nb;
}

export function bigIntComp(bigint: Long, op: O.OpCode): boolean {
  let nb: boolean;

  switch (op) {
    case O.NZ:
      nb = bigint.comp(Long.ZERO) !== 0;
      break;
    default:
      throw errors.ERR_NOT_SUPPORT_OPCODE;
  }
  return nb;
}

export function bigIntMultiComp(ints1: Long, ints2: Long, op: O.OpCode): boolean {
  let nb: boolean;

  switch (op) {
    case O.NUMEQUAL:
      nb = ints1.comp(ints2) === 0;
      break;
    case O.NUMNOTEQUAL:
      nb = ints1.comp(ints2) !== 0;
      break;
    case O.LT:
      nb = ints1.comp(ints2) < 0;
      break;
    case O.GT:
      nb = ints1.comp(ints2) > 0;
      break;
    case O.LTE:
      nb = ints1.comp(ints2) <= 0;
      break;
    case O.GTE:
      nb = ints1.comp(ints2) >= 0;
      break;
    default:
      throw errors.ERR_NOT_SUPPORT_OPCODE;
  }
  return nb;
}

export function boolZip(bi1: boolean, bi2: boolean, op: O.OpCode): boolean {
  let nb: boolean;
  switch (op) {
    case O.BOOLAND:
      nb = bi1 && bi2;
      break;
    case O.BOOLOR:
      nb = bi1 || bi2;
      break;
    default:
      throw errors.ERR_NOT_SUPPORT_OPCODE;
  }
  return nb;
}

export function withInOp(int1: Long, int2: Long, int3: Long): boolean {
  const b1 = bigIntMultiComp(int1, int2, O.GTE);
  const b2 = bigIntMultiComp(int1, int3, O.LT);
  return boolZip(b1, b2, O.BOOLAND);
}

export function newStackItem(data: any): StackItem {
  let stackItem: StackItem;

  if (typeof data === 'number') {
    stackItem = new IntegerType(Long.fromNumber(data));
  } else if (data instanceof Long) {
    stackItem = new IntegerType(data);
  } else if (typeof data === 'boolean') {
    stackItem = new BooleanType(data);
  } else if (data instanceof Buffer) {
    stackItem = new ByteArrayType(data);
  } else if (isIntegerType(data)) {
    stackItem = data;
  } else if (isBooleanType(data)) {
    stackItem = data;
  } else if (isByteArrayType(data)) {
    stackItem = data;
  } else if (isArrayType(data)) {
    stackItem = data;
  } else if (isStackItemArrayType(data)) {
    stackItem = new ArrayType(data);
  } else if (isMapType(data)) {
    stackItem = data;
  } else if (isStructType(data)) {
    stackItem = data;
  } else if (isStackItemType(data)) {
    stackItem = data;
  } else if (isInterop(data)) {
    stackItem = new InteropType(data);
  } else {
    throw new Error('Invalid data type!');
  }

  return stackItem;
}

export function evaluationStackCount(e: ExecutionEngine): number {
  return e.getEvaluationStack().count();
}

export function push(e: ExecutionEngine, element: StackItem) {
  e.getEvaluationStack().push(element);
}

export function count(e: ExecutionEngine): number {
  return e.getEvaluationStack().count();
}

export function hash(b: Buffer, op: O.OpCode): Buffer {
  let sh: Hash;

  switch (op) {
    case O.SHA1:
      sh = createHash('sha1');
      break;
    case O.SHA256:
      sh = createHash('sha256');
      break;
    default:
      throw errors.ERR_NOT_SUPPORT_OPCODE;
  }

  sh.update(b);
  return sh.digest();
}
