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

describe('AddTest test', () => {
  test('AddTest', async () => {
    const contract = loadContract('./test/python/compiled/addTest.avm');

    let response = await deployAndInvoke({ contract }, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(4);

    response = await deployAndInvoke({ contract }, 23234);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(23236);

    response = await deployAndInvoke({ contract }, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, -112);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(-110);
  });

  test('AddTest1', async () => {
    const contract = loadContract('./test/python/compiled/addTest1.avm');

    let response = await deployAndInvoke({ contract }, 1, 2, 3, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(9);

    response = await deployAndInvoke({ contract }, 0, 0, 0, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, -2, 3, -6, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(-2);
  });

  test('AddTest2', async () => {
    const contract = loadContract('./test/python/compiled/addTest2.avm');

    const response = await deployAndInvoke({ contract });
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(3);
  });

  test('AddTest4', async () => {
    const contract = loadContract('./test/python/compiled/addTest4.avm');

    const response = await deployAndInvoke({ contract }, 1, 2, 3, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(-9);
  });

  test('AddTestVoid', async () => {
    const contract = loadContract('./test/python/compiled/addTestVoid.avm');

    const response = await deployAndInvoke({ contract }, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe('');
  });
});
