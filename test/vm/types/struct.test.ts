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
import { IntegerType } from '../../../src/vm/types/integer';
import { MAX_STRUCT_DEPTH, StructType } from '../../../src/vm/types/struct';

describe('Struct test', () => {
  test('Test struct clone', async () => {
    const s = new StructType();
    let k = new StructType([new IntegerType(bigInt.one)]);
    for (let i = 0; i < MAX_STRUCT_DEPTH - 2; i++) {
      k = new StructType([k]);
    }
    s.add(k);

    s.clone();
  });
});
