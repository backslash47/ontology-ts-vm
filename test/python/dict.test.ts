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
import * as bigInt from 'big-integer';
import { ByteArrayType } from '../../src/vm/types/byteArray';
import { IntegerType, isIntegerType } from '../../src/vm/types/integer';
import { isMapType } from '../../src/vm/types/map';
import { deployAndInvoke, loadContract } from '../utils';

describe('Dict test', () => {
  test('test Dict 1', async () => {
    const contract = loadContract('./test/python/compiled/dictTest1.avm');

    const response = await deployAndInvoke({ contract }, 1);
    expect(isMapType(response.result)).toBeTruthy();

    if (isMapType(response.result)) {
      expect(
        response.result
          .tryGetValue(new IntegerType(bigInt(13)))
          .getBigInteger()
          .toJSNumber()
      ).toBe(3);

      expect(
        response.result
          .tryGetValue(new ByteArrayType(new Buffer('a')))
          .getBigInteger()
          .toJSNumber()
      ).toBe(4);
    }
  });

  test('test Dict 2', async () => {
    const contract = loadContract('./test/python/compiled/dictTest2.avm');

    const response = await deployAndInvoke({ contract }, 1);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(7);
  });

  test('test Dict 3', async () => {
    const contract = loadContract('./test/python/compiled/dictTest3.avm');

    const response = await deployAndInvoke({ contract }, 1);
    expect(isMapType(response.result)).toBeTruthy();
  });
});
