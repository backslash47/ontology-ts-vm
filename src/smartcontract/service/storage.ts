import { Address } from '../../common/address';
import { ST_CONTRACT, ST_STORAGE } from '../../core/state/dataEntryPrefix';
import { isStorageItem, StorageItem } from '../../core/state/storageItem';
import { evaluationStackCount, popByteArray, popInteropInterface, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { Writer } from '../../vm/utils/writer';
import { VmService } from '../context';
import { isStorageContext, StorageContext } from '../storageContext';

/**
 * StoragePut put smart contract storage item to cache
 */
export function storagePut(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 3) {
    throw new Error('[Context] Too few input parameters ');
  }

  try {
    const context = getContext(engine);

    if (context.isReadOnly()) {
      throw new Error('[StoragePut] storage read only!');
    }

    try {
      checkStorageContext(service, context);
    } catch (e) {
      throw new Error(`[StoragePut] check context error: ${e}`);
    }

    const key = popByteArray(engine);

    if (key.length > 1024) {
      throw new Error('[StoragePut] Storage key to long');
    }

    const value = popByteArray(engine);

    service.getStateStore().add(ST_STORAGE, getStorageKey(context.getAddress(), key), new StorageItem(value));
  } catch (e) {
    throw new Error('[StoragePut] get pop context error!');
  }
}

/**
 * StorageDelete delete smart contract storage item from cache
 */
export function storageDelete(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 2) {
    throw new Error('[Context] Too few input parameters ');
  }

  try {
    const context = getContext(engine);

    if (context.isReadOnly()) {
      throw new Error('[StorageDelete] storage read only!');
    }
    try {
      checkStorageContext(service, context);
    } catch (e) {
      throw new Error(`[StorageDelete] check context error: ${e}`);
    }
    const ba = popByteArray(engine);

    service.getStateStore().delete(ST_STORAGE, getStorageKey(context.getAddress(), ba));
  } catch (e) {
    throw new Error('[StorageDelete] get pop context error!');
  }
}

/**
 * StorageGet push smart contract storage item from cache to vm stack
 */
export function storageGet(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 2) {
    throw new Error('[Context] Too few input parameters ');
  }

  try {
    const context = getContext(engine);

    const ba = popByteArray(engine);
    const item = service.getStateStore().get(ST_STORAGE, getStorageKey(context.getAddress(), ba));

    if (item === undefined) {
      pushData(engine, new Buffer(''));
    } else {
      if (isStorageItem(item.value)) {
        pushData(engine, item.value.getValue());
      }
    }
  } catch (e) {
    throw new Error(`[StorageGet] get pop context error: ${e}`);
  }
}

/**
 * StorageGetContext push smart contract storage context to vm stack
 */
export function storageGetContext(service: VmService, engine: ExecutionEngine) {
  const ctx = service.getContextRef().currentContext();

  if (ctx === undefined) {
    throw new Error('[storageGetContext] Context is empty');
  }
  pushData(engine, new StorageContext(ctx.contractAddress));
}

export function storageGetReadOnlyContext(service: VmService, engine: ExecutionEngine) {
  const ctx = service.getContextRef().currentContext();

  if (ctx === undefined) {
    throw new Error('[storageGetContext] Context is empty');
  }

  const context = new StorageContext(ctx.contractAddress);
  context.setReadOnly(true);
  pushData(engine, context);
}

export function checkStorageContext(service: VmService, context: StorageContext) {
  try {
    const item = service.getStateStore().get(ST_CONTRACT, context.getAddress().toArray());
    if (item === undefined) {
      throw new Error('[CheckStorageContext] get context null!');
    }
  } catch (e) {
    throw new Error('[CheckStorageContext] get context fail!');
  }
}

export function getContext(engine: ExecutionEngine): StorageContext {
  const opInterface = popInteropInterface(engine);

  if (isStorageContext(opInterface)) {
    return opInterface;
  } else {
    throw new Error('[Context] Get storageContext invalid');
  }
}

export function getStorageKey(address: Address, key: Buffer): Buffer {
  const w = new Writer();
  w.writeBytes(address.toArray());
  w.writeBytes(key);
  return w.getBytes();
}
