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
