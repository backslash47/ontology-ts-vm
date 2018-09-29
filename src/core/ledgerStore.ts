import { Address } from '../common/address';
import { Uint256 } from '../common/uint256';
import { Block } from './block';
import { Header } from './header';
import { DeployCode } from './payload/deployCode';
import { Transaction } from './transaction';

export interface LedgerStore {
  getCurrentBlockHeight(): number;

  /**
   * GetBlockHash return the block hash by block height
   */
  getBlockHash(height: number): Uint256;

  getHeaderIndex(height: number): Uint256;

  /**
   * GetBlockByHeight return block by height.
   */
  getBlockByHeight(height: number): Block;

  /**
   * GetHeaderByHash return the block header by block hash
   */
  getHeaderByHash(blockHash: Uint256): Header;

  /**
   * GetBlockByHash return block by block hash. Wrap function of BlockStore.GetBlockByHash
   */
  getBlockByHash(blockHash: Uint256): Block;

  /**
   * GetTransaction return transaction by transaction hash. Wrap function of BlockStore.GetTransaction
   */
  getTransaction(txHash: Uint256): [Transaction, number];

  /**
   * GetContractState return contract by contract address. Wrap function of StateStore.GetContractState
   */
  getContractState(contractHash: Address): DeployCode;

  deployContract(contractHash: Address, contract: DeployCode): void;
}
