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
import { Address } from '../src/common/address';

// tslint:disable : no-console
describe('Address test', () => {
  test('Base58 to Hex test', async () => {
    const encoded = 'AazEvfQPcQ2GEFFPLF1ZLwQ7K5jDn81hve';
    const address = Address.fromBase58(encoded);

    expect(address.toArray().toString('hex')).toBe('d2c124dd088190f709b684e0bc676d70c41b3776');
  });

  test('Hex to Base58 test', async () => {
    const address = Address.parseFromBytes(new Buffer('d2c124dd088190f709b684e0bc676d70c41b3776', 'hex'));
    expect(address.toBase58()).toBe('AazEvfQPcQ2GEFFPLF1ZLwQ7K5jDn81hve');
  });
});
