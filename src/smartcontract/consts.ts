import * as Long from 'long';
// Gas Limit
export const MIN_TRANSACTION_GAS = Long.fromNumber(20000); // Per transaction base cost.
export const BLOCKCHAIN_GETHEADER_GAS = Long.fromNumber(100);
export const BLOCKCHAIN_GETBLOCK_GAS = Long.fromNumber(200);
export const BLOCKCHAIN_GETTRANSACTION_GAS = Long.fromNumber(100);
export const BLOCKCHAIN_GETCONTRACT_GAS = Long.fromNumber(100);
export const CONTRACT_CREATE_GAS = Long.fromNumber(20000000);
export const CONTRACT_MIGRATE_GAS = Long.fromNumber(20000000);
export const UINT_DEPLOY_CODE_LEN_GAS = Long.fromNumber(200000);
export const UINT_INVOKE_CODE_LEN_GAS = Long.fromNumber(20000);
export const NATIVE_INVOKE_GAS = Long.fromNumber(1000);
export const STORAGE_GET_GAS = Long.fromNumber(200);
export const STORAGE_PUT_GAS = Long.fromNumber(4000);
export const STORAGE_DELETE_GAS = Long.fromNumber(100);
export const RUNTIME_CHECKWITNESS_GAS = Long.fromNumber(200);
export const APPCALL_GAS = Long.fromNumber(10);
export const TAILCALL_GAS = Long.fromNumber(10);
export const SHA1_GAS = Long.fromNumber(10);
export const SHA256_GAS = Long.fromNumber(10);
export const HASH160_GAS = Long.fromNumber(20);
export const HASH256_GAS = Long.fromNumber(20);
export const OPCODE_GAS = Long.fromNumber(1);

export const PER_UNIT_CODE_LEN = 1024;
export const METHOD_LENGTH_LIMIT = 1024;
export const MAX_STACK_SIZE = 1024;
export const VM_STEP_LIMIT = 400000;

// API Name
export const ATTRIBUTE_GETUSAGE_NAME = 'Ontology.Attribute.GetUsage';
export const ATTRIBUTE_GETDATA_NAME = 'Ontology.Attribute.GetData';

export const BLOCK_GETTRANSACTIONCOUNT_NAME = 'System.Block.GetTransactionCount';
export const BLOCK_GETTRANSACTIONS_NAME = 'System.Block.GetTransactions';
export const BLOCK_GETTRANSACTION_NAME = 'System.Block.GetTransaction';
export const BLOCKCHAIN_GETHEIGHT_NAME = 'System.Blockchain.GetHeight';
export const BLOCKCHAIN_GETHEADER_NAME = 'System.Blockchain.GetHeader';
export const BLOCKCHAIN_GETBLOCK_NAME = 'System.Blockchain.GetBlock';
export const BLOCKCHAIN_GETTRANSACTION_NAME = 'System.Blockchain.GetTransaction';
export const BLOCKCHAIN_GETCONTRACT_NAME = 'System.Blockchain.GetContract';
export const BLOCKCHAIN_GETTRANSACTIONHEIGHT_NAME = 'System.Blockchain.GetTransactionHeight';

export const HEADER_GETINDEX_NAME = 'System.Header.GetIndex';
export const HEADER_GETHASH_NAME = 'System.Header.GetHash';
export const HEADER_GETVERSION_NAME = 'Ontology.Header.GetVersion';
export const HEADER_GETPREVHASH_NAME = 'System.Header.GetPrevHash';
export const HEADER_GETTIMESTAMP_NAME = 'System.Header.GetTimestamp';
export const HEADER_GETCONSENSUSDATA_NAME = 'Ontology.Header.GetConsensusData';
export const HEADER_GETNEXTCONSENSUS_NAME = 'Ontology.Header.GetNextConsensus';
export const HEADER_GETMERKLEROOT_NAME = 'Ontology.Header.GetMerkleRoot';

export const TRANSACTION_GETHASH_NAME = 'System.Transaction.GetHash';
export const TRANSACTION_GETTYPE_NAME = 'Ontology.Transaction.GetType';
export const TRANSACTION_GETATTRIBUTES_NAME = 'Ontology.Transaction.GetAttributes';

