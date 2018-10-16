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
export type DataEntryPrefix = number;

export const DATA_BLOCK = 0x00; // Block height => block hash key prefix
export const DATA_HEADER = 0x01; // Block hash => block hash key prefix
export const DATA_TRANSACTION = 0x02; // Transction hash = > transaction key prefix

// Transaction
export const ST_BOOKKEEPER = 0x03; // BookKeeper state key prefix
export const ST_CONTRACT = 0x04; // Smart contract state key prefix
export const ST_STORAGE = 0x05; // Smart contract storage key prefix
export const ST_VALIDATOR = 0x07; // no use
export const ST_VOTE = 0x08; // Vote state key prefix

export const IX_HEADER_HASH_LIST = 0x09; // Block height => block hash key prefix

// SYSTEM
export const SYS_CURRENT_BLOCK = 0x10; // Current block key prefix
export const SYS_VERSION = 0x11; // Store version key prefix
export const SYS_CURRENT_STATE_ROOT = 0x12; // no use
export const SYS_BLOCK_MERKLE_TREE = 0x13; // Block merkle tree root key prefix

export const EVENT_NOTIFY = 0x14; // Event notify key prefix
