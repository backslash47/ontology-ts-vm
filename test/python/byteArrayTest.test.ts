import 'babel-polyfill';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { loadContract, testAndBuild } from '../utils';

describe('ByteArray test', () => {
  test('test BA1', async () => {
    const contract = loadContract('./test/python/compiled/byteArrayTest.avm');

    const response = await testAndBuild(contract, []);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe('090102af09');
  });

  test('test BA2', async () => {
    const contract = loadContract('./test/python/compiled/byteArrayTest2.avm');

    const response = await testAndBuild(contract, [
      { type: 'ByteArray', value: new Buffer('abcefghi') },
      { type: 'ByteArray', value: new Buffer('zyxwvutrs') }
    ]);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString()).toBe('bcefghistaoheustnauzyxwvutrs');
  });

  test('test BA3', async () => {
    const contract = loadContract('./test/python/compiled/byteArrayTest3.avm');

    const response = await testAndBuild(contract, []);
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('hex')).toBe('0102aafe');
  });
});
