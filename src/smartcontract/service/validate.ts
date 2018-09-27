import { Block, isBlock } from '../../core/block';
import { isDeployCode } from '../../core/payload/deployCode';
import { isTransaction } from '../../core/transaction';
import { isTransactionAttribute } from '../../core/transactionAttribute';
import { evaluationStackCount, peekInteropInterface, peekNBigInt } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';

export function validatorAttribute(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorAttribute] Too few input parameters ');
  }
  const d = peekInteropInterface(engine);

  if (!isTransactionAttribute(d)) {
    throw new Error('[validatorAttribute] Wrong type!');
  }
}

export function validatorBlock(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[Block] Too few input parameters ');
  }

  try {
    peekBlock(engine);
  } catch (e) {
    throw new Error(`[validatorBlock] Validate block fail: ${e}`);
  }
}

export function validatorBlockTransaction(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 2) {
    throw new Error('[validatorBlockTransaction] Too few input parameters ');
  }

  try {
    const block = peekBlock(engine);

    const item = peekNBigInt(1, engine);

    const index = item.toJSNumber();
    if (index < 0) {
      throw new Error('[validatorBlockTransaction] Pop index invalid!');
    }
    if (index >= block.getTransactions().length) {
      throw new Error('[validatorBlockTransaction] index invalid!');
    }
  } catch (e) {
    throw new Error(`[validatorBlockTransaction] Validate block fail: ${e}`);
  }
}

export function validatorBlockChainHeader(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorBlockChainHeader] Too few input parameters ');
  }
}

export function validatorBlockChainBlock(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorBlockChainBlock] Too few input parameters ');
  }
}

export function validatorBlockChainTransaction(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorBlockChainTransaction] Too few input parameters ');
  }
}

export function validatorBlockChainContract(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorBlockChainContract] Too few input parameters ');
  }
}

export function validatorHeader(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorHeader] Too few input parameters ');
  }
  peekInteropInterface(engine);
}

export function validatorTransaction(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorTransaction] Too few input parameters ');
  }
  const item = peekInteropInterface(engine);

  if (!isTransaction(item)) {
    throw new Error('[validatorTransaction] Transaction wrong type!');
  }
}

export function validatorGetCode(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorGetCode] Too few input parameters ');
  }
  const item = peekInteropInterface(engine);

  if (!isDeployCode(item)) {
    throw new Error('[validatorGetCode] DeployCode wrong type!');
  }
}

export function validatorCheckWitness(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorCheckWitness] Too few input parameters ');
  }
}

export function validatorNotify(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorNotify] Too few input parameters ');
  }
}

export function validatorLog(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorLog] Too few input parameters ');
  }
}

export function validatorSerialize(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorSerialize] Too few input parameters ');
  }
}

export function validatorDeserialize(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorDeSerialize] Too few input parameters ');
  }
}

export function validatorContextAsReadOnly(engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[validatorContextAsReadOnly] Too few input parameters ');
  }
}

function peekBlock(engine: ExecutionEngine): Block {
  const d = peekInteropInterface(engine);

  if (isBlock(d)) {
    return d;
  } else {
    throw new Error('[Block] Wrong type!');
  }
}
