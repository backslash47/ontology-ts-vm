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
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Iter test', () => {
  test('test while 1', async () => {
    const contract = loadContract('./test/python/compiled/whileTest1.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(6);
  });

  test('test while 2', async () => {
    const contract = loadContract('./test/python/compiled/whileTest2.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(6);
  });

  test('test while 3', async () => {
    const contract = loadContract('./test/python/compiled/whileTest.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(24);
  });

  test('test iter 1', async () => {
    const contract = loadContract('./test/python/compiled/iterTest.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(18);
  });

  test('test iter 2', async () => {
    const contract = loadContract('./test/python/compiled/iterTest2.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(8);
  });

  test('test iter 3', async () => {
    const contract = loadContract('./test/python/compiled/iterTest3.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(7);
  });

  test('test iter 4', async () => {
    const contract = loadContract('./test/python/compiled/iterTest4.avm');

    const response = await deployAndInvoke({ contract });
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe('abcdabcdabcd\x0c');
  });

  test('test iter 5', async () => {
    const contract = loadContract('./test/python/compiled/iterTest5.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(51);
  });

  test('test range 1', async () => {
    const contract = loadContract('./test/python/compiled/rangeTest.avm');

    const response = await deployAndInvoke({ contract });
    expect(isArrayType(response.result)).toBeTruthy();
    expect(response.result.getArray().length).toBe(20);
  });

  test('test range 2', async () => {
    const contract = loadContract('./test/python/compiled/iterTest6.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(10);
  });

  test('test range 3', async () => {
    const contract = loadContract('./test/python/compiled/iterTest7.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(12);
  });

  test('test range 4', async () => {
    const contract = loadContract('./test/python/compiled/iterTest8.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(6);
  });
});
