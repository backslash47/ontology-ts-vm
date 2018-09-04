import { ExecutionEngine } from '../interfaces/engine';
import { popByteArray, popInt, pushData } from './common';

export function opCat(e: ExecutionEngine) {
  const b2 = popByteArray(e);

  const b1 = popByteArray(e);

  const r = Buffer.concat([b1, b2]);
  pushData(e, r);
}

export function opSubStr(e: ExecutionEngine) {
  const count = popInt(e);
  const index = popInt(e);

  const arr = popByteArray(e);

  const b = arr.slice(index, index + count);
  pushData(e, b);
}

export function opLeft(e: ExecutionEngine) {
  const count = popInt(e);

  const s = popByteArray(e);
  const b = s.slice(0, count);
  pushData(e, b);
}

/**
 * TODO: check if correct
 * @param e
 */
export function opRight(e: ExecutionEngine) {
  const count = popInt(e);

  const arr = popByteArray(e);

  const b = arr.slice(arr.length - count, arr.length);
  pushData(e, b);
}

export function opSize(e: ExecutionEngine) {
  const b = popByteArray(e);
  pushData(e, b.length);
}
