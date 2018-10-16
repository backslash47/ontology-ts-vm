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
import { Uint256 } from '../../common/uint256';
import { Block } from '../../core/block';
import { Header } from '../../core/header';
import { LedgerStore } from '../../core/ledgerStore';
import { DeployCode } from '../../core/payload/deployCode';
import { Transaction } from '../../core/transaction';

export class RuntimeLedgerStore implements LedgerStore {
  private currBlockHeight: number;
  private headerIndex: Map<number, Uint256>;
  private blocks: Map<string, Block>; // key is Uint256, but for searching it is serialized to string
  private contracts: Map<string, DeployCode>;

  constructor() {
    this.contracts = new Map<string, DeployCode>();
    this.headerIndex = new Map<number, Uint256>();
    this.blocks = new Map<string, Block>();
    this.currBlockHeight = 0;
  }

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
      throw new TracedError(`[getHeaderIndex] Invalid block height: ${height}`);
    }
    return blockHash;
  }

  /**
   * GetBlockByHeight return block by height.
   */
  getBlockByHeight(height: number): Block {
    const blockHash = this.getBlockHash(height);

    if (blockHash === undefined) {
      throw new TracedError(`[getBlockByHeight] Invalid block height: ${height}`);
    }
    return this.getBlockByHash(blockHash);
  }
  getHeaderByHash(blockHash: Uint256): Header {
    const block = this.getBlockByHash(blockHash);
    return block.getHeader();
  }
  getBlockByHash(blockHash: Uint256): Block {
    const hash = blockHash.toArray().toString('hex');
    const block = this.blocks.get(hash);

    if (block === undefined) {
      throw new TracedError(`[RuntimeLedgerStore] Block ${hash} not found.`);
    }

    return block;
  }
  getTransaction(txHash: Uint256): [Transaction, number] {
    throw new TracedError('Method not implemented.');
  }
  getContractState(contractHash: Address): DeployCode {
    const contract = this.contracts.get(contractHash.toHexString());

    if (contract === undefined) {
      throw new TracedError('Contract not found');
    }

    return contract;
  }

  deployContract(contractHash: Address, contract: DeployCode) {
    this.contracts.set(contractHash.toHexString(), contract);
  }

  addBlock(block: Block) {
    const index = block.getHeader().getHeight();
    const hash = block.getHash();

    this.headerIndex.set(index, hash);
    this.blocks.set(hash.toArray().toString('hex'), block);
  }
}
