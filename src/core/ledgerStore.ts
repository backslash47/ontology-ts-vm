import { Address } from '../common/address';
import { Uint256 } from '../common/uint256';
import { Block } from './block';
import { Header } from './header';
import { DeployCode } from './payload/deployCode';
import { Transaction } from './transaction';

export abstract class LedgerStore {
  private currBlockHeight: number;
  private headerIndex: Map<number, Uint256>;

  getCurrentBlockHeight(): number {
    return this.currBlockHeight;
  }

  /**
   * GetBlockHash return the block hash by block height
   */
  getBlockHash(height: number): Uint256 {
    return this.getHeaderIndex(height);
  }

  getHeaderIndex(height: number): Uint256 {
    const blockHash = this.headerIndex.get(height);
    if (blockHash === undefined) {
      throw new Error(`[getHeaderIndex] Invalid block height: ${height}`);
    }
    return blockHash;
  }

  /**
   * GetBlockByHeight return block by height.
   */
  getBlockByHeight(height: number): Block {
    const blockHash = this.getBlockHash(height);

    if (blockHash === undefined) {
      throw new Error(`[getBlockByHeight] Invalid block height: ${height}`);
    }
    return this.getBlockByHash(blockHash);
  }

  /**
   * GetHeaderByHash return the block header by block hash
   */
  abstract getHeaderByHash(blockHash: Uint256): Header;

  /**
   * GetBlockByHash return block by block hash. Wrap function of BlockStore.GetBlockByHash
   */
  abstract getBlockByHash(blockHash: Uint256): Block;

  /**
   * GetTransaction return transaction by transaction hash. Wrap function of BlockStore.GetTransaction
   */
  abstract getTransaction(txHash: Uint256): [Transaction, number];

  /**
   * GetContractState return contract by contract address. Wrap function of StateStore.GetContractState
   */
  abstract getContractState(contractHash: Address): DeployCode;
}
