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
import * as errors from '../errors';
import { ExecutionEngine } from '../interfaces/engine';
import { count, peekStackItem, popInt, popStackItem, push, pushData } from './common';

export function opToDupFromAltStack(e: ExecutionEngine) {
  const item = e.getAltStack().peek(0);

  if (item === undefined) {
    throw errors.ERR_OVER_STACK_LEN;
  }

  push(e, item);
}

export function opToAltStack(e: ExecutionEngine) {
  e.getAltStack().push(popStackItem(e));
}

export function opFromAltStack(e: ExecutionEngine) {
  const item = e.getAltStack().pop();

  if (item === undefined) {
    throw errors.ERR_OVER_STACK_LEN;
  }

  push(e, item);
}

export function opXDrop(e: ExecutionEngine) {
  const n = popInt(e);

  e.getEvaluationStack().remove(n);
}

export function opXSwap(e: ExecutionEngine) {
  const n = popInt(e);

  if (n === 0) {
    return;
  }

  e.getEvaluationStack().swap(0, n);
}

export function opXTuck(e: ExecutionEngine) {
  const n = popInt(e);
  e.getEvaluationStack().insert(n, peekStackItem(e));
}

export function opDepth(e: ExecutionEngine) {
  pushData(e, count(e));
}

export function opDrop(e: ExecutionEngine) {
  popStackItem(e);
}

export function opDup(e: ExecutionEngine) {
  push(e, peekStackItem(e));
}

export function opNip(e: ExecutionEngine) {
  const x2 = popStackItem(e);
  popStackItem(e);
  push(e, x2);
}

export function opOver(e: ExecutionEngine) {
  const x2 = popStackItem(e);
  const x1 = peekStackItem(e);

  push(e, x2);
  push(e, x1);
}

export function opPick(e: ExecutionEngine) {
  const n = popInt(e);

  const item = e.getEvaluationStack().peek(n);

  if (item === undefined) {
    throw errors.ERR_OVER_STACK_LEN;
  }

  push(e, item);
}

export function opRoll(e: ExecutionEngine) {
  const n = popInt(e);

  if (n === 0) {
    return;
  }

  const item = e.getEvaluationStack().remove(n);

  if (item === undefined) {
    throw errors.ERR_OVER_STACK_LEN;
  }

  push(e, item);
}

export function opRot(e: ExecutionEngine) {
  const x3 = popStackItem(e);
  const x2 = popStackItem(e);
  const x1 = popStackItem(e);
  push(e, x2);
  push(e, x3);
  push(e, x1);
}

export function opSwap(e: ExecutionEngine) {
  const x2 = popStackItem(e);
  const x1 = popStackItem(e);
  push(e, x2);
  push(e, x1);
}

export function opTuck(e: ExecutionEngine) {
  const x2 = popStackItem(e);
  const x1 = popStackItem(e);
  push(e, x2);
  push(e, x1);
  push(e, x2);
}
