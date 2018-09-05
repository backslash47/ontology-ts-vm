import { Address } from '../../common/address';
import { Uint256 } from '../../common/uint256';
import { bigIntFromBytes } from '../../common/utils';
import { Block } from '../../core/block';
import { Header } from '../../core/header';
import { evaluationStackCount, popByteArray, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { VmService } from '../context';

/**
 * BlockChainGetHeight put blockchain's height to vm stack
 */
export function blockChainGetHeight(service: VmService, engine: ExecutionEngine) {
  pushData(engine, service.getStore().getCurrentBlockHeight());
}
/**
 * BlockChainGetHeader put blockchain's header to vm stack
 */
export function blockChainGetHeader(service: VmService, engine: ExecutionEngine) {
  let header: Header;

  const data = popByteArray(engine);

  const l = data.length;
  if (l <= 5) {
    const b = bigIntFromBytes(data);
    const height = b.toNumber();
    const hash = service.getStore().getBlockHash(height);

    try {
      header = service.getStore().getHeaderByHash(hash);
    } catch (e) {
      throw new Error(`[BlockChainGetHeader] GetHeader error: ${e}`);
    }
  } else if (l === 32) {
    const hash = Uint256.parseFromBytes(data);
    header = service.getStore().getHeaderByHash(hash);

    try {
      header = service.getStore().getHeaderByHash(hash);
    } catch (e) {
      throw new Error(`[BlockChainGetHeader] GetHeader error: ${e}`);
    }
  } else {
    throw new Error('[BlockChainGetHeader] data invalid.');
  }
  pushData(engine, header);
}

/**
 * BlockChainGetBlock put blockchain's block to vm stack
 */
export function blockChainGetBlock(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[BlockChainGetBlock] Too few input parameters ');
  }
  const data = popByteArray(engine);

  let block: Block;

  const l = data.length;
  if (l <= 5) {
    const b = bigIntFromBytes(data);
    const height = b.toNumber();

    try {
      block = service.getStore().getBlockByHeight(height);
    } catch (e) {
      throw new Error(`[BlockChainGetBlock] GetBlock error: ${e}`);
    }
  } else if (l === 32) {
    const hash = Uint256.parseFromBytes(data);

    try {
      block = service.getStore().getBlockByHash(hash);
    } catch (e) {
      throw new Error(`[BlockChainGetBlock] GetBlock error: ${e}`);
    }
  } else {
    throw new Error('[BlockChainGetBlock] data invalid.');
  }
  pushData(engine, block);
}

/**
 * BlockChainGetTransaction put blockchain's transaction to vm stack
 */
export function blockChainGetTransaction(service: VmService, engine: ExecutionEngine) {
  const d = popByteArray(engine);
  const hash = Uint256.parseFromBytes(d);

  try {
    const [t] = service.getStore().getTransaction(hash);
    pushData(engine, t);
  } catch (e) {
    throw new Error(`[BlockChainGetTransaction] GetTransaction error: ${e}`);
  }
}

/**
 * BlockChainGetContract put blockchain's contract to vm stack
 */
export function blockChainGetContract(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[GetContract] Too few input parameters ');
  }
  const b = popByteArray(engine);
  const address = Address.parseFromBytes(b);

  try {
    const item = service.getStore().getContractState(address);
    pushData(engine, item);
  } catch (e) {
    throw new Error(`[GetContract] GetAsset error: ${e}`);
  }
}

/**
 * BlockChainGetTransactionHeight put transaction in block height to vm stack
 */
export function blockChainGetTransactionHeight(service: VmService, engine: ExecutionEngine) {
  if (evaluationStackCount(engine) < 1) {
    throw new Error('[BlockChainGetTransactionHeight] Too few input parameters ');
  }
  const d = popByteArray(engine);

  const hash = Uint256.parseFromBytes(d);

  try {
    const [_, h] = service.getStore().getTransaction(hash);
    pushData(engine, h);
  } catch (e) {
    throw new Error(`[BlockChainGetTransaction] GetTransaction error: ${e}`);
  }
}
