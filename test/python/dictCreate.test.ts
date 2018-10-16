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

describe('Dict Create test', () => {
  test('test Dict 4', async () => {
    const contract = loadContract('./test/python/compiled/dictTest4.avm');

    const response = await deployAndInvoke({ contract }, 1);
    expect(isIntegerType(response.result)).toBeTruthy();

    expect(response.result.getBigInteger().toJSNumber()).toBe(10);
  });

  test('test Dict Keys', async () => {
    const contract = loadContract('./test/python/compiled/dictTestKeys.avm');

    const response = await deployAndInvoke({ contract }, 1);
    expect(isByteArrayType(response.result)).toBeTruthy();

    expect(response.result.getByteArray().toString()).toBe('ab\x04mzmcallltrs');
  });

  test('test Dict Values', async () => {
    const contract = loadContract('./test/python/compiled/dictTestValues.avm');

    const response = await deployAndInvoke({ contract }, 1);
    expect(isIntegerType(response.result)).toBeTruthy();

    expect(response.result.getBigInteger().toJSNumber()).toBe(55);
  });

  test('test Dict HasKey', async () => {
    const contract = loadContract('./test/python/compiled/dictTestHasKey.avm');

    const response = await deployAndInvoke({ contract }, 1);
    expect(isIntegerType(response.result)).toBeTruthy();

    expect(response.result.getBigInteger().toJSNumber()).toBe(22);
  });
});
