import { isTransaction } from '../../core/transaction';
import { popInteropInterface, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { StackItem } from '../../vm/types/stackItem';
import { VmService } from '../context';

/**
 * GetExecutingAddress push transaction's hash to vm stack
 */
export function transactionGetHash(service: VmService, engine: ExecutionEngine) {
  const txn = popInteropInterface(engine);

  if (isTransaction(txn)) {
    const txHash = txn.getHash();
    pushData(engine, txHash.toArray());
  }
}

/**
 * TransactionGetType push transaction's type to vm stack
 */
export function transactionGetType(service: VmService, engine: ExecutionEngine) {
  const txn = popInteropInterface(engine);

  if (isTransaction(txn)) {
    pushData(engine, txn.getTxType());
  }
}

/**
 * TransactionGetAttributes push transaction's attributes to vm stack
 */
export function transactionGetAttributes(service: VmService, engine: ExecutionEngine) {
  const txn = popInteropInterface(engine);

  if (isTransaction(txn)) {
    const attributList: StackItem[] = [];
    pushData(engine, attributList);
  }
}
