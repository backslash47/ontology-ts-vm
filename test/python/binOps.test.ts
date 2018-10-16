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

describe('BinOps test', () => {
  test('BinOpsTest', async () => {
    const contract = loadContract('./test/python/compiled/binOpsTest.avm');

    let response = await deployAndInvoke({ contract }, '&', 4, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(4);

    response = await deployAndInvoke({ contract }, '|', 4, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(7);

    response = await deployAndInvoke({ contract }, '|', 4, 8);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(12);

    response = await deployAndInvoke({ contract }, '^', 4, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(0);

    response = await deployAndInvoke({ contract }, '^', 4, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(6);

    response = await deployAndInvoke({ contract }, '>>', 16, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(16);

    response = await deployAndInvoke({ contract }, '>>', 11, 1);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(5);

    await expect(deployAndInvoke({ contract }, '<<', 16, -2)).rejects.toBeTruthy();

    response = await deployAndInvoke({ contract }, '<<', 4, 5);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(128);

    response = await deployAndInvoke({ contract }, '%', 16, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(0);

    response = await deployAndInvoke({ contract }, '%', 16, 11);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(5);

    response = await deployAndInvoke({ contract }, '//', 16, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(8);

    response = await deployAndInvoke({ contract }, '//', 16, 7);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, '/', 16, 7);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, '~', 16, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(-17);

    response = await deployAndInvoke({ contract }, '~', -3, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);
  });
});
