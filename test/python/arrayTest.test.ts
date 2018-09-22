import 'babel-polyfill';
import { isArrayType } from '../../src/vm/types/array';
import { isBooleanType } from '../../src/vm/types/boolean';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { loadContract, deployAndInvoke } from '../utils';

describe('ArrayTest test', () => {
  test('testList0', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest.avm');

    let response = await deployAndInvoke(contract, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(1);

    response = await deployAndInvoke(contract, 1);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(6);

    response = await deployAndInvoke(contract, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(3);

    response = await deployAndInvoke(contract, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(8);

    response = await deployAndInvoke(contract, 8);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toNumber()).toBe(9);
  });

  test('testList1', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest1.avm');

    const response = await deployAndInvoke(contract);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();
  });

  test('testList2', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest2.avm');

    const response = await deployAndInvoke(contract);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe('a0');
  });

  test('testList3', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest3.avm');

    const response = await deployAndInvoke(contract);
    expect(isArrayType(response.result)).toBeTruthy();
    const res = response.result.getArray();
    expect(res).toHaveLength(3);
    expect(res[0].getBigInteger().toNumber()).toBe(1);
  });

  test('testList4', async () => {
    const contract = loadContract('./test/python/compiled/appendTest.avm');

    const response = await deployAndInvoke(contract);
    expect(isArrayType(response.result)).toBeTruthy();
    const res = response.result.getArray();
    expect(res).toHaveLength(2);
    expect(res[0].getBigInteger().toNumber()).toBe(6);
  });

  test('testList5', async () => {
    const contract = loadContract('./test/python/compiled/arrayRemoveTest.avm');

    const response = await deployAndInvoke(contract);
    expect(isArrayType(response.result)).toBeTruthy();
    const res = response.result.getArray();
    expect(res).toHaveLength(3);
    expect(res[0].getBigInteger().toNumber()).toBe(16);
    expect(res[1].getBigInteger().toNumber()).toBe(3);
  });

  test('testList6', async () => {
    const contract = loadContract('./test/python/compiled/arrayReverseTest.avm');

    const response = await deployAndInvoke(contract);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('utf-8')).toBe('blah');
  });

  test('testList7', async () => {
    const contract = loadContract('./test/python/compiled/arrayTest4.avm');

    const response = await deployAndInvoke(contract);
    expect(isArrayType(response.result)).toBeTruthy();
    const res = response.result.getArray();
    expect(res).toHaveLength(3);
    expect(res[0].getBigInteger().toNumber()).toBe(3);
  });
});
