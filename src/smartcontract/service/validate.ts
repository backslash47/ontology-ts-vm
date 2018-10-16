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
import { TracedError } from '../../common/error';
import { Block, isBlock } from '../../core/block';
import { isDeployCode } from '../../core/payload/deployCode';
import { isTransaction } from '../../core/transaction';
import { isTransactionAttribute } from '../../core/transactionAttribute';
import { evaluationStackCount, peekInteropInterface, peekNBigInt } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';

export function validatorAttribute(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorAttribute] Too few input parameters ');
  }
  const d = peekInteropInterface(engine);

  if (!isTransactionAttribute(d)) {
    throw new TracedError('[validatorAttribute] Wrong type!');
  }
}

export function validatorBlock(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[Block] Too few input parameters ');
  }

  try {
    peekBlock(engine);
  } catch (e) {
    throw new TracedError(`[validatorBlock] Validate block fail.`, e);
  }
}

export function validatorBlockTransaction(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 2) {
    throw new TracedError('[validatorBlockTransaction] Too few input parameters ');
  }

  try {
    const block = peekBlock(engine);

    const item = peekNBigInt(1, engine);

    const index = item.toJSNumber();
    if (index < 0) {
      throw new TracedError('[validatorBlockTransaction] Pop index invalid!');
    }
    if (index >= block.getTransactions().length) {
      throw new TracedError('[validatorBlockTransaction] index invalid!');
    }
  } catch (e) {
    throw new TracedError(`[validatorBlockTransaction] Validate block fail.`, e);
  }
}

export function validatorBlockChainHeader(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorBlockChainHeader] Too few input parameters ');
  }
}

export function validatorBlockChainBlock(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorBlockChainBlock] Too few input parameters ');
  }
}

export function validatorBlockChainTransaction(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorBlockChainTransaction] Too few input parameters ');
  }
}

export function validatorBlockChainContract(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorBlockChainContract] Too few input parameters ');
  }
}

export function validatorHeader(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorHeader] Too few input parameters ');
  }
  peekInteropInterface(engine);
}

export function validatorTransaction(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorTransaction] Too few input parameters ');
  }
  const item = peekInteropInterface(engine);

  if (!isTransaction(item)) {
    throw new TracedError('[validatorTransaction] Transaction wrong type!');
  }
}

export function validatorGetCode(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorGetCode] Too few input parameters ');
  }
  const item = peekInteropInterface(engine);

  if (!isDeployCode(item)) {
    throw new TracedError('[validatorGetCode] DeployCode wrong type!');
  }
}

export function validatorCheckWitness(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorCheckWitness] Too few input parameters ');
  }
}

export function validatorNotify(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorNotify] Too few input parameters ');
  }
}

export function validatorLog(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorLog] Too few input parameters ');
  }
}

export function validatorSerialize(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorSerialize] Too few input parameters ');
  }
}

export function validatorDeserialize(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorDeSerialize] Too few input parameters ');
  }
}

export function validatorContextAsReadOnly(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[validatorContextAsReadOnly] Too few input parameters ');
  }
}

function peekBlock(engine: ExecutionEngine): Block {
  const d = peekInteropInterface(engine);

  if (isBlock(d)) {
    return d;
  } else {
    throw new TracedError('[Block] Wrong type!');
  }
}
