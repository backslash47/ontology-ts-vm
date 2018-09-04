import { ExecutionEngine } from '../interfaces/engine';
import { hash, popByteArray, pushData } from './common';

export function opHash(e: ExecutionEngine) {
  const x = popByteArray(e);
  pushData(e, hash(x, e.getOpCode()));
}
