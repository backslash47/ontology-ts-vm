import { Address } from '../common/address';
import { LedgerStore } from '../core/ledgerStore';
import { StateStore } from '../core/state/stateStore';
import { Transaction } from '../core/transaction';
import { NotifyEventInfo } from '../event/notifyEvents';
import { ExecutionEngine } from '../vm/interfaces/engine';
import { StackItem } from '../vm/types/stackItem';

export interface ContextRef {
  pushContext(context: Context): void;
  currentContext(): Context | undefined;
  callingContext(): Context | undefined;
  entryContext(): Context | undefined;
  popContext(): void;
  checkWitness(address: Address): boolean;
  pushNotifications(notifications: NotifyEventInfo[]): void;
  newExecuteEngine(code: Buffer): VmService;
  checkUseGas(gas: Long): boolean;
  checkExecStep(): boolean;
}

export interface VmService {
  invoke(): StackItem | undefined;
  getEngine(): ExecutionEngine;
  getStore(): LedgerStore;

  getStateStore(): StateStore;
  getContextRef(): ContextRef;

  getTx(): Transaction;
  getTime(): number;

  addNotification(event: NotifyEventInfo): void;
  getNotifications(): NotifyEventInfo[];
}

export interface Context {
  contractAddress: Address;
  code: Buffer;
}
