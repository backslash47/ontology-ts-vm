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
import { isArrayType } from '../../src/vm/types/array';
import { isBooleanType } from '../../src/vm/types/boolean';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('ArrayTest test', () => {
  test('testList0', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest.avm');

    let response = await deployAndInvoke({ contract }, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(1);

    response = await deployAndInvoke({ contract }, 1);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(6);

    response = await deployAndInvoke({ contract }, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(3);

    response = await deployAndInvoke({ contract }, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(8);

    response = await deployAndInvoke({ contract }, 8);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(9);
  });

  test('testList1', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest1.avm');

    const response = await deployAndInvoke({ contract });
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();
  });

  test('testList2', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest2.avm');

    const response = await deployAndInvoke({ contract });
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe('a0');
  });

  test('testList3', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest3.avm');

    const response = await deployAndInvoke({ contract });
    expect(isArrayType(response.result)).toBeTruthy();
    const res = response.result.getArray();
    expect(res).toHaveLength(3);
    expect(res[0].getBigInteger().toJSNumber()).toBe(1);
  });

  test('testList4', async () => {
    const contract = loadContract('./test/python/compiled/appendTest.avm');

    const response = await deployAndInvoke({ contract });
    expect(isArrayType(response.result)).toBeTruthy();
    const res = response.result.getArray();
    expect(res).toHaveLength(2);
    expect(res[0].getBigInteger().toJSNumber()).toBe(6);
  });

  test('testList5', async () => {
    const contract = loadContract('./test/python/compiled/arrayRemoveTest.avm');

    const response = await deployAndInvoke({ contract });
    expect(isArrayType(response.result)).toBeTruthy();
    const res = response.result.getArray();
    expect(res).toHaveLength(3);
    expect(res[0].getBigInteger().toJSNumber()).toBe(16);
    expect(res[1].getBigInteger().toJSNumber()).toBe(3);
  });

  test('testList6', async () => {
    const contract = loadContract('./test/python/compiled/arrayReverseTest.avm');

    const response = await deployAndInvoke({ contract });
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('utf-8')).toBe('blah');
  });

  test('testList7', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest4.avm');

    const response = await deployAndInvoke({ contract });
    expect(isArrayType(response.result)).toBeTruthy();
    const res = response.result.getArray();
    expect(res).toHaveLength(3);
    expect(res[0].getBigInteger().toJSNumber()).toBe(3);
  });
});
