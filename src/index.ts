import { Address } from './common/address';
import { ScEnvironment } from './scEnvironment';
import { InspectData } from './smartcontract/context';
import { NeoVmService } from './smartcontract/neoVmService';
import { init } from './smartcontract/service/native/init';

export { NeoVmService, ScEnvironment, InspectData, Address };

export { DataEntryPrefix } from './core/state/dataEntryPrefix';
export { StateValue, StateStore, StateItem } from './core/state/stateStore';
export { StorageItem } from './core/state/storageItem';
export { LedgerStore } from './core/ledgerStore';
export { RuntimeLedgerStore } from './smartcontract/runtime/runtimeLedgerStore';
export { RuntimeStateStore } from './smartcontract/runtime/runtimeStateStore';

// init native contracts
init();
