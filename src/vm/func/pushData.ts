import { ExecutionEngine } from '../interfaces/engine';
import * as O from '../opcode';
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
