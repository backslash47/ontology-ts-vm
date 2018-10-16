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

describe('Concat test', () => {
  test('test Concat1', async () => {
    const contract = loadContract('./test/python/compiled/concatTest.avm');

    const response = await deployAndInvoke({ contract });
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('helloworld');
  });

  test('test Concat2', async () => {
    const contract = loadContract('./test/python/compiled/concatTest2.avm');

    let response = await deployAndInvoke({ contract }, 'concat', ['hello', 'world']);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('helloworld');

    response = await deployAndInvoke({ contract }, 'blah', ['hello', 'world']);
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke({ contract }, 'concat', ['blah']);
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke({ contract }, 'concat', ['hello', 'world', 'third']);
    expect(response.result.getByteArray().toString()).toBe('helloworld');

    response = await deployAndInvoke({ contract }, 'concat', [1, 'neo']);
    expect(response.result.getByteArray().toString()).toBe('\x01neo');

    response = await deployAndInvoke({ contract }, 'concat', ['', 'neo']);
    expect(response.result.getByteArray().toString()).toBe('neo');
  });

  test('test Take', async () => {
    const contract = loadContract('./test/python/compiled/takeTest.avm');

    let response = await deployAndInvoke({ contract }, 2);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('he');

    response = await deployAndInvoke({ contract }, 0);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');

    response = await deployAndInvoke({ contract }, 12);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('helloworld12');

    await expect(deployAndInvoke({ contract }, 40)).rejects.toBeTruthy();

    await expect(deployAndInvoke({ contract }, -2)).rejects.toBeTruthy();
  });
});
