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
import { TracedError } from '../../common/error';
import { Reader } from '../../vm/utils/reader';
import { Writer } from '../../vm/utils/writer';
import { StateValue } from '../state/stateStore';

export class InvokeCode implements StateValue {
  private code: Buffer;

  constructor(code: Buffer = new Buffer('')) {
    this.code = code;
  }

  serialize(w: Writer) {
    try {
      w.writeVarBytes(this.code);
    } catch (e) {
      throw new TracedError('InvokeCode Code Serialize failed.', e);
    }
  }

  deserialize(r: Reader) {
    try {
      const code = r.readVarBytes();

      this.code = code;
    } catch (e) {
      throw new TracedError('InvokeCode Code Deserialize failed.', e);
    }
  }
}
