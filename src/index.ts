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

export { NotificationCallback, NotifyEventInfo, LogCallback, LogEventInfo } from './event/notifyEvents';

export { StackItem } from './vm/types/stackItem';
export { ArrayType, isArrayType } from './vm/types/array';
export { ByteArrayType, isByteArrayType } from './vm/types/byteArray';
export { BooleanType, isBooleanType } from './vm/types/boolean';
export { IntegerType, isIntegerType } from './vm/types/integer';
export { StructType, isStructType } from './vm/types/struct';
export { InteropType, isInteropType } from './vm/types/interop';
export { MapType, isMapType } from './vm/types/map';

// init native contracts
init();
