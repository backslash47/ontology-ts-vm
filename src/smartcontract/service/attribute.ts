import { isTransactionAttribute } from '../../core/transactionAttribute';
import { popInteropInterface, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { VmService } from '../context';

// AttributeGetUsage put attribute's usage to vm stack
export function attributeGetUsage(service: VmService, engine: ExecutionEngine) {
  const i = popInteropInterface(engine);

  if (isTransactionAttribute(i)) {
    pushData(engine, i.getUsage());
  }
}

// AttributeGetData put attribute's data to vm stack
export function attributeGetData(service: VmService, engine: ExecutionEngine) {
  const i = popInteropInterface(engine);

  if (isTransactionAttribute(i)) {
    pushData(engine, i.getData());
  }
}
