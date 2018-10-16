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
import { isBooleanType } from '../../src/vm/types/boolean';
import { deployAndInvoke, loadContract } from '../utils';

describe('CompareIn test', () => {
  test('test Compare In', async () => {
    const contract = loadContract('./test/python/compiled/compareInTest.avm');

    let response = await deployAndInvoke({ contract }, 1);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract }, 2);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke({ contract }, 3);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract }, 4);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke({ contract }, 5);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract }, 6);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract }, 7);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract }, 8);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke({ contract }, 9);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();
  });
});
