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

  // nextInstruction(): OpCode {
  //   return this.code[this.opReader.position()];
  // }

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
