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
import { Address } from '../../src/common/address';
import { DeployCode } from '../../src/core/payload/deployCode';
import { StorageContext } from '../../src/smartcontract/storageContext';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { isInteropType } from '../../src/vm/types/interop';
import { deployAndInvoke, loadContract } from '../utils';

describe('Contract test', () => {
  test('test getContract', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/contractTest.avm');
    const contractHash = Address.parseFromVmCode(contract).toArray();

    const response = await deployAndInvoke({ contract }, 'get_contract', contractHash);
    expect(isInteropType(response.result)).toBeTruthy();

    const interop = response.result.getInterface();
    expect(interop instanceof DeployCode).toBeTruthy();

    if (interop instanceof DeployCode) {
      expect(interop.getCode().toString('hex')).toBe(contract.toString('hex'));
    }
  });

  test('test getScript', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/contractTest.avm');
    const contractHash = Address.parseFromVmCode(contract).toArray();

    const response = await deployAndInvoke({ contract }, 'get_script', contractHash);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe(contract.toString('hex'));
  });

  test('test getStorageContext', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/contractTest.avm');
    const contractHash = Address.parseFromVmCode(contract).toArray();

    const response = await deployAndInvoke({ contract }, 'get_storage_context', contractHash);

    const interop = response.result.getInterface();
    expect(interop instanceof StorageContext).toBeTruthy();
  });

  test('test detroy', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/contractTest.avm');
    const contractHash = Address.parseFromVmCode(contract).toArray();

    const response = await deployAndInvoke({ contract }, 'destroy', contractHash);

    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(1);
  });
});
