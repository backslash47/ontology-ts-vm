import { OpCode } from './opCode';
import { Reader } from './utils/reader';

export class ExecutionContext {
  private code: Buffer;
  private opReader: Reader;

  constructor(code: Buffer) {
    this.code = code;
    this.opReader = new Reader(code);
  }

  getInstructionPointer(): number {
    return this.opReader.position();
  }

  setInstructionPointer(offset: number) {
    this.opReader.seek(offset, 'start');
  }

  nextInstruction(): OpCode {
    return this.code[this.opReader.position()];
  }

  clone(): ExecutionContext {
    const executionContext = new ExecutionContext(this.code);
    executionContext.setInstructionPointer(this.getInstructionPointer());
    return executionContext;
  }

  getReader() {
    return this.opReader;
  }

  getCodeLength() {
    return this.code.length;
  }

  getCode() {
    return this.code;
  }
}
