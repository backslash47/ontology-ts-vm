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
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Method test', () => {
  test('test method 1', async () => {
    const contract = loadContract('./test/python/compiled/methodTest.avm');

    const response = await deployAndInvoke({ contract }, 1, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(7);
  });

  test('test method 2', async () => {
    const contract = loadContract('./test/python/compiled/methodTest2.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(26);
  });

  test('test method 3', async () => {
    const contract = loadContract('./test/python/compiled/methodTest3.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(13);
  });

  test('test method 4', async () => {
    const contract = loadContract('./test/python/compiled/methodTest4.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(63);
  });

  test('test method 5', async () => {
    const contract = loadContract('./test/python/compiled/methodTest5.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(15);
  });

  test('test method 6', async () => {
    const contract = loadContract('./test/python/compiled/fibonacci.avm');

    let response = await deployAndInvoke({ contract }, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(3);

    response = await deployAndInvoke({ contract }, 5);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(5);

    response = await deployAndInvoke({ contract }, 6);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(8);

    response = await deployAndInvoke({ contract }, 7);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(13);

    response = await deployAndInvoke({ contract }, 11);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(89);
  });
});
