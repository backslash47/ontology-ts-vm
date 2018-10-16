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
import { Block } from '../../src/core/block';
import { Header } from '../../src/core/header';
import { RuntimeLedgerStore } from '../../src/smartcontract/runtime/runtimeLedgerStore';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { deployAndInvoke, loadContract } from '../utils';

describe('Block test', () => {
  test.skip('test', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/blockTest.avm');

    const ledgerStore = new RuntimeLedgerStore();
    ledgerStore.addBlock(new Block({ header: new Header({ height: 1234 }) }));

    const response = await deployAndInvoke({ contract, ledgerStore }, 'get_hash', 1234);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      'R\xddI\xd3\xb5\x92z\x00C3|\x0fR\x8c\xdb$Q\x1e\x1e\xf0s\x856\xd4Uv/mw\xde\x0f\xa5'
    );
  });
});
