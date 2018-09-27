import 'babel-polyfill';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Dict Create test', () => {
  test('test Dict 4', async () => {
    const contract = loadContract('./test/python/compiled/dictTest4.avm');

    const response = await deployAndInvoke(contract, 1);
    expect(isIntegerType(response.result)).toBeTruthy();

    expect(response.result.getBigInteger().toJSNumber()).toBe(10);
  });

  test('test Dict Keys', async () => {
    const contract = loadContract('./test/python/compiled/dictTestKeys.avm');

    const response = await deployAndInvoke(contract, 1);
    expect(isByteArrayType(response.result)).toBeTruthy();

    expect(response.result.getByteArray().toString()).toBe('ab\x04mzmcallltrs');
  });

  test('test Dict Values', async () => {
    const contract = loadContract('./test/python/compiled/dictTestValues.avm');

    const response = await deployAndInvoke(contract, 1);
    expect(isIntegerType(response.result)).toBeTruthy();

    expect(response.result.getBigInteger().toJSNumber()).toBe(55);
  });

  test('test Dict HasKey', async () => {
    const contract = loadContract('./test/python/compiled/dictTestHasKey.avm');

    const response = await deployAndInvoke(contract, 1);
    expect(isIntegerType(response.result)).toBeTruthy();

    expect(response.result.getBigInteger().toJSNumber()).toBe(22);
  });
});
