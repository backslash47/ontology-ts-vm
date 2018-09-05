import { popInteropInterface, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { VmService } from '../context';
import { isStorageContext, StorageContext } from '../storageContext';

export function storageContextAsReadOnly(service: VmService, engine: ExecutionEngine) {
  const data = popInteropInterface(engine);

  if (isStorageContext(data)) {
    let context = data;
    if (!context.isReadOnly()) {
      context = new StorageContext(context.getAddress());
      context.setReadOnly(true);
    }
    pushData(engine, context);
  } else {
    throw new Error('pop storage context type invalid');
  }
}
