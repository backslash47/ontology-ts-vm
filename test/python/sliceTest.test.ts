import 'babel-polyfill';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { deployAndInvoke, loadContract } from '../utils';

describe('Slice test', () => {
  test('test 1', async () => {
    const contract = loadContract('./test/python/compiled/sliceTest.avm');

    const response = await deployAndInvoke(contract);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe('\x01\x02\x03\x04');
  });

  test('test 2', async () => {
    const contract = loadContract('./test/python/compiled/sliceTest2.avm');

    const response = await deployAndInvoke(contract);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      '\x02\x03\x04\x02\x03\x04\x05\x06\x01\x02\x03\x04\x03\x04'
    );
  });
});
