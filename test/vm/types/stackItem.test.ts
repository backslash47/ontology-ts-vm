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
import { bigIntToBytes } from '../../../src/common/utils';
import { ArrayType } from '../../../src/vm/types/array';
import { BooleanType } from '../../../src/vm/types/boolean';
import { ByteArrayType } from '../../../src/vm/types/byteArray';
import { IntegerType } from '../../../src/vm/types/integer';
import { InteropType } from '../../../src/vm/types/interop';
import { MapType } from '../../../src/vm/types/map';
import { StructType } from '../../../src/vm/types/struct';

describe('StackItem test', () => {
  test('Test boolean equals', async () => {
    const a = new BooleanType(false);
    const b = new BooleanType(true);
    const c = new BooleanType(true);
    const d = new BooleanType(false);

    expect(a.equals(d)).toBeTruthy();
    expect(a.equals(a)).toBeTruthy();
    expect(b.equals(c)).toBeTruthy();
    expect(b.equals(b)).toBeTruthy();

    expect(a.equals(b)).toBeFalsy();
    expect(b.equals(d)).toBeFalsy();
  });

  test('Test array equals', async () => {
    const a = new ArrayType();
    const b = new ArrayType();

    expect(a.equals(b)).toBeFalsy();
    expect(a.equals(a)).toBeTruthy();

    const i = new IntegerType(bigInt.zero);
    const j = new IntegerType(bigInt.zero);
    const k = new IntegerType(bigInt.one);

    const m1 = new ArrayType([i, j, k]);
    const m2 = new ArrayType([i, j, k]);

    expect(m1.equals(m2)).toBeFalsy();
    expect(m1.equals(m1)).toBeTruthy();
  });

  test('Test integer equals', async () => {
    const i = new IntegerType(bigInt.zero);
    const j = new IntegerType(bigInt.zero);

    expect(i.equals(j)).toBeTruthy();
    const k = new IntegerType(bigInt(100000));
    expect(i.equals(k)).toBeFalsy();
  });

  test('Test new ByteArray', async () => {
    const i = new ByteArrayType(new Buffer('abcde'));
    const j = new ByteArrayType(new Buffer(['a', 'b', 'c', 'd', 'e'].join('')));

    expect(i.equals(j)).toBeTruthy();

    const k = new ByteArrayType();
    expect(k.equals(new ByteArrayType())).toBeTruthy();
  });

  test('Test struct equals', async () => {
    const a = new StructType();
    const b = new StructType();

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();

    const i = new IntegerType(bigInt.zero);
    const j = new IntegerType(bigInt.zero);
    const k = new IntegerType(bigInt.one);

    const m1 = new StructType([i, j, k]);
    const m2 = new StructType([i, j, k]);

    expect(m1.equals(m2)).toBeTruthy();
    expect(m1.equals(m1)).toBeTruthy();
  });

  test('Test map equals', async () => {
    const a = new MapType();
    const b = new MapType();

    expect(a.equals(b)).toBeFalsy();
    expect(a.equals(a)).toBeTruthy();

    const k1 = new IntegerType(bigInt.zero);
    const k2 = new IntegerType(bigInt.zero);

    const v1 = new ByteArrayType(new Buffer('abcde'));
    const v2 = new ByteArrayType(new Buffer(['a', 'b', 'c', 'd', 'e'].join('')));

    a.add(k1, v1);
    b.add(k2, v2);

    expect(a.equals(b)).toBeFalsy();
    expect(b.equals(b)).toBeTruthy();
  });

  test('Test interop equals', async () => {
    const a = new InteropType();
    const b = new InteropType();

    expect(a.equals(b)).toBeFalsy();
  });

  test('Test cmp', async () => {
    const a = new BooleanType(false);
    const b = new IntegerType(bigInt.zero);
    const c = new BooleanType(true);
    const d = new IntegerType(bigInt.one);

    expect(a.equals(b)).toBeFalsy();
    expect(c.equals(d)).toBeTruthy();

    const arr = new ArrayType();
    const stt = new StructType();
    expect(arr.equals(stt)).toBeFalsy();
    arr.add(new IntegerType(bigInt.zero));
    stt.add(new IntegerType(bigInt.zero));
    expect(arr.equals(stt)).toBeFalsy();

    const ba = new ByteArrayType(bigIntToBytes(bigInt.zero));
    expect(ba.equals(b)).toBeTruthy();

    const k = new ByteArrayType();
    expect(c.equals(k)).toBeFalsy();
  });
});
