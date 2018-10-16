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

import { bigIntFromBytes, bigIntToBytes } from '../../src/common/utils';

describe('Long encoding test', () => {
  test('Long encoding', async () => {
    expect(bigIntToBytes(bigInt('-9175052165852779861'))).toEqual(new Buffer([171, 170, 170, 170, 170, 170, 171, 128]));
    expect(bigIntToBytes(bigInt('9175052165852779861'))).toEqual(new Buffer([85, 85, 85, 85, 85, 85, 84, 127]));
    expect(bigIntToBytes(bigInt('-9199634313818843819'))).toEqual(new Buffer([85, 85, 85, 85, 85, 85, 84, 128]));
    expect(bigIntToBytes(bigInt('9199634313818843819'))).toEqual(new Buffer([171, 170, 170, 170, 170, 170, 171, 127]));
    expect(bigIntToBytes(bigInt('-8380656'))).toEqual(new Buffer([16, 31, 128]));
    expect(bigIntToBytes(bigInt('8380656'))).toEqual(new Buffer([240, 224, 127]));
    expect(bigIntToBytes(bigInt('-8446192'))).toEqual(new Buffer([16, 31, 127, 255]));
    expect(bigIntToBytes(bigInt('8446192'))).toEqual(new Buffer([240, 224, 128, 0]));
    expect(bigIntToBytes(bigInt('-0')).length).toBe(0);
    expect(bigIntToBytes(bigInt('0')).length).toBe(0);
  });

  test('Long decoding', async () => {
    expect(bigIntFromBytes(new Buffer([171, 170, 170, 170, 170, 170, 171, 128])).toString()).toBe(
      '-9175052165852779861'
    );

    expect(bigIntFromBytes(new Buffer([85, 85, 85, 85, 85, 85, 84, 127])).toString()).toBe('9175052165852779861');

    expect(bigIntFromBytes(new Buffer([85, 85, 85, 85, 85, 85, 84, 128])).toString()).toBe('-9199634313818843819');

    expect(bigIntFromBytes(new Buffer([171, 170, 170, 170, 170, 170, 171, 127])).toString()).toBe(
      '9199634313818843819'
    );

    expect(bigIntFromBytes(new Buffer([16, 31, 128])).toString()).toBe('-8380656');

    expect(bigIntFromBytes(new Buffer([240, 224, 127])).toString()).toBe('8380656');

    expect(bigIntFromBytes(new Buffer([16, 31, 127, 255])).toString()).toBe('-8446192');

    expect(bigIntFromBytes(new Buffer([240, 224, 128, 0])).toString()).toBe('8446192');

    expect(bigIntFromBytes(new Buffer([])).toString()).toBe('0');
  });
});
