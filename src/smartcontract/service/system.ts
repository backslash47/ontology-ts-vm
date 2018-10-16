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
import { TracedError } from '../../common/error';
import { pushData } from '../../vm/func/common';
import { ExecutionEngine } from '../../vm/interfaces/engine';
import { VmService } from '../context';

/**
 * GetCodeContainer push current transaction to vm stack
 */
export function getCodeContainer(service: VmService, engine: ExecutionEngine) {
  pushData(engine, service.getTx());
}

/**
 * GetExecutingAddress push current context to vm stack
 */
export function getExecutingAddress(service: VmService, engine: ExecutionEngine) {
  const context = service.getContextRef().currentContext();
  if (context === undefined) {
    throw new TracedError('Current context invalid');
  }
  pushData(engine, context.contractAddress.toArray());
}

/**
 * GetExecutingAddress push previous context to vm stack
 */
export function getCallingAddress(service: VmService, engine: ExecutionEngine) {
  const context = service.getContextRef().callingContext();
  if (context === undefined) {
    throw new TracedError('Calling context invalid');
  }
  pushData(engine, context.contractAddress.toArray());
}

/**
 * GetExecutingAddress push entry call context to vm stack
 */
export function getEntryAddress(service: VmService, engine: ExecutionEngine) {
  const context = service.getContextRef().entryContext();
  if (context === undefined) {
    throw new TracedError('Entry context invalid');
  }
  pushData(engine, context.contractAddress.toArray());
}