export const CONTRACT_CREATE_NAME = 'System.Contract.Create';
export const CONTRACT_MIGRATE_NAME = 'System.Contract.Migrate';
export const CONTRACT_GETSTORAGECONTEXT_NAME = 'System.Contract.GetStorageContext';
export const CONTRACT_DESTROY_NAME = 'System.Contract.Destroy';
export const CONTRACT_GETSCRIPT_NAME = 'System.Contract.GetScript';

export const STORAGE_GET_NAME = 'System.Storage.Get';
export const STORAGE_PUT_NAME = 'System.Storage.Put';
export const STORAGE_DELETE_NAME = 'System.Storage.Delete';
export const STORAGE_GETCONTEXT_NAME = 'System.Storage.GetContext';
export const STORAGE_GETREADONLYCONTEXT_NAME = 'System.Storage.GetReadOnlyContext';

export const STORAGECONTEXT_ASREADONLY_NAME = 'System.StorageContext.AsReadOnly';

export const RUNTIME_GETTIME_NAME = 'System.Runtime.GetTime';
export const RUNTIME_CHECKWITNESS_NAME = 'System.Runtime.CheckWitness';
export const RUNTIME_NOTIFY_NAME = 'System.Runtime.Notify';
export const RUNTIME_LOG_NAME = 'System.Runtime.Log';
export const RUNTIME_GETTRIGGER_NAME = 'System.Runtime.GetTrigger';
export const RUNTIME_SERIALIZE_NAME = 'System.Runtime.Serialize';
export const RUNTIME_DESERIALIZE_NAME = 'System.Runtime.Deserialize';

export const NATIVE_INVOKE_NAME = 'Ontology.Native.Invoke';

export const GETSCRIPTCONTAINER_NAME = 'System.ExecutionEngine.GetScriptContainer';
export const GETEXECUTINGSCRIPTHASH_NAME = 'System.ExecutionEngine.GetExecutingScriptHash';
export const GETCALLINGSCRIPTHASH_NAME = 'System.ExecutionEngine.GetCallingScriptHash';
export const GETENTRYSCRIPTHASH_NAME = 'System.ExecutionEngine.GetEntryScriptHash';

export const APPCALL_NAME = 'APPCALL';
export const TAILCALL_NAME = 'TAILCALL';
export const SHA1_NAME = 'SHA1';
export const SHA256_NAME = 'SHA256';
export const HASH160_NAME = 'HASH160';
export const HASH256_NAME = 'HASH256';
export const UINT_DEPLOY_CODE_LEN_NAME = 'Deploy.Code.Gas';
export const UINT_INVOKE_CODE_LEN_NAME = 'Invoke.Code.Gas';

export const MAX_EXECUTE_ENGINE = 1024;

export const GasTable: Map<string, Long> = new Map([
  [BLOCKCHAIN_GETHEADER_NAME, BLOCKCHAIN_GETHEADER_GAS],
  [BLOCKCHAIN_GETBLOCK_NAME, BLOCKCHAIN_GETBLOCK_GAS],
  [BLOCKCHAIN_GETTRANSACTION_NAME, BLOCKCHAIN_GETTRANSACTION_GAS],
  [BLOCKCHAIN_GETCONTRACT_NAME, BLOCKCHAIN_GETCONTRACT_GAS],
  [CONTRACT_CREATE_NAME, CONTRACT_CREATE_GAS],
  [CONTRACT_MIGRATE_NAME, CONTRACT_MIGRATE_GAS],
  [STORAGE_GET_NAME, STORAGE_GET_GAS],
  [STORAGE_PUT_NAME, STORAGE_PUT_GAS],
  [STORAGE_DELETE_NAME, STORAGE_DELETE_GAS],
  [RUNTIME_CHECKWITNESS_NAME, RUNTIME_CHECKWITNESS_GAS],
  [NATIVE_INVOKE_NAME, NATIVE_INVOKE_GAS],
  [APPCALL_NAME, APPCALL_GAS],
  [TAILCALL_NAME, TAILCALL_GAS],
  [SHA1_NAME, SHA1_GAS],
  [SHA256_NAME, SHA256_GAS],
  [HASH160_NAME, HASH160_GAS],
  [HASH256_NAME, HASH256_GAS],
  [UINT_DEPLOY_CODE_LEN_NAME, UINT_DEPLOY_CODE_LEN_GAS],
  [UINT_INVOKE_CODE_LEN_NAME, UINT_INVOKE_CODE_LEN_GAS]
]);
export const GasTableKeys = GasTable.keys();
