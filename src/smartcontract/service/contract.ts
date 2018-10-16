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
import { Address } from '../../common/address';
import { TracedError } from '../../common/error';
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
      const state = service.getStateStore().getOrAdd(ST_CONTRACT, contractAddress.toArray(), contract);
      pushData(engine, state);
    } catch (e) {
      throw new TracedError(`[ContractCreate] GetOrAdd error.`, e);
    }
  } catch (e) {
    throw new TracedError(`[ContractCreate] contract parameters invalid.`, e);
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
        throw new TracedError('[ContractMigrate] current contract context invalid!');
      }

      service.getStateStore().add(ST_CONTRACT, contractAddress.toArray(), contract);

      try {
        const items = storeMigration(service, context.contractAddress, contractAddress);

        service.getStateStore().delete(ST_CONTRACT, context.contractAddress.toArray());

        for (const v of items) {
          service.getStateStore().delete(ST_STORAGE, v.key);
        }

        pushData(engine, contract);
      } catch (e) {
        throw new TracedError(`[ContractMigrate] contract store migration error.`, e);
      }
    } catch (e) {
      throw new TracedError(`[ContractMigrate] contract invalid.`, e);
    }
  } catch (e) {
    throw new TracedError(`[ContractMigrate] contract parameters invalid.`, e);
  }
}

/**
 * ContractDestroy destroy a contract
 */
export function contractDestroy(service: VmService, engine: ExecutionEngine) {
  const context = service.getContextRef().currentContext();
  if (context === undefined) {
    throw new TracedError('[ContractDestory] current contract context invalid!');
  }

  try {
    const item = service.getStateStore().get(ST_CONTRACT, context.contractAddress.toArray());

    if (item === undefined) {
      throw new TracedError('[ContractDestroy] get current contract null!');
    }

    service.getStateStore().delete(ST_CONTRACT, context.contractAddress.toArray());

    try {
      const stateValues = service.getStateStore().find(ST_STORAGE, context.contractAddress.toArray());

      for (const v of stateValues) {
        service.getStateStore().delete(ST_STORAGE, v.key);
      }
    } catch (e) {
      throw new TracedError(`[ContractDestory] find error.`, e);
    }
  } catch (e) {
    throw new TracedError('[ContractDestroy] get current contract fail!');
  }
}

/**
 * ContractGetStorageContext put contract storage context to vm stack
 */
export function contractGetStorageContext(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new TracedError('[GetStorageContext] Too few input parameter!');
  }
  const opInterface = popInteropInterface(engine);

  if (isDeployCode(opInterface)) {
    const address = Address.parseFromVmCode(opInterface.getCode());

    try {
      const item = service.getStateStore().get(ST_CONTRACT, address.toArray());

      if (item === undefined) {
        throw new TracedError('[GetStorageContext] Get StorageContext null');
      }

      if (!address.equals(service.getContextRef().currentContext()!.contractAddress)) {
        throw new TracedError('[GetStorageContext] CodeHash not equal!');
      }
      pushData(engine, new StorageContext(address));
    } catch (e) {
      throw new TracedError(`[GetStorageContext] Get StorageContext error.`, e);
    }
  } else {
    throw new TracedError('[GetStorageContext] Pop data not contract!');
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
    throw new TracedError('[Contract] Too few input parameters');
  }
  const code = popByteArray(engine);

  if (code.length > 1024 * 1024) {
    throw new TracedError('[Contract] Code too long!');
  }
  const needStorage = popBoolean(engine);

  const name = popByteArray(engine);

  if (name.length > 252) {
    throw new TracedError('[Contract] Name too long!');
  }
  const version = popByteArray(engine);

  if (version.length > 252) {
    throw new TracedError('[Contract] Version too long!');
  }
  const author = popByteArray(engine);

  if (author.length > 252) {
    throw new TracedError('[Contract] Author too long!');
  }
  const email = popByteArray(engine);

  if (email.length > 252) {
    throw new TracedError('[Contract] Email too long!');
  }
  const desc = popByteArray(engine);

  if (desc.length > 65536) {
    throw new TracedError('[Contract] Desc too long!');
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
    const item = service.getStateStore().get(ST_CONTRACT, contractAddress.toArray());

    if (item !== undefined) {
      throw new TracedError(`[Contract] Get ${contractAddress} contract exist!`);
    }
  } catch (e) {
    throw new TracedError(`[Contract] Get contract ${contractAddress} error!`, e);
  }
}

function storeMigration(service: VmService, oldAddr: Address, newAddr: Address): StateItem[] {
  try {
    const stateValues = service.getStateStore().find(ST_STORAGE, oldAddr.toArray());

    for (const v of stateValues) {
      const subKey = v.key.slice(20);
      service.getStateStore().add(ST_STORAGE, getStorageKey(newAddr, subKey), v.value);
    }

    return stateValues;
  } catch (e) {
    throw new TracedError(`[Contract] Find error.`, e);
  }
}
