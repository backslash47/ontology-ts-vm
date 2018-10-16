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
import { RuntimeStateStore } from '../../src/smartcontract/runtime/runtimeStateStore';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Storage test', () => {
  test('test 1', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/storageTest.avm');
    const store = new RuntimeStateStore();

    let response = await deployAndInvoke({ contract, store }, 'sget', 'something', 'blah');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');

    response = await deployAndInvoke({ contract, store }, 'sput', 'something', 'blah');
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract, store }, 'sget', 'something', 'blah');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('blah');

    response = await deployAndInvoke({ contract, store }, 'sdel', 'something', 'blah');
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract, store }, 'sget', 'something', 'blah');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');
  });

  test('test 2', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/storageTest.avm');
    const store = new RuntimeStateStore();

    let response = await deployAndInvoke({ contract, store }, 'sget', 100, 10000000000);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');

    response = await deployAndInvoke({ contract, store }, 'sput', 100, 10000000000);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract, store }, 'sget', 100, 10000000000);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(10000000000);

    response = await deployAndInvoke({ contract, store }, 'sdel', 100, 10000000000);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract, store }, 'sget', 100, 10000000000);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('');
  });
});
