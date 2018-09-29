import 'babel-polyfill';
import { Transaction } from '../../src/core/transaction';
import { isByteArrayType } from '../../src/vm/types/byteArray';
import { isInteropType } from '../../src/vm/types/interop';
import { deployAndInvoke, loadContract } from '../utils';

describe('System test', () => {
  test('test 1', async () => {
    const contract = loadContract('./test/python/compiled/blockchain/executionEngineTest.avm');

    let response = await deployAndInvoke({ contract }, 'executing_sh');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe('"rGz\xda\x8d>\xe4K,Q`_\xcc\x87\xe0\x9f\xd9d\x17');

    response = await deployAndInvoke({ contract }, 'calling_sh');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      '\xff\x95\xd6\x94\xf9\xf7\xaf\xcd\xf5\xc0\xbfe\xedz\x1c\xb4.\xdd\xa1\xd3'
    );

    response = await deployAndInvoke({ contract }, 'entry_sh');
    expect(isByteArrayType(response.result)).toBeTruthy();
    expect(response.result.getByteArray().toString('binary')).toBe(
      '\xc4\xf0\xf0\x18\xfe\x96e\xf2J\xe7j\xe0\xb0\tW\xc5\x1e.\x13t'
    );

    response = await deployAndInvoke({ contract }, 'script_container');
    expect(isInteropType(response.result)).toBeTruthy();

    if (isInteropType(response.result)) {
      expect(response.result.getInterface()).toBeInstanceOf(Transaction);
    }
  });
});
