import { Address } from '../../common/address';
import { Uint256 } from '../../common/uint256';
import { Block } from '../../core/block';
import { Header } from '../../core/header';
import { LedgerStore } from '../../core/ledgerStore';
import { DeployCode } from '../../core/payload/deployCode';
import { Transaction } from '../../core/transaction';

export class RuntimeLedgerStore extends LedgerStore {
  getHeaderByHash(blockHash: Uint256): Header {
    throw new Error('Method not implemented.');
  }
  getBlockByHash(blockHash: Uint256): Block {
    throw new Error('Method not implemented.');
  }
  getTransaction(txHash: Uint256): [Transaction, number] {
    throw new Error('Method not implemented.');
  }
  getContractState(contractHash: Address): DeployCode {
    throw new Error('Method not implemented.');
  }
}
