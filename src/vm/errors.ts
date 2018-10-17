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
import { TracedError } from '../common/error';

export const ERR_BAD_VALUE = () => new TracedError('bad value');
export const ERR_BAD_TYPE = () => new TracedError('bad type');
export const ERR_OVER_STACK_LEN = () => new TracedError('the count over the stack length');
export const ERR_OVER_CODE_LEN = () => new TracedError('the count over the code length');
export const ERR_UNDER_STACK_LEN = () => new TracedError('the count under the stack length');
export const ERR_FAULT = (msg: string = '') => new TracedError(`the exceution meet fault: ${msg}`);
export const ERR_NOT_SUPPORT_SERVICE = () => new TracedError('the service is not registered');
export const ERR_NOT_SUPPORT_OPCODE = () => new TracedError('does not support the operation code');
export const ERR_OVER_LIMIT_STACK = () => new TracedError('the stack over max size');
export const ERR_OVER_MAX_ITEM_SIZE = () => new TracedError('the item over max size');
export const ERR_OVER_MAX_ARRAY_SIZE = () => new TracedError('the array over max size');
export const ERR_OVER_MAX_BIGINTEGER_SIZE = () => new TracedError('the biginteger over max size 32bit');
export const ERR_OUT_OF_GAS = () => new TracedError('out of gas');
export const ERR_NOT_ARRAY = () => new TracedError('not array');
export const ERR_TABLE_IS_NIL = () => new TracedError('table is nil');
export const ERR_SERVICE_IS_NIL = () => new TracedError('service is nil');
export const ERR_DIV_MOD_BY_ZERO = () => new TracedError('div or mod by zero');
export const ERR_SHIFT_BY_NEG = () => new TracedError('shift by negtive value');
export const ERR_EXECUTION_CONTEXT_NIL = () => new TracedError('execution context is nil');
export const ERR_CURRENT_CONTEXT_NIL = () => new TracedError('current context is nil');
export const ERR_CALLING_CONTEXT_NIL = () => new TracedError('calling context is nil');
export const ERR_ENTRY_CONTEXT_NIL = () => new TracedError('entry context is nil');
export const ERR_APPEND_NOT_ARRAY = () => new TracedError('append not array');
export const ERR_NOT_SUPPORT_TYPE = () => new TracedError('not a supported type');
export const ERR_MAP_NOT_EXIST = () => new TracedError('map not contain key');
// tslint:disable-next-line:quotemark
export const ERR_NOT_MAP_KEY = () => new TracedError("type cann't as map key");
// tslint:disable-next-line:quotemark
export const ERR_REMOVE_NOT_SUPPORT = () => new TracedError("type don't support remove");
