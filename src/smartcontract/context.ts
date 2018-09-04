import { Address } from '../core/address';
import { LedgerStore } from '../core/ledgerStore';
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
}

export interface Context {
  contractAddress: Address;
  code: Buffer;
}
