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
import { ExecutionEngine } from '../interfaces/engine';
import * as O from '../opCode';
import { pushData } from './common';

export function opPushData(e: ExecutionEngine) {
  const data = getPushData(e);
  pushData(e, data);
}

export function getPushData(e: ExecutionEngine) {
  const reader = e.getContext().getReader();
  const opCode = e.getOpCode();

  let data: any;
  if (opCode >= O.PUSHBYTES1 && opCode <= O.PUSHBYTES75) {
    data = reader.readBytes(opCode);
  }
  switch (opCode) {
    case O.PUSH0:
      data = 0;
      break;
    case O.PUSHDATA1:
      const d = reader.readByte();
      data = reader.readBytes(d);
      break;
    case O.PUSHDATA2:
      data = reader.readBytes(reader.readUInt16());
      break;
    case O.PUSHDATA4:
      const i = reader.readInt32();
      data = reader.readBytes(i);
      break;
    case O.PUSHM1:
    case O.PUSH1:
    case O.PUSH2:
    case O.PUSH3:
    case O.PUSH4:
    case O.PUSH5:
    case O.PUSH6:
    case O.PUSH7:
    case O.PUSH8:
    case O.PUSH9:
    case O.PUSH10:
    case O.PUSH11:
    case O.PUSH12:
    case O.PUSH13:
    case O.PUSH14:
    case O.PUSH15:
    case O.PUSH16:
      data = opCode - O.PUSH1 + 1;
      break;
  }

  return data;
}
