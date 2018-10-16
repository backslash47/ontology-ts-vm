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
import { ScEnvironment } from '../../src/scEnvironment';
import { isIntegerType } from '../../src/vm/types/integer';
import { loadContract, opLogger, strToHex } from '../utils';
import { invokeContract } from '../utils/invokeBuilder';

describe('Hello world Python test', () => {
  test('Hello', async () => {
    const contract = loadContract('./test/avm/helloWorld.py.avm');

    const env = new ScEnvironment();
    const address = env.deployContract(contract);

    const call = invokeContract(address, 'Hello', ['World']);
    const { result, notifications } = await env.execute(call, { inspect: opLogger });

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBigInteger().toJSNumber()).toBe(33);
    expect(notifications).toHaveLength(1);
    expect(notifications[0].states).toBe(strToHex('World'));
  });

  test('No hello', async () => {
    const contract = loadContract('./test/avm/helloWorld.py.avm');

    const env = new ScEnvironment();
    const address = env.deployContract(contract);

    // call wrong method
    const call = invokeContract(address, 'Hallo', ['World']);
    const { result, notifications } = await env.execute(call, { inspect: opLogger });

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBoolean()).toBeFalsy();
    expect(notifications).toHaveLength(0);
  });
});
