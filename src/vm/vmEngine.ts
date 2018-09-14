import * as errors from './errors';
import { ExecutionContext } from './executionContext';
import { pushData } from './func/common';
import { BREAK, ExecutionEngine, FAULT, HALT, NONE, RandomAccessStack, VMState } from './interfaces/engine';
import { OpCode } from './opCode';
import * as O from './opCode';
import { OpExec, OpExecList } from './opExec';
import { Stack } from './utils/stack';

export class VMEngine implements ExecutionEngine {
  private evaluationStack: RandomAccessStack;
  private altStack: RandomAccessStack;
  private state: VMState;
  private contexts: ExecutionContext[];
  private context: ExecutionContext;
  private opCode: OpCode;
  private opExec: OpExec;

  constructor() {
    this.contexts = [];
    this.evaluationStack = new Stack();
    this.altStack = new Stack();
    this.state = BREAK;
    this.opCode = 0;
  }

  getContext() {
    return this.context;
  }

  getContexts() {
    return this.contexts;
  }

  getOpCode() {
    return this.opCode;
  }

  getOpExec() {
    return this.opExec;
  }

  getState() {
    return this.state;
  }

  setOpCode(opCode: OpCode) {
    this.opCode = opCode;
  }

  getEvaluationStack() {
    return this.evaluationStack;
  }

  getAltStack() {
    return this.altStack;
  }

  currentContext(): ExecutionContext {
    return this.contexts[this.contexts.length - 1];
  }

  popContext() {
    this.contexts.pop();

    if (this.contexts.length !== 0) {
      this.context = this.currentContext();
    } else {
      this.state = NONE;
    }
  }

  pushContext(context: ExecutionContext) {
    this.contexts.push(context);
    this.context = this.currentContext();
  }

  execute() {
    // tslint:disable-next-line:no-bitwise
    this.state = this.state & ~BREAK;
    while (true) {
      if (this.state === FAULT || this.state === HALT || this.state === BREAK) {
        break;
      }
      const error = this.stepInto();

      if (error !== undefined) {
        return error;
      }
    }
  }

  executeCode() {
    const code = this.context.getReader().readByte();
    this.opCode = code;
  }

  validateOp() {
    const opExec = OpExecList.get(this.opCode);

    if (opExec === undefined) {
      throw errors.ERR_NOT_SUPPORT_OPCODE;
    }
    this.opExec = opExec;
  }

  stepInto(): Error | undefined {
    try {
      this.executeOp();
    } catch (e) {
      this.state = FAULT;

      if (e instanceof Error) {
        return e;
      } else {
        return new Error(e);
      }
    }
  }

  executeOp() {
    if (this.opCode >= O.PUSHBYTES1 && this.opCode <= O.PUSHBYTES75) {
      pushData(this, this.context.getReader().readBytes(this.opCode));

      return;
    }

    if (this.opExec.validator !== undefined) {
      this.opExec.validator(this);
    }

    if (this.opExec.exec !== undefined) {
      this.opExec.exec(this);
    }
  }
}
