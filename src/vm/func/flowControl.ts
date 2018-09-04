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
    throw errors.ERR_FAULT;
  }
  let fValue: boolean = true;

  if (opCode > O.JMP) {
    if (evaluationStackCount(e) < 1) {
      throw errors.ERR_UNDER_STACK_LEN;
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
