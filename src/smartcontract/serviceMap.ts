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
import { ExecutionEngine } from '../vm/interfaces/engine';
import * as C from './consts';
import { NeoVmService } from './neovmService';
import { attributeGetData, attributeGetUsage } from './service/attribute';
import * as Block from './service/block';
import * as Chain from './service/blockchain';
import * as Contract from './service/contract';
import * as Header from './service/header';
import { nativeInvoke } from './service/native';
import * as Runtime from './service/runtime';
import * as Storage from './service/storage';
import { storageContextAsReadOnly } from './service/storageContext';
import * as System from './service/system';
import * as Transaction from './service/transaction';
import * as Validation from './service/validate';

interface Service {
  execute: (service: NeoVmService, engine: ExecutionEngine) => void;
  validator?: (engine: ExecutionEngine) => void;
}

export const ServiceMap: Map<string, Service> = new Map([
  [C.ATTRIBUTE_GETUSAGE_NAME, { execute: attributeGetUsage, validator: Validation.validatorAttribute }],
  [C.ATTRIBUTE_GETDATA_NAME, { execute: attributeGetData, validator: Validation.validatorAttribute }],
  [C.BLOCK_GETTRANSACTIONCOUNT_NAME, { execute: Block.blockGetTransactionCount, validator: Validation.validatorBlock }],
  [C.BLOCK_GETTRANSACTIONS_NAME, { execute: Block.blockGetTransactions, validator: Validation.validatorBlock }],
  [
    C.BLOCK_GETTRANSACTION_NAME,
    { execute: Block.blockGetTransaction, validator: Validation.validatorBlockTransaction }
  ],
  [C.BLOCKCHAIN_GETHEIGHT_NAME, { execute: Chain.blockChainGetHeight }],
  [
    C.BLOCKCHAIN_GETHEADER_NAME,
    { execute: Chain.blockChainGetHeader, validator: Validation.validatorBlockChainHeader }
  ],
  [C.BLOCKCHAIN_GETBLOCK_NAME, { execute: Chain.blockChainGetBlock, validator: Validation.validatorBlockChainBlock }],
  // tslint:disable-next-line:max-line-length
  [
    C.BLOCKCHAIN_GETTRANSACTION_NAME,
    { execute: Chain.blockChainGetTransaction, validator: Validation.validatorBlockChainTransaction }
  ],
  [
    C.BLOCKCHAIN_GETCONTRACT_NAME,
    { execute: Chain.blockChainGetContract, validator: Validation.validatorBlockChainContract }
  ],
  [C.BLOCKCHAIN_GETTRANSACTIONHEIGHT_NAME, { execute: Chain.blockChainGetTransactionHeight }],
  [C.HEADER_GETINDEX_NAME, { execute: Header.headerGetIndex, validator: Validation.validatorHeader }],
  [C.HEADER_GETHASH_NAME, { execute: Header.headerGetHash, validator: Validation.validatorHeader }],
  [C.HEADER_GETVERSION_NAME, { execute: Header.headerGetVersion, validator: Validation.validatorHeader }],
  [C.HEADER_GETPREVHASH_NAME, { execute: Header.headerGetPrevHash, validator: Validation.validatorHeader }],
  [C.HEADER_GETTIMESTAMP_NAME, { execute: Header.headerGetTimestamp, validator: Validation.validatorHeader }],
  [C.HEADER_GETCONSENSUSDATA_NAME, { execute: Header.headerGetConsensusData, validator: Validation.validatorHeader }],
  [C.HEADER_GETNEXTCONSENSUS_NAME, { execute: Header.headerGetNextConsensus, validator: Validation.validatorHeader }],
  [C.HEADER_GETMERKLEROOT_NAME, { execute: Header.headerGetMerkleRoot, validator: Validation.validatorHeader }],
  [C.TRANSACTION_GETHASH_NAME, { execute: Transaction.transactionGetHash, validator: Validation.validatorTransaction }],
  [C.TRANSACTION_GETTYPE_NAME, { execute: Transaction.transactionGetType, validator: Validation.validatorTransaction }],
  [
    C.TRANSACTION_GETATTRIBUTES_NAME,
    { execute: Transaction.transactionGetAttributes, validator: Validation.validatorTransaction }
  ],
  [C.CONTRACT_CREATE_NAME, { execute: Contract.contractCreate }],
  [C.CONTRACT_MIGRATE_NAME, { execute: Contract.contractMigrate }],
  [C.CONTRACT_GETSTORAGECONTEXT_NAME, { execute: Contract.contractGetStorageContext }],
  [C.CONTRACT_DESTROY_NAME, { execute: Contract.contractDestroy }],
  [C.CONTRACT_GETSCRIPT_NAME, { execute: Contract.contractGetCode, validator: Validation.validatorGetCode }],
  [C.RUNTIME_GETTIME_NAME, { execute: Runtime.runtimeGetTime }],
  [C.RUNTIME_CHECKWITNESS_NAME, { execute: Runtime.runtimeCheckWitness, validator: Validation.validatorCheckWitness }],
  [C.RUNTIME_NOTIFY_NAME, { execute: Runtime.runtimeNotify, validator: Validation.validatorNotify }],
  [C.RUNTIME_LOG_NAME, { execute: Runtime.runtimeLog, validator: Validation.validatorLog }],
  [C.RUNTIME_GETTRIGGER_NAME, { execute: Runtime.runtimeGetTrigger }],
  [C.RUNTIME_SERIALIZE_NAME, { execute: Runtime.runtimeSerialize, validator: Validation.validatorSerialize }],
  [C.RUNTIME_DESERIALIZE_NAME, { execute: Runtime.runtimeDeserialize, validator: Validation.validatorDeserialize }],
  [C.NATIVE_INVOKE_NAME, { execute: nativeInvoke }],
  [C.STORAGE_GET_NAME, { execute: Storage.storageGet }],
  [C.STORAGE_PUT_NAME, { execute: Storage.storagePut }],
  [C.STORAGE_DELETE_NAME, { execute: Storage.storageDelete }],
  [C.STORAGE_GETCONTEXT_NAME, { execute: Storage.storageGetContext }],
  [C.STORAGE_GETREADONLYCONTEXT_NAME, { execute: Storage.storageGetReadOnlyContext }],
  [
    C.STORAGECONTEXT_ASREADONLY_NAME,
    { execute: storageContextAsReadOnly, validator: Validation.validatorContextAsReadOnly }
  ],
  [C.GETSCRIPTCONTAINER_NAME, { execute: System.getCodeContainer }],
  [C.GETEXECUTINGSCRIPTHASH_NAME, { execute: System.getExecutingAddress }],
  [C.GETCALLINGSCRIPTHASH_NAME, { execute: System.getCallingAddress }],
  [C.GETENTRYSCRIPTHASH_NAME, { execute: System.getEntryAddress }]
]);
