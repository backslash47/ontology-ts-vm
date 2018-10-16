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
import { loadContract, opLogger } from '../utils';
import { invokeContract } from '../utils/invokeBuilder';

describe('Arith test', () => {
  test('Add', async () => {
    const contract = loadContract('./test/avm/arith.avm');

    const env = new ScEnvironment();
    const address = env.deployContract(contract);

    const call = invokeContract(address, 'Add', [3, 4]);
    const { result, notifications } = await env.execute(call, { inspect: opLogger });

    expect(isIntegerType(result)).toBeTruthy();
    expect(result.getBigInteger().toJSNumber()).toBe(7);
    expect(notifications).toHaveLength(1);
    expect(notifications[0].states).toHaveLength(1);
    expect(notifications[0].states[0]).toBe('07');
  });
});
