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
import { popInteropInterface, pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { VmService } from '../context';
import { isStorageContext, StorageContext } from '../storageContext';

export function storageContextAsReadOnly(service: VmService, engine: ExecutionEngine) {
  const data = popInteropInterface(engine);

  if (isStorageContext(data)) {
    let context = data;
    if (!context.isReadOnly()) {
      context = new StorageContext(context.getAddress());
      context.setReadOnly(true);
    }
    pushData(engine, context);
  } else {
    throw new Error('pop storage context type invalid');
  }
}
