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
