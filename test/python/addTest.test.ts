import 'babel-polyfill';
import { isIntegerType } from '../../src/vm/types/integer';
import { loadContract, testAndBuild } from '../utils';

describe('AddTest test', () => {
  test('AddTest', async () => {
    const contract = loadContract('./test/python/sc/addTest.avm');

    let response = await testAndBuild(contract, [{ type: 'Integer', value: 2 }]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(4);

    response = await testAndBuild(contract, [{ type: 'Integer', value: 23234 }]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(23236);

    response = await testAndBuild(contract, [{ type: 'Integer', value: 0 }]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(2);

    response = await testAndBuild(contract, [{ type: 'Integer', value: -112 }]);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(-110);
  });
});
