import 'babel-polyfill';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Demo test', () => {
  test('test 1', async () => {
    const contract = loadContract('./test/python/compiled/demo/demo1.avm');

    let response = await deployAndInvoke({ contract }, 'add', 1, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(7);

    response = await deployAndInvoke({ contract }, 'add', 2, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBigInteger().toJSNumber()).toBe(8);
  });
});
