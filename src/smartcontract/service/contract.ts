import { Address } from '../../common/address';
import { DeployCode, isDeployCode } from '../../core/payload/deployCode';
import { ST_CONTRACT, ST_STORAGE } from '../../core/state/dataEntryPrefix';
import { getStorageKey, StateItem } from '../../core/state/stateStore';
import { evaluationStackCount, popBoolean, popByteArray, popInteropInterface, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { VmService } from '../context';
import { StorageContext } from '../storageContext';

/**
 * ContractCreate create a new smart contract on blockchain, and put it to vm stack
 */
export function contractCreate(service: VmService, engine: ExecutionEngine) {
  try {
    const contract = isContractParamValid(engine);

    const contractAddress = Address.parseFromVmCode(contract.getCode());
    try {
      const state = service.getCloneCache().getOrAdd(ST_CONTRACT, contractAddress.toArray(), contract);
      pushData(engine, state);
    } catch (e) {
      throw new Error(`[ContractCreate] GetOrAdd error: ${e}`);
    }
  } catch (e) {
    throw new Error(`[ContractCreate] contract parameters invalid: ${e}`);
  }
}

/**
 * ContractMigrate migrate old smart contract to a new contract, and destroy old contract
 */
export function contractMigrate(service: VmService, engine: ExecutionEngine) {
  try {
    const contract = isContractParamValid(engine);

    const contractAddress = Address.parseFromVmCode(contract.getCode());

    try {
      isContractExist(service, contractAddress);

      const context = service.getContextRef().currentContext();
      if (context === undefined) {
        throw new Error('[ContractMigrate] current contract context invalid!');
      }

      service.getCloneCache().add(ST_CONTRACT, contractAddress.toArray(), contract);

      try {
        const items = storeMigration(service, context.contractAddress, contractAddress);

        service.getCloneCache().delete(ST_CONTRACT, context.contractAddress.toArray());

        for (const v of items) {
          service.getCloneCache().delete(ST_STORAGE, new Buffer(v.key));
        }

        pushData(engine, contract);
      } catch (e) {
        throw new Error(`[ContractMigrate] contract store migration error: ${e}`);
      }
    } catch (e) {
      throw new Error(`[ContractMigrate] contract invalid: ${e}`);
    }
  } catch (e) {
    throw new Error(`[ContractMigrate] contract parameters invalid: ${e}`);
  }
}

/**
 * ContractDestroy destroy a contract
 */
export function contractDestroy(service: VmService, engine: ExecutionEngine) {
  const context = service.getContextRef().currentContext();
  if (context === undefined) {
    throw new Error('[ContractDestory] current contract context invalid!');
  }

  try {
    const item = service
      .getCloneCache()
      .getStore()
      .tryGet(ST_CONTRACT, context.contractAddress.toArray());

    if (item === undefined) {
      throw new Error('[ContractDestroy] get current contract null!');
    }

    service.getCloneCache().delete(ST_CONTRACT, context.contractAddress.toArray());

    try {
      const stateValues = service
        .getCloneCache()
        .getStore()
        .find(ST_STORAGE, context.contractAddress.toArray());

      for (const v of stateValues) {
        service.getCloneCache().delete(ST_STORAGE, new Buffer(v.key));
      }
    } catch (e) {
      throw new Error(`[ContractDestory] find error: ${e}`);
    }
  } catch (e) {
    throw new Error('[ContractDestroy] get current contract fail!');
  }
}

/**
 * ContractGetStorageContext put contract storage context to vm stack
 */
export function contractGetStorageContext(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[GetStorageContext] Too few input parameter!');
  }
  const opInterface = popInteropInterface(engine);

  if (isDeployCode(opInterface)) {
    const address = Address.parseFromVmCode(opInterface.getCode());

    try {
      const item = service
        .getCloneCache()
        .getStore()
        .tryGet(ST_CONTRACT, address.toArray());

      if (item === undefined) {
        throw new Error('[GetStorageContext] Get StorageContext null');
      }

      if (!address.equals(service.getContextRef().currentContext()!.contractAddress)) {
        throw new Error('[GetStorageContext] CodeHash not equal!');
      }
      pushData(engine, new StorageContext(address));
    } catch (e) {
      throw new Error(`[GetStorageContext] Get StorageContext error: ${e}`);
    }
  } else {
    throw new Error('[GetStorageContext] Pop data not contract!');
  }
}

/**
 * ContractGetCode put contract to vm stack
 */
export function contractGetCode(service: VmService, engine: ExecutionEngine) {
  const i = popInteropInterface(engine);

  if (isDeployCode(i)) {
    pushData(engine, i.getCode());
  }
}

function isContractParamValid(engine: ExecutionEngine): DeployCode {
  if (evaluationStackCount(engine) < 7) {
    throw new Error('[Contract] Too few input parameters');
  }
  const code = popByteArray(engine);

  if (code.length > 1024 * 1024) {
    throw new Error('[Contract] Code too long!');
  }
  const needStorage = popBoolean(engine);

  const name = popByteArray(engine);

  if (name.length > 252) {
    throw new Error('[Contract] Name too long!');
  }
  const version = popByteArray(engine);

  if (version.length > 252) {
    throw new Error('[Contract] Version too long!');
  }
  const author = popByteArray(engine);

  if (author.length > 252) {
    throw new Error('[Contract] Author too long!');
  }
  const email = popByteArray(engine);

  if (email.length > 252) {
    throw new Error('[Contract] Email too long!');
  }
  const desc = popByteArray(engine);

  if (desc.length > 65536) {
    throw new Error('[Contract] Desc too long!');
  }
  const contract = new DeployCode({
    code,
    needStorage,
    name: name.toString('utf-8'),
    version: version.toString('utf-8'),
    author: author.toString('utf-8'),
    email: email.toString('utf-8'),
    description: desc.toString('utf-8')
  });
  return contract;
}

function isContractExist(service: VmService, contractAddress: Address) {
  try {
    const item = service.getCloneCache().get(ST_CONTRACT, contractAddress.toArray());

    if (item !== undefined) {
      throw new Error(`[Contract] Get ${contractAddress} contract exist!`);
    }
  } catch (e) {
    throw new Error(`[Contract] Get contract ${contractAddress} error!`);
  }
}

function storeMigration(service: VmService, oldAddr: Address, newAddr: Address): StateItem[] {
  try {
    const stateValues = service
      .getCloneCache()
      .getStore()
      .find(ST_STORAGE, oldAddr.toArray());

    for (const v of stateValues) {
      const subKey = new Buffer(v.key).slice(20);
      service.getCloneCache().add(ST_STORAGE, getStorageKey(newAddr, subKey), v.value);
    }

    return stateValues;
  } catch (e) {
    throw new Error(`[Contract] Find error: ${e}`);
  }
}
