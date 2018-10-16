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
import { Address } from '../../common/address';
import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';

export interface ContractOptions {
  version: number;
  address: Address;
  method: string;
  args: Buffer;
}

export class Contract {
  static deserialize(r: Reader): Contract {
    const version = r.readByte();

    const address = new Address();
    address.deserialize(r);

    const method = r.readVarBytes();
    const args = r.readVarBytes();

    return new Contract({
      version,
      address,
      method: method.toString(),
      args
    });
  }
  version: number;
  address: Address;
  method: string;
  args: Buffer;

  constructor({ version, address, method, args }: ContractOptions) {
    this.version = version;
    this.address = address;
    this.method = method;
    this.args = args;
  }

  serialize(w: Writer) {
    w.writeUint8(this.version);

    this.address.serialize(w);

    w.writeVarBytes(new Buffer(this.method));
    w.writeVarBytes(new Buffer(this.args));
  }
}
