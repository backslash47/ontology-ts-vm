import 'babel-polyfill';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Method test', () => {
  test('test method 1', async () => {
    const contract = loadContract('./test/python/compiled/methodTest.avm');

    const response = await deployAndInvoke(contract, 1, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(7);
  });

  test('test method 2', async () => {
    const contract = loadContract('./test/python/compiled/methodTest2.avm');

    const response = await deployAndInvoke(contract);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(26);
  });

  test('test method 3', async () => {
    const contract = loadContract('./test/python/compiled/methodTest3.avm');

    const response = await deployAndInvoke(contract);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(13);
  });

  test('test method 4', async () => {
    const contract = loadContract('./test/python/compiled/methodTest4.avm');

    const response = await deployAndInvoke(contract);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(63);
  });

  test('test method 5', async () => {
    const contract = loadContract('./test/python/compiled/methodTest5.avm');

    const response = await deployAndInvoke(contract);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(15);
  });

  test('test method 6', async () => {
    const contract = loadContract('./test/python/compiled/fibonacci.avm');

    let response = await deployAndInvoke(contract, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(3);

    response = await deployAndInvoke(contract, 5);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(5);

    response = await deployAndInvoke(contract, 6);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(8);

    response = await deployAndInvoke(contract, 7);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(13);

    response = await deployAndInvoke(contract, 11);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(89);
  });
});
