import { ExecutionEngine } from '../vm/interfaces/engine';
import * as C from './consts';
import { NeoVmService } from './neovmService';
import { attributeGetData, attributeGetUsage } from './service/attribute';
import * as Block from './service/block';
import * as Chain from './service/blockchain';

interface Service {
  execute: (service: NeoVmService, engine: ExecutionEngine) => void;
  validator?: (engine: ExecutionEngine) => void;
}

export const ServiceMap: Map<string, Service> = new Map([
  [C.ATTRIBUTE_GETUSAGE_NAME, { execute: attributeGetUsage, validator: validatorAttribute }],
  [C.ATTRIBUTE_GETDATA_NAME, { execute: attributeGetData, validator: validatorAttribute }],
  [C.BLOCK_GETTRANSACTIONCOUNT_NAME, { execute: Block.blockGetTransactionCount, validator: validatorBlock }],
  [C.BLOCK_GETTRANSACTIONS_NAME, { execute: Block.blockGetTransactions, validator: validatorBlock }],
  [C.BLOCK_GETTRANSACTION_NAME, { execute: Block.blockGetTransaction, validator: validatorBlockTransaction }],
  [C.BLOCKCHAIN_GETHEIGHT_NAME, { execute: Chain.blockChainGetHeight }],
  [C.BLOCKCHAIN_GETHEADER_NAME, { execute: Chain.blockChainGetHeader, validator: validatorBlockChainHeader }],
  [C.BLOCKCHAIN_GETBLOCK_NAME, { execute: Chain.blockChainGetBlock, validator: validatorBlockChainBlock }],
  // tslint:disable-next-line:max-line-length
  [
    C.BLOCKCHAIN_GETTRANSACTION_NAME,
    { execute: Chain.blockChainGetTransaction, validator: validatorBlockChainTransaction }
  ],
  [C.BLOCKCHAIN_GETCONTRACT_NAME, { execute: Chain.blockChainGetContract, validator: validatorBlockChainContract }],
  [C.BLOCKCHAIN_GETTRANSACTIONHEIGHT_NAME, { execute: Chain.blockChainGetTransactionHeight }],
  [C.HEADER_GETINDEX_NAME, { execute: HeaderGetIndex, validator: validatorHeader }],
  [C.HEADER_GETHASH_NAME, { execute: HeaderGetHash, validator: validatorHeader }],
  [C.HEADER_GETVERSION_NAME, { execute: HeaderGetVersion, validator: validatorHeader }],
  [C.HEADER_GETPREVHASH_NAME, { execute: HeaderGetPrevHash, validator: validatorHeader }],
  [C.HEADER_GETTIMESTAMP_NAME, { execute: HeaderGetTimestamp, validator: validatorHeader }],
  [C.HEADER_GETCONSENSUSDATA_NAME, { execute: HeaderGetConsensusData, validator: validatorHeader }],
  [C.HEADER_GETNEXTCONSENSUS_NAME, { execute: HeaderGetNextConsensus, validator: validatorHeader }],
  [C.HEADER_GETMERKLEROOT_NAME, { execute: HeaderGetMerkleRoot, validator: validatorHeader }],
  [C.TRANSACTION_GETHASH_NAME, { execute: TransactionGetHash, validator: validatorTransaction }],
  [C.TRANSACTION_GETTYPE_NAME, { execute: TransactionGetType, validator: validatorTransaction }],
  [C.TRANSACTION_GETATTRIBUTES_NAME, { execute: TransactionGetAttributes, validator: validatorTransaction }],
  [C.CONTRACT_CREATE_NAME, { execute: ContractCreate }],
  [C.CONTRACT_MIGRATE_NAME, { execute: ContractMigrate }],
  [C.CONTRACT_GETSTORAGECONTEXT_NAME, { execute: ContractGetStorageContext }],
  [C.CONTRACT_DESTROY_NAME, { execute: ContractDestory }],
  [C.CONTRACT_GETSCRIPT_NAME, { execute: ContractGetCode, validator: validatorGetCode }],
  [C.RUNTIME_GETTIME_NAME, { execute: RuntimeGetTime }],
  [C.RUNTIME_CHECKWITNESS_NAME, { execute: RuntimeCheckWitness, validator: validatorCheckWitness }],
  [C.RUNTIME_NOTIFY_NAME, { execute: RuntimeNotify, validator: validatorNotify }],
  [C.RUNTIME_LOG_NAME, { execute: RuntimeLog, validator: validatorLog }],
  [C.RUNTIME_GETTRIGGER_NAME, { execute: RuntimeGetTrigger }],
  [C.RUNTIME_SERIALIZE_NAME, { execute: RuntimeSerialize, validator: validatorSerialize }],
  [C.RUNTIME_DESERIALIZE_NAME, { execute: RuntimeDeserialize, validator: validatorDeserialize }],
  [C.NATIVE_INVOKE_NAME, { execute: NativeInvoke }],
  [C.STORAGE_GET_NAME, { execute: StorageGet }],
  [C.STORAGE_PUT_NAME, { execute: StoragePut }],
  [C.STORAGE_DELETE_NAME, { execute: StorageDelete }],
  [C.STORAGE_GETCONTEXT_NAME, { execute: StorageGetContext }],
  [C.STORAGE_GETREADONLYCONTEXT_NAME, { execute: StorageGetReadOnlyContext }],
  [C.STORAGECONTEXT_ASREADONLY_NAME, { execute: StorageContextAsReadOnly, validator: validatorContextAsReadOnly }],
  [C.GETSCRIPTCONTAINER_NAME, { execute: GetCodeContainer }],
  [C.GETEXECUTINGSCRIPTHASH_NAME, { execute: GetExecutingAddress }],
  [C.GETCALLINGSCRIPTHASH_NAME, { execute: GetCallingAddress }],
  [C.GETENTRYSCRIPTHASH_NAME, { execute: GetEntryAddress }]
]);
