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
import { deployAndInvoke, loadContract } from '../utils';

describe('ByteArray test', () => {
  test('test BA1', async () => {
    const contract = loadContract('./test/python/compiled/byteArrayTest.avm');

    const response = await deployAndInvoke({ contract });
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe('090102af09');
  });

  test('test BA2', async () => {
    const contract = loadContract('./test/python/compiled/byteArrayTest2.avm');

    const response = await deployAndInvoke({ contract }, 'abcefghi', 'zyxwvutrs');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('bcefghistaoheustnauzyxwvutrs');
  });

  test('test BA3', async () => {
    const contract = loadContract('./test/python/compiled/byteArrayTest3.avm');

    const response = await deployAndInvoke({ contract });
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe('0102aafe');
  });
});
