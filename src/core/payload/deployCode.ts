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
import { Interop } from '../../vm/interfaces/interop';
import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { StateValue } from '../state/stateStore';

export interface DeployCodeOptions {
  code: Buffer;
  needStorage?: boolean;
  name?: string;
  version?: string;
  author?: string;
  email?: string;
  description?: string;
}

export class DeployCode implements StateValue, Interop {
  private code: Buffer;
  // private needStorage: boolean; - unused
  // private name: string; - unused
  // private version: string; - unused
  // private author: string; - unused
  // private email: string; - unused
  // private description: string; - unused

  constructor(options: DeployCodeOptions = { code: new Buffer('') }) {
    this.code = options.code;
    // this.needStorage = options.needStorage; - unused
    // this.name = options.name; - unused
    // this.author = options.author; - unused
    // this.email = options.email; - unused
    // this.description = options.description; - unused
  }

  serialize(w: Writer) {
    throw new Error('Unsuported');
  }

  deserialize(r: Reader) {
    throw new Error('Unsuported');
  }

  toArray(): Buffer {
    const bf = new Writer();
    this.serialize(bf);
    return new Buffer(bf.getBytes());
  }

  getCode() {
    return this.code;
  }
}

export function isDeployCode(item: any): item is DeployCode {
  return item instanceof DeployCode;
}
