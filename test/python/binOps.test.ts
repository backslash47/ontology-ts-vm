import 'babel-polyfill';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('BinOps test', () => {
  test('BinOpsTest', async () => {
    const contract = loadContract('./test/python/compiled/binOpsTest.avm');

    let response = await deployAndInvoke({ contract }, '&', 4, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(4);

    response = await deployAndInvoke({ contract }, '|', 4, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(7);

    response = await deployAndInvoke({ contract }, '|', 4, 8);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(12);

    response = await deployAndInvoke({ contract }, '^', 4, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(0);

    response = await deployAndInvoke({ contract }, '^', 4, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(6);

    response = await deployAndInvoke({ contract }, '>>', 16, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(16);

    response = await deployAndInvoke({ contract }, '>>', 11, 1);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(5);

    await expect(deployAndInvoke({ contract }, '<<', 16, -2)).rejects.toBeTruthy();

    response = await deployAndInvoke({ contract }, '<<', 4, 5);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(128);

    response = await deployAndInvoke({ contract }, '%', 16, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(0);

    response = await deployAndInvoke({ contract }, '%', 16, 11);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(5);

    response = await deployAndInvoke({ contract }, '//', 16, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(8);

    response = await deployAndInvoke({ contract }, '//', 16, 7);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, '/', 16, 7);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, '~', 16, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(-17);

    response = await deployAndInvoke({ contract }, '~', -3, 0);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);
  });
});
