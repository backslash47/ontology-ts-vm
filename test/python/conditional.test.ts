import 'babel-polyfill';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Compare test', () => {
  test('test Compare0', async () => {
    const contract = loadContract('./test/python/compiled/compareTest0.avm');

    let response = await deployAndInvoke({ contract }, 2, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, 4, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(3);

    response = await deployAndInvoke({ contract }, 2, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);

    response = await deployAndInvoke({ contract }, 'b', 'a');
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(3);

    response = await deployAndInvoke({ contract }, 'a', 'b');
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(2);
  });

  test('test Compare1', async () => {
    const contract = loadContract('./test/python/compiled/compareTest1.avm');

    let response = await deployAndInvoke({ contract }, 1, 2, 3, 4);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(11);

    response = await deployAndInvoke({ contract }, 1, 2, 4, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(1);

    response = await deployAndInvoke({ contract }, 1, 4, 3, 5);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(22);

    response = await deployAndInvoke({ contract }, 4, 1, 5, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(3);

    response = await deployAndInvoke({ contract }, 9, 1, 3, 5);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(10);

    response = await deployAndInvoke({ contract }, 9, 5, 3, 5);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(8);
  });

  test('test Compare2', async () => {
    const contract = loadContract('./test/python/compiled/compareTest2.avm');

    let response = await deployAndInvoke({ contract }, 2, 2);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract }, 2, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();
  });
});
