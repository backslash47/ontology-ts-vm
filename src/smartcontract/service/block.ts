import { isBlock } from '../../core/block';
import { popInt, popInteropInterface, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { InteropType } from '../../vm/types/interop';
import { VmService } from '../context';

/**
 * BlockGetTransactionCount put block's transactions count to vm stack
 */
export function blockGetTransactionCount(service: VmService, engine: ExecutionEngine) {
  const i = popInteropInterface(engine);

  if (isBlock(i)) {
    pushData(engine, i.getTransactions().length);
  }
}

/**
 * BlockGetTransactions put block's transactions to vm stack
 */
export function blockGetTransactions(service: VmService, engine: ExecutionEngine) {
  const i = popInteropInterface(engine);

  if (isBlock(i)) {
    const transactions = i.getTransactions();
    const transactionList = transactions.map((transaction) => new InteropType(transaction));

    pushData(engine, transactionList);
  }
}

/**
 * BlockGetTransaction put block's transaction to vm stack
 */
export function blockGetTransaction(service: VmService, engine: ExecutionEngine) {
  const i = popInteropInterface(engine);

  const index = popInt(engine);

  if (isBlock(i)) {
    pushData(engine, i.getTransactions()[index]);
  }
}
