import 'babel-polyfill';
import { isBooleanType } from '../../src/vm/types/boolean';
import { isIntegerType } from '../../src/vm/types/integer';
import { deployAndInvoke, loadContract } from '../utils';

describe('Verify Signature test', () => {
  test('test', async () => {
    const contract = loadContract('./test/python/compiled/verifySignatureTest.avm');

    let response = await deployAndInvoke({ contract }, 1);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();

    response = await deployAndInvoke({ contract }, 2);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();

    response = await deployAndInvoke({ contract }, 3);
    expect(isIntegerType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeFalsy();
  });
});
