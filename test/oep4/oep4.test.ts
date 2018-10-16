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
import * as Long from 'long';
import { RuntimeStateStore } from '../../src/smartcontract/runtime/runtimeStateStore';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract, num2hex, strToHex } from '../utils';

describe('OEP4 token test', () => {
  test('Init token test', async () => {
    const contract = loadContract('./test/oep4/myToken.avm');
    const store = new RuntimeStateStore();

    let response = await deployAndInvoke({ store, contract }, 'init', []);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(1);

    expect(response.notifications).toHaveLength(1);
    expect(response.notifications[0].states).toHaveLength(4);
    expect(response.notifications[0].states[0]).toBe(strToHex('transfer'));
    expect(response.notifications[0].states[1]).toBe('00');
    expect(response.notifications[0].states[2]).toBe('d2c124dd088190f709b684e0bc676d70c41b3776');
    expect(response.notifications[0].states[3]).toBe(num2hex(Long.fromString('100000000000000000')));

    response = await deployAndInvoke({ store, contract }, 'init', []);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(0);

    expect(response.notifications).toHaveLength(1);
    expect(response.notifications[0].states).toBe(strToHex('Already initialized!'));
  });

  test('Balance token test', async () => {
    const contract = loadContract('./test/oep4/myToken.avm');
    const store = new RuntimeStateStore();

    let response = await deployAndInvoke({ store, contract }, 'init', []);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(1);

    // tslint:disable-next-line:max-line-length
    response = await deployAndInvoke({ store, contract }, 'balanceOf', [
      new Buffer('d2c124dd088190f709b684e0bc676d70c41b3776', 'hex')
    ]);

    expect(response.result.getBigInteger().toString()).toBe('100000000000000000');

    // different account
    response = await deployAndInvoke({ store, contract }, 'balanceOf', [
      new Buffer('e2c124dd088190f709b684e0bc676d70c41b3776', 'hex')
    ]);

    expect(response.result.getBigInteger().toString()).toBe('0');
  });
});
