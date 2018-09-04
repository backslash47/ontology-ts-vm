import { ExecutionEngine } from '../interfaces/engine';
import {
  bigIntComp,
  bigIntMultiComp,
  bigIntOp,
  bigIntZip,
  boolZip,
  popBigInt,
  popBoolean,
  pushData,
  withInOp
} from './common';

export function opBigInt(e: ExecutionEngine) {
  const x = popBigInt(e);
  pushData(e, bigIntOp(x, e.getOpCode()));
}

export function opSign(e: ExecutionEngine) {
  const x = popBigInt(e);

  pushData(e, x.isPositive() ? 1 : -1);
}

export function opNot(e: ExecutionEngine) {
  const x = popBoolean(e);
  pushData(e, !x);
}

export function opNz(e: ExecutionEngine) {
  const x = popBigInt(e);
  pushData(e, bigIntComp(x, e.getOpCode()));
}

export function opBigIntZip(e: ExecutionEngine) {
  const x2 = popBigInt(e);
  const x1 = popBigInt(e);
  const b = bigIntZip(x1, x2, e.getOpCode());
  pushData(e, b);
}

export function opBoolZip(e: ExecutionEngine) {
  const x2 = popBoolean(e);
  const x1 = popBoolean(e);
  pushData(e, boolZip(x1, x2, e.getOpCode()));
}

export function opBigIntComp(e: ExecutionEngine) {
  const x2 = popBigInt(e);
  const x1 = popBigInt(e);
  pushData(e, bigIntMultiComp(x1, x2, e.getOpCode()));
}

export function opWithIn(e: ExecutionEngine) {
  const b = popBigInt(e);
  const a = popBigInt(e);
  const c = popBigInt(e);
  pushData(e, withInOp(c, a, b));
}
