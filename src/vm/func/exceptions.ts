import * as errors from '../errors';
import { ExecutionEngine } from '../interfaces/engine';
import { popBoolean } from './common';

export function opThrow(e: ExecutionEngine) {
  throw errors.ERR_FAULT;
}

export function opThrowIfNot(e: ExecutionEngine) {
  const b = popBoolean(e);
  if (!b) {
    throw errors.ERR_FAULT;
  }
}
