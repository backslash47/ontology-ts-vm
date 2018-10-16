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
