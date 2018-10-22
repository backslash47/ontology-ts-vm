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
import { Address } from '../common/address';
import { Uint256 } from '../common/uint256';
import { LedgerStore } from '../core/ledgerStore';
import { StateStore } from '../core/state/stateStore';
import { Transaction } from '../core/transaction';
import { LogEventInfo, NotificationCallback, NotifyEventInfo } from '../event/notifyEvents';
import { ExecutionContext } from '../vm/executionContext';
import { ExecutionEngine, RandomAccessStack } from '../vm/interfaces/engine';
import { OpCode } from '../vm/opCode';
import { StackItem } from '../vm/types/stackItem';

export interface ContextRef {
  pushContext(context: Context): void;
  currentContext(): Context | undefined;
  callingContext(): Context | undefined;
  entryContext(): Context | undefined;
  popContext(): void;
  checkWitness(address: Address): boolean;
  pushNotifications(notifications: NotifyEventInfo[]): void;
  pushLogs(logs: LogEventInfo[]): void;
  newExecuteEngine(code: Buffer): VmService;
  checkUseGas(gas: Long): boolean;
  checkExecStep(): boolean;
}

export interface InspectData {
  opCode: OpCode;
  opName: string;
  instructionPointer: number;

  contractAddress: Address;
  evaluationStack: RandomAccessStack;
  altStack: RandomAccessStack;
  contexts: ExecutionContext[];
}

export type Inspect = (data: InspectData) => Promise<boolean>;

export interface InvokeOptions {
  inspect?: Inspect;
}

export interface VmService {
  invoke(options?: InvokeOptions): Promise<StackItem | undefined>;
  getEngine(): ExecutionEngine;
  getStore(): LedgerStore;

  getStateStore(): StateStore;
  getContextRef(): ContextRef;

  getTx(): Transaction;
  getTime(): number;

  addNotification(event: NotifyEventInfo): void;
  addLog(event: LogEventInfo): void;
  getNotifications(): NotifyEventInfo[];
  getLogs(): LogEventInfo[];
  getNotificationCallback(): NotificationCallback | undefined;

  getRandomHash(): Uint256;
}

export interface Context {
  contractAddress: Address;
  code: Buffer;
}
