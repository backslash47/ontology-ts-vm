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
import * as bigInt from 'big-integer';
import * as Long from 'long';
import { Address } from '../../../../common/address';
import { TracedError } from '../../../../common/error';
import { bigIntFromBytes, bigIntToBytes } from '../../../../common/utils';
import { Reader } from '../../../../vm/utils/reader';
import { Writer } from '../../../../vm/utils/writer';

export function readVarUint(r: Reader): Long {
  return decodeVarUint(r);
}

export function readAddress(r: Reader): Address {
  return decodeAddress(r);
}

export function writeAddress(w: Writer, address: Address) {
  encodeAddress(w, address);
}

export function writeVarUint(w: Writer, value: Long) {
  encodeVarUint(w, value);
}

export function decodeVarUint(r: Reader): Long {
  const value = r.readVarBytes();
  const v = Long.fromString(bigIntFromBytes(value).toString());

  if (v.lessThan(0)) {
    throw new TracedError('value should not be a negative number.');
  }
  return v;
}

export function decodeAddress(source: Reader): Address {
  const from = source.readVarBytes();

  return Address.parseFromBytes(from);
}

export function encodeAddress(sink: Writer, addr: Address) {
  sink.writeVarBytes(addr.toArray());
}

export function encodeVarUint(sink: Writer, value: Long) {
  sink.writeVarBytes(bigIntToBytes(bigInt(value.toString())));
}
