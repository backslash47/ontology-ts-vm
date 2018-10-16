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
import * as ByteBuffer from 'bytebuffer';
import * as Long from 'long';

export class Writer {
  private writer: ByteBuffer;

  constructor() {
    this.writer = new ByteBuffer(undefined, true, true);
  }

  getBytes() {
    this.writer.mark();
    this.writer.flip();
    const buffer = new Buffer(this.writer.toBuffer());
    this.writer.reset();
    return buffer;
  }

  writeVarUint(value: Long | number) {
    if (typeof value === 'number') {
      value = Long.fromNumber(value);
    }

    if (value.lt(0xfd)) {
      this.writer.writeUint8(value.toNumber());
    } else if (value.lte(0xffff)) {
      this.writer.writeUint8(0xfd);
      this.writer.writeUint16(value.toNumber());
    } else if (value.lte(0xffffffff)) {
      this.writer.writeUint8(0xfe);
      this.writer.writeUint32(value.toNumber());
    } else {
      this.writer.writeUint8(0xff);
      this.writer.writeUint64(value);
    }
  }
  writeVarBytes(value: Buffer) {
    this.writeVarUint(value.length);
    this.writeBytes(value);
  }
  writeString(value: string) {
    return this.writeVarBytes(new Buffer(value, 'utf-8'));
  }
  writeBytes(value: Buffer) {
    this.writer.append(value);
  }
  writeUint8(val: number) {
    this.writer.writeUint8(val);
  }
  writeUint16(val: number) {
    this.writer.writeUint16(val);
  }
  writeUint32(val: number) {
    this.writer.writeUint32(val);
  }
  writeUint64(val: Long) {
    this.writer.writeUint64(val);
  }
  writeBool(val: boolean) {
    this.writeUint8(val ? 1 : 0);
  }
}

/**
 * TODO: might implement
 */
export class LimitedWriter extends Writer {
  limit: number;

  constructor(limit: number) {
    super();
    this.limit = limit;
  }
}
