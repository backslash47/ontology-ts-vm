import { ExecutionEngine } from '../interfaces/engine';
import { popBigInt, popStackItem, pushData } from './common';

export function opInvert(e: ExecutionEngine) {
  const i = popBigInt(e);
  pushData(e, i.not());
}

export function opEqual(e: ExecutionEngine) {
  const b1 = popStackItem(e);
  const b2 = popStackItem(e);
  pushData(e, b1.equals(b2));
}
