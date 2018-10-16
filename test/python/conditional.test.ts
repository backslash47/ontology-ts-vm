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
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Compare test', () => {
  test('test Compare0', async () => {
    const contract = loadContract('./test/python/compiled/compareTest0.avm');

    let response = await deployAndInvoke({ contract }, 2, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, 4, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(3);

    response = await deployAndInvoke({ contract }, 2, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, 'b', 'a');
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(3);

    response = await deployAndInvoke({ contract }, 'a', 'b');
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);
  });

  test('test Compare1', async () => {
    const contract = loadContract('./test/python/compiled/compareTest1.avm');

    let response = await deployAndInvoke({ contract }, 1, 2, 3, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(11);

    response = await deployAndInvoke({ contract }, 1, 2, 4, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(1);

    response = await deployAndInvoke({ contract }, 1, 4, 3, 5);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(22);

    response = await deployAndInvoke({ contract }, 4, 1, 5, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(3);

    response = await deployAndInvoke({ contract }, 9, 1, 3, 5);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(10);

    response = await deployAndInvoke({ contract }, 9, 5, 3, 5);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(8);
  });

  test('test Compare2', async () => {
    const contract = loadContract('./test/python/compiled/compareTest2.avm');

    let response = await deployAndInvoke({ contract }, 2, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract }, 2, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();
  });
});
