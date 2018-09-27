import 'babel-polyfill';
import { isBooleanType } from '../../src/vm/types/boolean';
import { deployAndInvoke, loadContract } from '../utils';

describe.skip('Enumerator test', () => {
  test('test enumerators', async () => {
    const contract = loadContract('./test/python/compiled/demo/enumeratorTest.avm');

    const response = await deployAndInvoke(contract, 1);
    expect(isBooleanType(response.result)).toBeTruthy();
    expect(response.result.getBoolean()).toBeTruthy();
  });
});
