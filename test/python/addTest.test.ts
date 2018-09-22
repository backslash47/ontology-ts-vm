import 'babel-polyfill';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('AddTest test', () => {
  test('AddTest', async () => {
    const contract = loadContract('./test/python/compiled/addTest.avm');

    let response = await deployAndInvoke(contract, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(4);

    response = await deployAndInvoke(contract, 23234);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(23236);

    response = await deployAndInvoke(contract, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(2);

    response = await deployAndInvoke(contract, -112);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(-110);
  });

  test('AddTest1', async () => {
    const contract = loadContract('./test/python/compiled/addTest1.avm');

    let response = await deployAndInvoke(contract, 1, 2, 3, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(9);

    response = await deployAndInvoke(contract, 0, 0, 0, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(2);

    response = await deployAndInvoke(contract, -2, 3, -6, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(-2);
  });

  test('AddTest2', async () => {
    const contract = loadContract('./test/python/compiled/addTest2.avm');

    const response = await deployAndInvoke(contract);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(3);
  });

  test('AddTest4', async () => {
    const contract = loadContract('./test/python/compiled/addTest4.avm');

    const response = await deployAndInvoke(contract, 1, 2, 3, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(-9);
  });

  test('AddTestVoid', async () => {
    const contract = loadContract('./test/python/compiled/addTestVoid.avm');

    const response = await deployAndInvoke(contract, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe('');
  });
});
