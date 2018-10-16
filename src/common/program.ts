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
import { PublicKey } from '../crypto/publicKey';
import * as O from '../vm/opCode';
import { Writer } from '../vm/utils/writer';
import { bigIntToBytes } from './utils';

export class ProgramBuilder {
  w: Writer;

  constructor() {
    this.w = new Writer();
  }

  pushPubKey(key: PublicKey) {
    this.pushBytes(key.serialize());
  }

  writeOpCode(opCode: O.OpCode) {
    this.w.writeUint8(opCode);
  }

  writeByte(val: number) {
    this.w.writeUint8(val);
  }

  writeBytes(b: Buffer) {
    this.w.writeBytes(b);
  }

  writeVarUInt(val: Long) {
    this.w.writeVarUint(val);
  }

  pushBytes(data: Buffer) {
    // pushing empty buffer should not do any damage
    // if (data.length === 0) {
    //   throw new Error('push data error: data is nil');
    // }

    if (data.length <= O.PUSHBYTES75 + 1 - O.PUSHBYTES1) {
      this.w.writeUint8(data.length + O.PUSHBYTES1 - 1);
    } else if (data.length < 0x100) {
      this.w.writeUint8(O.PUSHDATA1);
      this.w.writeUint8(data.length);
    } else if (data.length < 0x10000) {
      this.w.writeUint8(O.PUSHDATA2);
      this.w.writeUint16(data.length);
    } else {
      this.w.writeUint8(O.PUSHDATA4);
      this.w.writeUint32(data.length);
    }
    this.w.writeBytes(data);
  }

  pushNum(num: number) {
    if (num === -1) {
      this.writeOpCode(O.PUSHM1);
    } else if (num === 0) {
      this.writeOpCode(O.PUSH0);
    } else if (num > 0 && num < 16) {
      this.writeOpCode(num - 1 + O.PUSH1);
    } else {
      this.pushBytes(bigIntToBytes(bigInt(num)));
    }
  }

  pushBool(param: boolean) {
    if (param) {
      this.writeOpCode(O.PUSHT);
    } else {
      this.writeOpCode(O.PUSHF);
    }
  }
  getProgram(): Buffer {
    return this.w.getBytes();
  }
}

export function programFromPubKey(key: PublicKey): Buffer {
  const b = new ProgramBuilder();
  b.pushPubKey(key);
  b.writeOpCode(O.CHECKSIG);
  return b.getProgram();
}

export function programFromParams(sigs: Buffer[]) {
  const b = new ProgramBuilder();

  for (const s of sigs) {
    b.pushBytes(s);
  }

  return b.getProgram();
}
