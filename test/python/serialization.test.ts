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
import 'babel-polyfill';
import { deserializeStackItem } from '../../src/smartcontract/service/runtime';
import { isArrayType } from '../../src/vm/types/array';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { deployAndInvoke, loadContract } from '../utils';

describe('Serialization test', () => {
  test('test 1', async () => {
    const contract = loadContract('./test/python/compiled/demo/serializationTest.avm');

    const response = await deployAndInvoke({ contract }, 1);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      '\x80\x05\x00\x01a\x02\x01\x03\x80\x03\x00\x01j\x02\x01\x03\x02\x01\x05\x00\x02jk\x00\x07lmnopqr'
    );
  });

  test('test 2', async () => {
    const contract = loadContract('./test/python/compiled/demo/serializationTest.avm');

    const response = await deployAndInvoke({ contract }, 2);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      '\x80\x05\x00\x01a\x02\x01\x03\x80\x03\x00\x01j\x02\x01\x03\x02\x01\x05\x00\x02jk\x00\x07lmnopqr'
    );

    const item = deserializeStackItem(response.result.getByteArray());
    expect(isArrayType(item)).toBeTruthy();

    if (isArrayType(item)) {
      expect(item.count()).toBe(5);
      expect(
        item
          .getArray()[4]
          .getByteArray()
          .toString()
      ).toBe('lmnopqr');
    }
  });

  test('test 3', async () => {
    const contract = loadContract('./test/python/compiled/demo/serializationTest.avm');

    const response = await deployAndInvoke({ contract }, 3);
    expect(isArrayType(response.result)).toBeTruthy();

    const item = response.result;
    expect(isArrayType(item)).toBeTruthy();

    if (isArrayType(item)) {
      expect(item.count()).toBe(5);
      expect(
        item
          .getArray()[4]
          .getByteArray()
          .toString()
      ).toBe('lmnopqr');
    }
  });

  test('test 4', async () => {
    const contract = loadContract('./test/python/compiled/demo/serializationTest.avm');

    const response = await deployAndInvoke({ contract }, 4);
    expect(isArrayType(response.result)).toBeTruthy();

    const item = response.result;
    expect(isArrayType(item)).toBeTruthy();

    if (isArrayType(item)) {
      expect(item.count()).toBe(3);
      expect(
        item
          .getArray()[2]
          .getBigInteger()
          .toJSNumber()
      ).toBe(5);
    }
  });
});
