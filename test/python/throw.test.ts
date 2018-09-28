import 'babel-polyfill';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Throw test', () => {
  test('test 1', async () => {
    const contract = loadContract('./test/python/compiled/throwTest.avm');

    const response = await deployAndInvoke({ contract }, 1);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    await expect(deployAndInvoke({ contract }, 4)).rejects.toBeTruthy();
  });

  test('test 2', async () => {
    const contract = loadContract('./test/python/compiled/throwIfNotTest.avm');

    const response = await deployAndInvoke({ contract }, true);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    await expect(deployAndInvoke({ contract }, false)).rejects.toBeTruthy();
  });
});
