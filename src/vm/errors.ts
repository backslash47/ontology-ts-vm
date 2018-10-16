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
export const ERR_BAD_VALUE = () => new Error('bad value');
export const ERR_BAD_TYPE = () => new Error('bad type');
export const ERR_OVER_STACK_LEN = () => new Error('the count over the stack length');
export const ERR_OVER_CODE_LEN = () => new Error('the count over the code length');
export const ERR_UNDER_STACK_LEN = () => new Error('the count under the stack length');
export const ERR_FAULT = () => new Error('the exceution meet fault');
export const ERR_NOT_SUPPORT_SERVICE = () => new Error('the service is not registered');
export const ERR_NOT_SUPPORT_OPCODE = () => new Error('does not support the operation code');
export const ERR_OVER_LIMIT_STACK = () => new Error('the stack over max size');
export const ERR_OVER_MAX_ITEM_SIZE = () => new Error('the item over max size');
export const ERR_OVER_MAX_ARRAY_SIZE = () => new Error('the array over max size');
export const ERR_OVER_MAX_BIGINTEGER_SIZE = () => new Error('the biginteger over max size 32bit');
export const ERR_OUT_OF_GAS = () => new Error('out of gas');
export const ERR_NOT_ARRAY = () => new Error('not array');
export const ERR_TABLE_IS_NIL = () => new Error('table is nil');
export const ERR_SERVICE_IS_NIL = () => new Error('service is nil');
export const ERR_DIV_MOD_BY_ZERO = () => new Error('div or mod by zero');
export const ERR_SHIFT_BY_NEG = () => new Error('shift by negtive value');
export const ERR_EXECUTION_CONTEXT_NIL = () => new Error('execution context is nil');
export const ERR_CURRENT_CONTEXT_NIL = () => new Error('current context is nil');
export const ERR_CALLING_CONTEXT_NIL = () => new Error('calling context is nil');
export const ERR_ENTRY_CONTEXT_NIL = () => new Error('entry context is nil');
export const ERR_APPEND_NOT_ARRAY = () => new Error('append not array');
export const ERR_NOT_SUPPORT_TYPE = () => new Error('not a supported type');
export const ERR_MAP_NOT_EXIST = () => new Error('map not contain key');
// tslint:disable-next-line:quotemark
export const ERR_NOT_MAP_KEY = () => new Error("type cann't as map key");
// tslint:disable-next-line:quotemark
export const ERR_REMOVE_NOT_SUPPORT = () => new Error("type don't support remove");
