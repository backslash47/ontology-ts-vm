import { ExecutionContext } from '../executionContext';
import { OpCode } from '../opCode';
import { OpExec } from '../opExec';
import { StackItem } from '../types/stackItem';
import { Stack } from '../utils/stack';

export type VMState = number;

export const NONE: VMState = 0;
export const HALT: VMState = 1;
export const FAULT: VMState = 2;
export const BREAK: VMState = 4;

export const INSUFFICIENT_RESOURCE: VMState = 8;

export type RandomAccessStack = Stack<StackItem>;

export interface ExecutionEngine {
  getOpCode(): OpCode;
  setOpCode(opCode: OpCode): void;

  getOpExec(): OpExec;

  getState(): VMState;

  getEvaluationStack(): RandomAccessStack;
  getAltStack(): RandomAccessStack;

  getContext(): ExecutionContext;
  getContexts(): ExecutionContext[];

  pushContext(context: ExecutionContext): void;
  popContext(): void;

  /**
   * TODO: rename - it's misleading
   */
  executeCode(): void;

  validateOp(): void;

  stepInto(): Error | undefined;
}
