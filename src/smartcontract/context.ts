import { Address } from '../common/address';
import { LedgerStore } from '../core/ledgerStore';
import { StateStore } from '../core/state/stateStore';
import { Transaction } from '../core/transaction';
import { LogEventInfo, NotifyEventInfo } from '../event/notifyEvents';
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
}

export interface Context {
  contractAddress: Address;
  code: Buffer;
}
