import { PublicKey } from '../crypto/publicKey';
import { CHECKSIG, OpCode, PUSHBYTES1, PUSHBYTES75, PUSHDATA1, PUSHDATA2, PUSHDATA4 } from '../vm/opCode';
import { Writer } from '../vm/utils/writer';

export class ProgramBuilder {
  w: Writer;

  constructor() {
    this.w = new Writer();
  }

  pushPubKey(key: PublicKey) {
    this.pushBytes(key.serialize());
  }

  writeOpCode(opCode: OpCode) {
    this.w.writeUint8(opCode);
  }

  writeBytes(b: Buffer) {
    this.w.writeBytes(b);
  }

  pushBytes(data: Buffer) {
    if (data.length === 0) {
      throw new Error('push data error: data is nil');
    }

    if (data.length <= PUSHBYTES75 + 1 - PUSHBYTES1) {
      this.w.writeUint8(data.length + PUSHBYTES1 - 1);
    } else if (data.length < 0x100) {
      this.w.writeUint8(PUSHDATA1);
      this.w.writeUint8(data.length);
    } else if (data.length < 0x10000) {
      this.w.writeUint8(PUSHDATA2);
      this.w.writeUint16(data.length);
    } else {
      this.w.writeUint8(PUSHDATA4);
      this.w.writeUint32(data.length);
    }
    this.w.writeBytes(data);
  }

  getProgram(): Buffer {
    return this.w.getBytes();
  }
}

export function programFromPubKey(key: PublicKey): Buffer {
  const b = new ProgramBuilder();
  b.pushPubKey(key);
  b.writeOpCode(CHECKSIG);
  return b.getProgram();
}
