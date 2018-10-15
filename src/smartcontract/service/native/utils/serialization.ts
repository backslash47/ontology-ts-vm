import * as bigInt from 'big-integer';
import * as Long from 'long';
import { Address } from '../../../../common/address';
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
    throw new Error('value should not be a negative number.');
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
