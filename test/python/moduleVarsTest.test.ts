import 'babel-polyfill';
import { isBooleanType } from '../../src/vm/types/boolean';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Module Vars test', () => {
  test.skip('test 1', async () => {
    const contract = loadContract('./test/python/compiled/moduleVariableTest1.avm');

    const response = await deployAndInvoke(contract);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(8);
  });

  test.skip('test 2', async () => {
    const contract = loadContract('./test/python/compiled/moduleVariableTest.avm');

    const response = await deployAndInvoke(contract);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(1260);
  });

  test('test 3', async () => {
    const contract = loadContract('./test/python/compiled/moduleMethodTest1.avm');

    const response = await deployAndInvoke(contract);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();
  });

  test.skip('test 4', async () => {
    const contract = loadContract('./test/python/compiled/moduleMethodTest2.avm');

    const response = await deployAndInvoke(contract);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(3003);
  });
});
