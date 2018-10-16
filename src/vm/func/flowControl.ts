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
import * as O from '../opCode';
import { evaluationStackCount, popBoolean } from './common';

export function opNop(e: ExecutionEngine) {
  // noop
}

export function opJmp(e: ExecutionEngine) {
  const context = e.getContext();
  const opCode = e.getOpCode();
  let offset = context.getReader().readInt16();

  offset = context.getInstructionPointer() + offset - 3;

  if (offset < 0 || offset > context.getCodeLength()) {
    throw errors.ERR_FAULT();
  }
  let fValue: boolean = true;

  if (opCode > O.JMP) {
    if (evaluationStackCount(e) < 1) {
      throw errors.ERR_UNDER_STACK_LEN();
    }

    fValue = popBoolean(e);

    if (opCode === O.JMPIFNOT) {
      fValue = !fValue;
    }
  }

  if (fValue) {
    context.setInstructionPointer(offset);
  }
}

export function opCall(e: ExecutionEngine) {
  const context = e.getContext().clone();

  e.getContext().setInstructionPointer(e.getContext().getInstructionPointer() + 2);
  e.setOpCode(O.JMP);
  e.pushContext(context);
  opJmp(e);
}

export function opRet(e: ExecutionEngine) {
  e.popContext();
}
