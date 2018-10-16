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
import { circularRefAndDepthDetection, serializeStackItem } from '../../../src/smartcontract/service/runtime';
import { ArrayType } from '../../../src/vm/types/array';
import { BooleanType } from '../../../src/vm/types/boolean';
import { ByteArrayType } from '../../../src/vm/types/byteArray';
import { MapType } from '../../../src/vm/types/map';
import { StructType } from '../../../src/vm/types/struct';

describe('Runtime test', () => {
  test('Test runtime serialize', async () => {
    const a = new ArrayType();
    const b = new ArrayType([a]);
    a.add(b);

    expect(() => serializeStackItem(a)).toThrow('runtime serialize: can not serialize circular reference data');
  });

  test('Test array ref', async () => {
    const a = new ArrayType();
    const b = new ArrayType([a]);

    expect(circularRefAndDepthDetection(a)).toBeFalsy();
    expect(circularRefAndDepthDetection(b)).toBeFalsy();

    a.add(b);
    expect(circularRefAndDepthDetection(a)).toBeTruthy();
    expect(circularRefAndDepthDetection(b)).toBeTruthy();
  });

  test('Test struct ref', async () => {
    const ba1 = new ByteArrayType(new Buffer([1, 2, 3]));
    const ba2 = new ByteArrayType(new Buffer([4, 5, 6]));
    const bf = new BooleanType(false);
    const bt = new BooleanType(true);

    expect(circularRefAndDepthDetection(ba1)).toBeFalsy();
    expect(circularRefAndDepthDetection(ba2)).toBeFalsy();
    expect(circularRefAndDepthDetection(bf)).toBeFalsy();
    expect(circularRefAndDepthDetection(bt)).toBeFalsy();

    const array1 = new ArrayType([ba1, bf]);
    const array2 = new ArrayType([ba2, bf]);
    const struct = new StructType([ba1, bf]);

    expect(circularRefAndDepthDetection(struct)).toBeFalsy();
    expect(circularRefAndDepthDetection(array1)).toBeFalsy();
    expect(circularRefAndDepthDetection(array2)).toBeFalsy();

    array1.add(struct);
    expect(circularRefAndDepthDetection(array1)).toBeFalsy();

    struct.add(array2);
    expect(circularRefAndDepthDetection(array1)).toBeFalsy();

    array2.add(array1);
    expect(circularRefAndDepthDetection(array1)).toBeTruthy();
    expect(circularRefAndDepthDetection(struct)).toBeTruthy();
    expect(circularRefAndDepthDetection(array2)).toBeTruthy();

    const map1 = new MapType();
    expect(circularRefAndDepthDetection(map1)).toBeFalsy();
    map1.add(array1, bf);
    expect(circularRefAndDepthDetection(map1)).toBeTruthy();

    const map2 = new MapType();
    map2.add(bf, array2);
    expect(circularRefAndDepthDetection(map2)).toBeTruthy();

    const map3 = new MapType();
    const map4 = new MapType();
    const map5 = new MapType();
    map3.add(map4, map5);
    map3.add(map5, map4);

    expect(circularRefAndDepthDetection(map3)).toBeFalsy();

    const map6 = new MapType();
    const map7 = new MapType();
    const map8 = new MapType();
    map6.add(bf, bf);
    map7.add(bt, bf);
    map8.add(bf, map6);
    map8.add(bt, map7);
    map8.add(ba1, map7);

    expect(circularRefAndDepthDetection(map8)).toBeFalsy();
  });
});
