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
