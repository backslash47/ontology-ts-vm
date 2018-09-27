import * as bigInt from 'big-integer';
import { createHash, Hash } from 'crypto';
import * as errors from '../errors';
import { ExecutionEngine } from '../interfaces/engine';
import { Interop, isInterop } from '../interfaces/interop';
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

export function popBigInt(e: ExecutionEngine): bigInt.BigInteger {
  const x = popStackItem(e);
  return x.getBigInteger();
}

export function popInt(e: ExecutionEngine): number {
  const x = popBigInt(e);
  return x.toJSNumber();
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
  return x.toJSNumber();
}

export function peekBigInteger(e: ExecutionEngine): bigInt.BigInteger {
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

export function peekNBigInt(i: number, e: ExecutionEngine): bigInt.BigInteger {
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

export function bigIntOp(bi: bigInt.BigInteger, op: O.OpCode): bigInt.BigInteger {
  let nb: bigInt.BigInteger;

  switch (op) {
    case O.INC:
      nb = bi.add(bigInt.one);
      break;
    case O.DEC:
      nb = bi.subtract(bigInt.one);
      break;
    case O.NEGATE:
      nb = bi.negate();
      break;
    case O.ABS:
      nb = bi.abs();
      break;
    default:
      nb = bi;
  }
  return nb;
}

export function bigIntZip(ints1: bigInt.BigInteger, ints2: bigInt.BigInteger, op: O.OpCode): bigInt.BigInteger {
  let nb: bigInt.BigInteger;

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
      nb = ints1.subtract(ints2);
      break;
    case O.MUL:
      nb = ints1.multiply(ints2);
      break;
    case O.DIV:
      nb = ints1.divide(ints2);
      break;
    case O.MOD:
      nb = ints1.mod(ints2);
      break;
    case O.SHL:
      nb = ints1.shiftLeft(ints2.toJSNumber());
      break;
    case O.SHR:
      nb = ints1.shiftRight(ints2.toJSNumber());
      break;
    case O.MIN:
      nb = bigInt.min(ints1, ints2);
      break;
    case O.MAX:
      nb = bigInt.max(ints1, ints2);
      break;
    default:
      throw errors.ERR_NOT_SUPPORT_OPCODE;
  }
  return nb;
}

export function bigIntComp(bigint: bigInt.BigInteger, op: O.OpCode): boolean {
  let nb: boolean;

  switch (op) {
    case O.NZ:
      nb = !bigint.isZero();
      break;
    default:
      throw errors.ERR_NOT_SUPPORT_OPCODE;
  }
  return nb;
}

export function bigIntMultiComp(ints1: bigInt.BigInteger, ints2: bigInt.BigInteger, op: O.OpCode): boolean {
  let nb: boolean;

  switch (op) {
    case O.NUMEQUAL:
      nb = ints1.equals(ints2);
      break;
    case O.NUMNOTEQUAL:
      nb = ints1.notEquals(ints2);
      break;
    case O.LT:
      nb = ints1.lesser(ints2);
      break;
    case O.GT:
      nb = ints1.greater(ints2);
      break;
    case O.LTE:
      nb = ints1.lesserOrEquals(ints2);
      break;
    case O.GTE:
      nb = ints1.greaterOrEquals(ints2);
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

export function withInOp(int1: bigInt.BigInteger, int2: bigInt.BigInteger, int3: bigInt.BigInteger): boolean {
  const b1 = bigIntMultiComp(int1, int2, O.GTE);
  const b2 = bigIntMultiComp(int1, int3, O.LT);
  return boolZip(b1, b2, O.BOOLAND);
}

export function newStackItem(data: any): StackItem {
  let stackItem: StackItem;

  if (typeof data === 'number') {
    stackItem = new IntegerType(bigInt(data));
  } else if (bigInt.isInstance(data)) {
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
  let rp: Hash;

  switch (op) {
    case O.SHA1:
      sh = createHash('sha1');
      sh.update(b);
      return sh.digest();
    case O.SHA256:
      sh = createHash('sha256');
      sh.update(b);
      return sh.digest();
    case O.HASH160:
      sh = createHash('sha256');
      rp = createHash('ripemd160');
      sh.update(b);
      rp.update(sh.digest());
      return rp.digest();
    case O.HASH256:
      sh = createHash('sha256');
      rp = createHash('sha256');
      sh.update(b);
      rp.update(sh.digest());
      return rp.digest();
    default:
      throw errors.ERR_NOT_SUPPORT_OPCODE;
  }
}
